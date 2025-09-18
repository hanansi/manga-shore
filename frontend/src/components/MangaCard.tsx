import { useState, useEffect } from "react";
import { FormatCoverArtUrl } from "../../wailsjs/go/main/App";

interface MangaCardProps {
    mangaId: string;
    title: string;
    author: string;
    coverArt: string;
}

export default function MangaCard({ mangaId, title, author, coverArt }: MangaCardProps) {
    const [imageUrl, setImageUrl] = useState<string>("");

    useEffect(() => {
        async function fetchCoverArtURL() {
            const coverArtUrl = await FormatCoverArtUrl(mangaId, coverArt);
            setImageUrl(coverArtUrl);
        }

        fetchCoverArtURL();
    }, []);

    return (
        <div className="w-full h-auto" title={title} onClick={() => console.log(mangaId)}>
            {/* TODO - Add a fetch loading placeholder */}
            <div className="cursor-pointer">
                {imageUrl && (<img src={imageUrl} alt={title + " cover art"} className="w-full aspect-[64/91] object-cover rounded-md"/>)}
            </div>
            <div className="flex flex-col items-start">
                <p className="font-bold truncate w-full">{title}</p>
                <p className="text-sm text-gray-400">{author}</p>
            </div>
        </div>
    );
}