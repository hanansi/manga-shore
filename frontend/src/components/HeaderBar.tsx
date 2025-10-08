// Wails Bridge Code
import { main } from "../../wailsjs/go/models";

// Components 
import BackButton from "./BackButton";

interface HeaderBarProps {
    chapter: main.Chapter;
    mangaTitle: string;
    isVisible: boolean;
}

export default function HeaderBar({ chapter, mangaTitle, isVisible }: HeaderBarProps) {
    return (
        <div className="w-full h-1/12 bg-zinc-800/90 absolute top-0" style={{visibility: isVisible ? "visible": "hidden" }}>
            <div className="flex flex-row gap-4 items-center my-1">
                <BackButton />
                <div>
                    <h1 className="text-sm font-bold text-white opacity-100">{"Ch" + chapter.attributes.chapter + ": " + chapter.attributes.title}</h1>
                    <p className="text-xs text-white">{mangaTitle}</p>
                </div>
            </div>
        </div>
    );
}