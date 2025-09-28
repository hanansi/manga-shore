import { useState } from "react";

// Wails Bridge Code
import { main } from "../../wailsjs/go/models";
import { FetchMangaByTitle, FetchMangaDetails } from "../../wailsjs/go/main/App";

// Layouts
import MainLayout from "../layouts/MainLayout";

// Components
import SearchBar from "../components/SearchForm";
import MangaGrid from "../components/MangaGrid";

export default function Browse() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [mangas, setMangas] = useState<main.Manga[]>([]);
    const [mangaCount, setMangaCount] = useState<number>(0);

    async function searchManga(query: string) {
        setIsLoading(true);
        setMangas([]); // Reset to empty array on every new search

        const mangaSearchResults = await FetchMangaByTitle(query);
        setMangaCount(mangaSearchResults.data.length);

        // Promise.allSettled is safer than Promise.all, since it
        // returns all promises even if some had failed
        const fetchedMangas = await Promise.allSettled(
            // Fetching the details for each individual manga from the search result
            mangaSearchResults.data.map(async (mangaItem) => FetchMangaDetails(mangaItem.id))
        );

        // TODO - Look into promises with rejected status, might not be totally necessary tho.
        setMangas(fetchedMangas
            .filter((promise) => promise.status === "fulfilled")
            .map(manga => (manga as PromiseFulfilledResult<main.Manga>).value)
        );

        // TODO - Probably better to put this after the Promise.allSettled
        setIsLoading(false); // Search has been completed
        // setTimeout(() => setIsLoading(false), 2000);
    }

    return (
        <MainLayout>
            <div className="flex-1 min-h-screen overflow-y-auto">
                <div className="flex flex-col items-center mt-3.5">
                    <SearchBar onSearch={searchManga} />
                    { mangas && (<MangaGrid mangas={mangas} mangaCount={mangaCount} isLoading={isLoading} />)}
                </div>
            </div>
        </MainLayout>
    );
}