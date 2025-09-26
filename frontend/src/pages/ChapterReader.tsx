import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// Wails Bridge Code
import { FetchChapterImages } from "../../wailsjs/go/main/App";
import { main } from "../../wailsjs/go/models";


interface ChapterLinkState {
    chapter: main.Chapter;
}

export default function ChapterReader() {
    const location = useLocation();
    const state = location.state as ChapterLinkState || {};
    const {chapter} = state;

    const [imageUrls, setImageUrls] = useState<string[]>([]);

    useEffect(() => {
        async function fetchImageUrls() {
            const chapterImageUrls = await FetchChapterImages(chapter.id);
            setImageUrls(chapterImageUrls);
        }

        fetchImageUrls();
    }, [])

    return (
        <div className="grid grid-cols-4 gap-4 justify-center items-center w-screen h-screen bg-zinc-900">
            {imageUrls && (
                imageUrls.map(url => <img src={url} className="w-40 aspect-[64/91] object-cover" />)
            )}
        </div>
    )
}