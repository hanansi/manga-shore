import { Link } from "react-router-dom";

// Wails Bridge Code
import { main } from "../../wailsjs/go/models";


interface ChapterItemProps {
    chapter: main.Chapter;
    mangaTitle: string;
}

export default function ChapterItem({ chapter, mangaTitle }: ChapterItemProps) {
    return (
        <li key={chapter.id} className="list-none cursor-pointer w-11/12 my-2 rounded-md border bg-neutral-800">
            <Link to="/chapter" state={{chapter, mangaTitle}}>
                <div className="flex flex-row gap-1.5 pl-1">
                    <div className="w-auto">
                        <span>{"Chapter " + chapter.attributes.chapter + ": "}</span>
                    </div>
                    <div>
                        <span>{chapter.attributes.title}</span>
                    </div>
                </div>
            </Link>
        </li>
    );
}