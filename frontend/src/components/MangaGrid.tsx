// Wails Bridge Code
import { main } from "../../wailsjs/go/models";

// Components
import MangaCard from "./MangaCard";


interface MangaGridProps {
    mangas: main.Manga[];
}

export default function MangaGrid({ mangas }: MangaGridProps) {
    return (
        <div className="grid grid-cols-4 gap-8 m-6 w-11/12">
            {mangas.map(manga => 
                <MangaCard
                    key={manga.id} 
                    manga={manga}
                />)
            }
        </div>
    );
}