import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// Wails Bridge Code
import { main } from "../../wailsjs/go/models";
import { FetchMangaChapters } from "../../wailsjs/go/main/App";

// Layouts
import MainLayout from "../layouts/MainLayout";

// Components
import ChapterList from "../components/ChapterList";
import Spinner from "../components/skeletons/Spinner";

// Utils
import { formatAuthors } from "../utils/helper";

// TODO - Maybe change the skeleton loading to something else

interface MangaLinkState {
    manga: main.Manga;
    coverArtUrl: string;
}

export default function MangaDetails() {
    const location = useLocation();
    const state = location.state as MangaLinkState || {};
    const {manga, coverArtUrl} = state;

    const [chapters, setChapters] = useState<main.MangaChapters>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const mangaTitle = manga.attributes.title.en;

    useEffect(() => {
        async function fetchChapters() {
            setIsLoading(true);
            const mangaChapters = await FetchMangaChapters(manga.id);
            setChapters(mangaChapters);
            setIsLoading(false);
        }

        fetchChapters();
    }, []);

    return (
        <MainLayout>
            <div className="w-full h-auto flex flex-col overflow-y-auto">
                <div className="m-4">
                    <div className="flex flex-row gap-4">
                        {coverArtUrl && (
                            <img
                                src={coverArtUrl}
                                alt={mangaTitle + " cover art"}
                                className="w-40 aspect-[64/91] object-cover rounded-md"
                            />
                        )}
                        <div className="flex flex-col gap-1 items-start">
                            <p className="font-bold truncate w-full">{mangaTitle}</p>
                            <p className="text-sm truncate w-full text-gray-400">{formatAuthors(manga.authors)}</p>
                            <p className="w-10/12">{manga.attributes.description.en}</p>
                        </div>
                    </div>
                    {isLoading ? (
                        <Spinner />
                    ) : (
                        chapters && (<ChapterList chapters={chapters.data} mangaTitle={mangaTitle} />)
                    )}
                </div>
            </div>
        </MainLayout>
    );
}