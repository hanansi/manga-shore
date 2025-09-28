// Wails Bridge Code
import { main } from "../../wailsjs/go/models";

// Components
import MangaCard from "./MangaCard";
import SkeletonMangaCard from "./skeletons/SkeletonMangaCard";


interface MangaGridProps {
    mangas: main.Manga[];
    mangaCount: number;
    isLoading: boolean;
}

export default function MangaGrid({ mangas, mangaCount, isLoading }: MangaGridProps) {
    return (
        <div className="grid grid-cols-4 gap-8 m-6 w-11/12">
            {isLoading ? (
                Array.from({length: mangaCount}).map((_, i) => <SkeletonMangaCard key={i} />)
            ) : (
            mangas.map((manga) => <MangaCard key={manga.id} manga={manga} />)
            )}
        </div>
    );
}