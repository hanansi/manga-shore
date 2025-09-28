import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Wails Bridge Code
import { main } from "../../wailsjs/go/models";
import { FormatCoverArtUrl } from "../../wailsjs/go/main/App";

// Utils
import { formatAuthors } from "../utils/helper";


interface MangaCardProps {
    manga: main.Manga;
}

export default function MangaCard({ manga }: MangaCardProps) {
    const [coverArtUrl, setCoverArtUrl] = useState<string>("");

    const mangaTitle = manga.attributes.title.en;

    useEffect(() => {
        async function fetchCoverArtURL() {
            const coverArtUrl = await FormatCoverArtUrl(manga.id, manga.coverArt.fileName);
            setCoverArtUrl(coverArtUrl);
        }

        fetchCoverArtURL();
    }, []);
    
    return (
        <Link to="/manga" state={{manga, coverArtUrl}}>
            <div className="w-full h-auto cursor-pointer" title={mangaTitle}>
                {coverArtUrl && (<img src={coverArtUrl} alt={mangaTitle + " cover art"} className="w-full aspect-[64/91] object-cover rounded-md"/>)}
                <div className="flex flex-col items-start py-1">
                    <p className="font-bold truncate w-full">{mangaTitle}</p>
                    <p className="text-sm truncate w-full text-gray-400">{formatAuthors(manga.authors)}</p>
                </div>
            </div>
        </Link>
    );
}