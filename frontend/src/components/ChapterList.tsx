// Wails Bridge Code
import { main } from "../../wailsjs/go/models";

// Components
import ChapterItem from "./ChapterItem";

interface ChapterListProps {
    chapters: main.Chapter[];
    mangaTitle: string;
}

// TODO - Add a no results found when no manga chapters were found (chanpters.length === 0)
// TODO - Also add skeleton loading

export default function ChapterList({ chapters, mangaTitle }: ChapterListProps) {
    return (
        <ul className="h-auto py-2">
            {chapters.sort((a, b) => parseFloat(b.attributes.chapter) - parseFloat(a.attributes.chapter))
                    .map(chapter => <ChapterItem key={chapter.id} chapter={chapter} mangaTitle={mangaTitle} />)}
        </ul>
    );
}