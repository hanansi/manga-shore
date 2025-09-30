import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// Wails Bridge Code
import { FetchChapterImages } from "../../wailsjs/go/main/App";
import { main } from "../../wailsjs/go/models";

// Components
import BackButton from "../components/BackButton";

// TODO - Make the reader page have better UI/UX
// TODO - Make the code within useEffect navigation less redundant
// TODO - When the end of chapter is reached, go to next chapter
// TODO - Add chapter completed boolean

interface ChapterLinkState {
    chapter: main.Chapter;
}

export default function ChapterReader() {
    const location = useLocation();
    const state = location.state as ChapterLinkState || {};
    const {chapter} = state;

    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [imageCount, setImageCount] = useState<number>(0);
    const [nextIndex, setNextIndex] = useState<number>(0);

    useEffect(() => {
        async function fetchImageUrls() {
            const chapterImageUrls = await FetchChapterImages(chapter.id);
            setImageUrls(chapterImageUrls);
            setImageCount(chapterImageUrls.length);
        }

        fetchImageUrls();
    }, [chapter.id]);

    useEffect(() => {
        function handleKeyPress(event: KeyboardEvent) {
            switch (event.code) {
                case "ArrowLeft":
                    if (nextIndex > 0 ){
                        setNextIndex((prevIndex) => prevIndex - 1);
                    } else {
                        console.log("Beginning of chapter.")
                    }
                    break;
                case "ArrowRight":
                    if (nextIndex < imageCount - 1) {
                        setNextIndex((prevIndex) => prevIndex + 1);
                    } else {
                        console.log("End of chapter.")
                    }

                    break;
                default:
                    break;
            }
        }

        function handleClick(event: MouseEvent) {
            console.log(event.clientX);
            const windowWidth = window.innerWidth;

            const thirdWindowWidth = windowWidth / 3;

            // Left side
            if (event.clientX > 0 && event.clientX <= thirdWindowWidth) {
                if (nextIndex > 0) {
                    setNextIndex((prevIndex) => prevIndex - 1);
                }

            // Right side
            } else if (event.clientX > thirdWindowWidth * 2 && event.clientX <= windowWidth ) {
                if (nextIndex < imageCount - 1 ) {
                    setNextIndex((prevIndex) => prevIndex + 1);
                }
            }
        }

        document.addEventListener("keydown", handleKeyPress);
        document.addEventListener("click", handleClick);

        return () => {
            document.removeEventListener("keydown", handleKeyPress);
            document.removeEventListener("click", handleClick);
        }
    }, [nextIndex, imageCount]);

    return (
        <div className="flex flex-row justify-center items-center w-screen h-screen bg-zinc-900 overflow-y-auto">
            <BackButton />
            {imageUrls && (
                // imageUrls.map((url) => <img src={url} className="w-28 aspect-[64/91] object-cover" />)
                <img src={imageUrls[nextIndex]} className="h-screen object-contain select-none" />
            )}
        </div>
    );
}