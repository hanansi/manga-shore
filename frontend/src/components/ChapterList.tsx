
// Wails Bridge Code
import { main } from "../../wailsjs/go/models";

// Components
import ChapterItem from "./ChapterItem";

interface ChapterListProps {
    chapters: main.Chapter[];
}

export default function ChapterList({ chapters }: ChapterListProps) {
    return (
        <ul className="h-auto py-2">
            {chapters.sort((a, b) => parseFloat(b.attributes.chapter) - parseFloat(a.attributes.chapter))
                    .map(chapter => <ChapterItem key={chapter.id} chapter={chapter} />)}
        </ul>
    );
}