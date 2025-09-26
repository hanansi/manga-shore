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
    const [mangas, setMangas] = useState<Array<main.Manga>>([]);

    async function searchManga(query: string) {
        setMangas([]);

        const mangaSearchResults = await FetchMangaByTitle(query);

        // TODO - Implement Promise.allSettled instead
        const fetchedMangas = await Promise.all(
            mangaSearchResults.data.map(async (mangaItem) => 
                FetchMangaDetails(mangaItem.id)
            )
        );

        setMangas(fetchedMangas);
    }

    return (
        <MainLayout>
            <div className="flex-1 min-h-screen overflow-y-auto">
                <div className="flex flex-col items-center mt-3.5">
                    <SearchBar onSearch={searchManga} />
                    { mangas && <MangaGrid mangas={mangas}/> }
                </div>
            </div>
        </MainLayout>
    );
}