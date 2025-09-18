import MangaCard from "./MangaCard";
import { main } from "../../wailsjs/go/models";

interface MangaGridProps {
    mangas: main.Manga[];
}

export default function MangaGrid({ mangas }: MangaGridProps) {
    return (
        <div className="grid grid-cols-4 gap-8 m-6 w-11/12">
            {mangas.map(manga => 
                <MangaCard
                    key={manga.id} 
                    mangaId={manga.id}
                    title={manga.attributes.title.en} 
                    author={manga.author.name} 
                    coverArt={manga.coverArt.fileName}
                />)
            }
        </div>
    );
}