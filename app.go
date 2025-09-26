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
	baseUrl   = "https://api.mangadex.org"
	uploadUrl = "https://uploads.mangadex.org"

	mangaResultLimit = 10
)

// Manga Related Structs

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
	Authors    []AuthorAttributes `json:"authors"`
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

// Chapter related structs
type MangaChapters struct {
	Data []Chapter `json:"data"`
}

type Chapter struct {
	ID         string            `json:"id"`
	Attributes ChapterAttributes `json:"attributes"`
}

type ChapterAttributes struct {
	Number string `json:"chapter"`
	Title  string `json:"title"`
}

type ChapterImagesMetadata struct {
	BaseUrl string        `json:"baseUrl"`
	Images  ChapterImages `json:"chapter"`
}

type ChapterImages struct {
	Hash      string   `json:"hash"`
	DataSaver []string `json:"dataSaver"`
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

	mangaAuthors, mangaCoverArt := a.UnmarshalMangaRelationships(mangaDetails.Data.Relationships)

	return Manga{ID: mangaDetails.Data.ID, Attributes: mangaDetails.Data.Attributes, Authors: mangaAuthors, CoverArt: mangaCoverArt}
}

func (a *App) UnmarshalMangaRelationships(mangaRelationships []MangaRelationships) ([]AuthorAttributes, CoverArtAttributes) {
	var mangaAuthors []AuthorAttributes
	var mangaCoverArt CoverArtAttributes

	for _, value := range mangaRelationships {
		switch value.Type {
		case "author":
			var mangaAuthor AuthorAttributes
			if err := json.Unmarshal(value.Attributes, &mangaAuthor); err != nil {
				log.Println(err)
			}

			mangaAuthors = append(mangaAuthors, mangaAuthor)

		case "cover_art":
			if err := json.Unmarshal(value.Attributes, &mangaCoverArt); err != nil {
				log.Println(err)
			}
		}
	}

	return mangaAuthors, mangaCoverArt
}

func (a *App) FormatCoverArtUrl(id string, fileName string) string {
	return fmt.Sprintf("%s/covers/%s/%s", uploadUrl, id, fileName)
}

func (a *App) PrintHelper(anything any) {
	fmt.Printf("%v\n", anything)
}

func (a *App) FetchMangaChapters(id string) MangaChapters {
	var mangaChapters MangaChapters
	offset := 0
	hasMoreData := true

	for hasMoreData {
		formattedUrl := fmt.Sprintf("%s/manga/%s/feed?translatedLanguage[]=en&offset=%d", baseUrl, id, offset)
		response, err := http.Get(formattedUrl)
		if err != nil {
			log.Println(err)
		}

		responseData, err := io.ReadAll(response.Body)
		if err != nil {
			log.Println(err)
		}

		var chapters MangaChapters
		if err := json.Unmarshal(responseData, &chapters); err != nil {
			log.Println(err)
		}

		if len(chapters.Data) > 0 {
			mangaChapters.Data = append(mangaChapters.Data, chapters.Data...)
			offset += 100
		} else {
			hasMoreData = false
		}
	}

	return mangaChapters
}

func (a *App) FetchChapterImages(id string) []string {
	var chapterImages ChapterImagesMetadata

	chapterImagesUrl := fmt.Sprintf("%s/at-home/server/%s", baseUrl, id)
	response, err := http.Get(chapterImagesUrl)
	if err != nil {
		log.Println(err)
	}

	responseData, err := io.ReadAll(response.Body)
	if err != nil {
		log.Println(err)
	}

	if err := json.Unmarshal(responseData, &chapterImages); err != nil {
		log.Println(err)
	}

	imageUrls := a.FormatChapterImageUrls(chapterImages)

	return imageUrls
}

func (a *App) FormatChapterImageUrls(chapterImages ChapterImagesMetadata) []string {
	var imageUrls []string

	for _, image := range chapterImages.Images.DataSaver {
		formattedImageUrl := fmt.Sprintf("%s/data-saver/%s/%s", chapterImages.BaseUrl, chapterImages.Images.Hash, image)
		fmt.Println(formattedImageUrl)
		imageUrls = append(imageUrls, formattedImageUrl)
	}

	return imageUrls
}
