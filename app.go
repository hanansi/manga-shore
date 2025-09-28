package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"sync"
)

const (
	baseUrl          = "https://api.mangadex.org"
	uploadUrl        = "https://uploads.mangadex.org"
	mangaResultLimit = 10
)

// TODO - Add better error handling for all functions

// Manga Related Structs
type SearchedMangas struct {
	Data []MangaData `json:"data"`
}

type MangaData struct {
	ID string `json:"id"`
}

// TODO - Simplify the structure of this struct for easier access of all properties
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
	ctx        context.Context
	httpClient *http.Client
	cancelMap  map[string]context.CancelFunc
	mu         sync.Mutex
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{
		httpClient: &http.Client{},
		cancelMap:  make(map[string]context.CancelFunc),
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) HttpRequest(url string) ([]byte, error) {
	a.mu.Lock()
	// cancel only if the same URL is already running
	if cancel, ok := a.cancelMap[url]; ok {
		cancel()
	}

	ctx, cancel := context.WithCancel(context.Background())
	a.cancelMap[url] = cancel
	a.mu.Unlock()

	request, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, fmt.Errorf("request build error: %w", err)
	}

	response, err := a.httpClient.Do(request)
	if err != nil {
		// If canceled, return a clean error
		if errors.Is(err, context.Canceled) {
			log.Println("request canceled:", url)
			return nil, nil
		}

		return nil, fmt.Errorf("http error: %w", err)
	}

	defer response.Body.Close()

	// optional: check HTTP status
	if response.StatusCode < 200 || response.StatusCode >= 300 {
		return nil, fmt.Errorf("unexpected status: %s", response.Status)
	}

	responseData, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, fmt.Errorf("read error: %w", err)
	}

	// If canceled mid-read, body could be empty
	if len(responseData) == 0 {
		return nil, nil
	}

	return responseData, nil
}

// TODO - Expand the search to fetch the total results, not just the limit
func (a *App) FetchMangaByTitle(title string) SearchedMangas {
	formattedTitle := url.QueryEscape(title) // Properly formats title to a url query param
	mangaUrl := fmt.Sprintf("%s/manga?title=%s&limit=%d", baseUrl, formattedTitle, mangaResultLimit)

	responseData, err := a.HttpRequest(mangaUrl)
	if err != nil {
		log.Println("FetchMangaByTitle error:", err)
		return SearchedMangas{}
	}

	if responseData == nil {
		// request was canceled → return empty result silently
		return SearchedMangas{}
	}

	var mangas SearchedMangas
	if err := json.Unmarshal(responseData, &mangas); err != nil {
		log.Println("json unmarshal error:", err)
	}

	return mangas
}

func (a *App) FetchMangaDetails(id string) Manga {
	mangaUrl := fmt.Sprintf("%s/manga/%s?includes[]=author&includes[]=artist&includes[]=cover_art", baseUrl, id)

	responseData, err := a.HttpRequest(mangaUrl)
	if err != nil {
		log.Println("FetchMangaDetails error:", err)
		return Manga{}
	}

	if responseData == nil {
		// request was canceled → return empty result silently
		return Manga{}
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
		// TODO - Look how to implement the HttpRequest for this
		response, err := http.Get(formattedUrl)
		if err != nil {
			log.Println(err)
		}

		responseData, err := io.ReadAll(response.Body)
		if err != nil {
			log.Println(err)
		}

		defer response.Body.Close()

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

	defer response.Body.Close()

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
		imageUrls = append(imageUrls, formattedImageUrl)
	}

	return imageUrls
}
