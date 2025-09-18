package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
)

const (
	baseUrl          = "https://api.mangadex.org"
	uploadUrl        = "https://uploads.mangadex.org/covers"
	mangaResultLimit = 10
)

type SearchedMangas struct {
	Data []MangaData `json:"data"`
}

type MangaData struct {
	ID string `json:"id"`
}

// Struct representing all the necessary information for a manga.
// Json tags don't map to the mangadex api, it's used for coversion into a javascript model
type Manga struct {
	ID         string             `json:"id"`
	Attributes MangaAttributes    `json:"attributes"`
	Author     AuthorAttributes   `json:"author"`
	CoverArt   CoverArtAttributes `json:"coverArt"`
}

type MangaDetails struct {
	Data MangaDetailsData `json:"data"`
}

type MangaDetailsData struct {
	ID            string               `json:"id"`
	Attributes    MangaAttributes      `json:"attributes"`
	Relationships []MangaRelationships `json:"relationships"`
}

type MangaAttributes struct {
	Title       MangaTitle       `json:"title"`
	Description MangaDescription `json:"description"`
}

type MangaTitle struct {
	English string `json:"en"`
}

type MangaDescription struct {
	English string `json:"en"`
}

type MangaRelationships struct {
	ID         string          `json:"id"`
	Type       string          `json:"type"`
	Attributes json.RawMessage `json:"attributes"`
}

// type MangaAuthorAndCoverArt struct {
// 	Author   AuthorAttributes
// 	CoverArt CoverArtAttributes
// }

type AuthorAttributes struct {
	Name string `json:"name"`
}

type CoverArtAttributes struct {
	FileName string `json:"fileName"`
}

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) FetchMangaByTitle(title string) SearchedMangas {
	formattedTitle := url.QueryEscape(title) // Properly formats title to a url query param
	mangaUrl := fmt.Sprintf("%s/manga?title=%s&limit=%d", baseUrl, formattedTitle, mangaResultLimit)
	response, err := http.Get(mangaUrl)
	if err != nil {
		log.Println(err)
	}

	responseData, err := io.ReadAll(response.Body)
	if err != nil {
		log.Println(err)
	}

	var mangas SearchedMangas
	if err := json.Unmarshal(responseData, &mangas); err != nil {
		log.Println(err)
	}

	return mangas
}

func (a *App) FetchMangaDetails(id string) Manga {
	mangaUrl := fmt.Sprintf("%s/manga/%s?includes[]=author&includes[]=artist&includes[]=cover_art", baseUrl, id)
	response, err := http.Get(mangaUrl)
	if err != nil {
		log.Println(err)
	}

	responseData, err := io.ReadAll(response.Body)
	if err != nil {
		log.Println(err)
	}

	var mangaDetails MangaDetails
	if err := json.Unmarshal(responseData, &mangaDetails); err != nil {
		log.Println(err)
	}

	// FIXME - Fix multiple author values
	mangaAuthor, mangaCoverArt := a.UnmarshalMangaRelationships(mangaDetails.Data.Relationships)

	return Manga{ID: mangaDetails.Data.ID, Attributes: mangaDetails.Data.Attributes, Author: mangaAuthor, CoverArt: mangaCoverArt}
}

func (a *App) UnmarshalMangaRelationships(mangaRelationships []MangaRelationships) (AuthorAttributes, CoverArtAttributes) {
	var mangaAuthor AuthorAttributes
	var mangaCoverArt CoverArtAttributes

	for _, value := range mangaRelationships {
		switch value.Type {
		case "author":
			if err := json.Unmarshal(value.Attributes, &mangaAuthor); err != nil {
				log.Println(err)
			}
		case "cover_art":
			if err := json.Unmarshal(value.Attributes, &mangaCoverArt); err != nil {
				log.Println(err)
			}
		}
	}

	return mangaAuthor, mangaCoverArt
}

func (a *App) FormatCoverArtUrl(id string, fileName string) string {
	return fmt.Sprintf("%s/%s/%s", uploadUrl, id, fileName)
}
