import { useState } from "react";
import { FetchMangaByTitle, FetchMangaDetails } from "../../wailsjs/go/main/App";
import { main } from "../../wailsjs/go/models";
import MangaGrid from "../components/MangaGrid";
import NavBar from "../components/NavBar";
import SearchMangaForm from "../components/SearchManga";

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
        <div className="flex flex-row w-screen h-screen">
            <NavBar />
            <div className="bg-stone-900 flex-1 min-h-screen overflow-y-auto">
                <div className="flex flex-col items-center mt-3.5">
                    <SearchMangaForm onSearch={searchManga} />
                    { mangas && <MangaGrid mangas={mangas}/> }
                </div>
            </div>
        </div>
    );
}