import { useReducer, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// Wails Bridge Code
import { FetchChapterImages } from "../../wailsjs/go/main/App";
import { main } from "../../wailsjs/go/models";

// Components
import HeaderBar from "../components/HeaderBar";
import FooterBar from "../components/FootBar";

// TODO - Make the reader page have better UI/UX
// TODO - Add chapter completed boolean
// TODO - When the end of chapter is reached, go to next chapter

interface ChapterLinkState {
    chapter: main.Chapter;
    mangaTitle: string;
}

interface NavAction {
    type: NavActionType;
    payload?: NavPayload;
}

interface NavState {
    nextIndex: number;
    isVisible: boolean;
}

interface NavPayload {
    imageCount: number;
}

type NavEvent = KeyboardEvent | MouseEvent;
type NavActionType = "left" | "right" | "toggle";
type ReadingMode = "left-to-right" | "right-to-left" | "vertical";

function navReducer(state: NavState, action: NavAction): NavState {
    switch(action.type) {
        case "left":
            if (state.isVisible) return {...state, isVisible: false};
            if (state.nextIndex > 0) return {...state, nextIndex: state.nextIndex - 1};
            return state;

        case "right":
            if (state.isVisible) return {...state, isVisible: false};
            const MAX_IMAGE_INDEX = action.payload?.imageCount! - 1;
            if (state.nextIndex < MAX_IMAGE_INDEX ) return {...state, nextIndex: state.nextIndex + 1};
            return state;

        case "toggle":
            return {...state, isVisible: !state.isVisible};

        default:
            return state;
    }
}

let navInitialState: NavState = {
    nextIndex: 0,
    isVisible: false,
};

export default function ChapterReader() {
    const [readingMode, setReadingMode] = useState<ReadingMode>();
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [imageCount, setImageCount] = useState<number>(0);
    const [navState, dispatch] = useReducer(navReducer, navInitialState);

    const location = useLocation();
    const {chapter, mangaTitle} = location.state as ChapterLinkState;

    const {nextIndex, isVisible} = navState;

    useEffect(() => {
        async function fetchImageUrls() {
            const chapterImageUrls = await FetchChapterImages(chapter.id);
            setImageUrls(chapterImageUrls);
            setImageCount(chapterImageUrls.length);
        }

        fetchImageUrls();
    }, [chapter.id]);

    useEffect(() => {
        function handleNavigation(event: NavEvent) {
            if (event instanceof KeyboardEvent) {
                switch (event.code) {
                    case "ArrowLeft": dispatch({type: "left"}); break;
                    case "ArrowRight": dispatch({type: "right", payload: {imageCount: imageCount}}); break;
                    case "KeyV": dispatch({type: "toggle"}); break;
                    default: return;
                }

            } else if (event instanceof MouseEvent) {
                const windowWidth = window.innerWidth;
                const leftBoundaryX = windowWidth / 3;
                const rightBoundaryX = leftBoundaryX * 2;

                if (event.clientX > 0 && event.clientX <= leftBoundaryX) dispatch({type: "left"}); 
                if (event.clientX > rightBoundaryX && event.clientX <= windowWidth ) dispatch({type: "right", payload: {imageCount: imageCount}});
                if (event.clientX > leftBoundaryX && event.clientX <= rightBoundaryX) dispatch({type: "toggle"});
            }
        }

        document.addEventListener("keydown", handleNavigation);
        document.addEventListener("click", handleNavigation);

        return () => {
            document.removeEventListener("keydown", handleNavigation);
            document.removeEventListener("click", handleNavigation);
        }
        // FIXME - Removed nextIndex and isVisible from dependency array
    }, [imageCount]);

    return (
        <div className="flex flex-row justify-center items-center w-screen h-screen bg-zinc-900 overflow-y-auto">
            <HeaderBar chapter={chapter} isVisible={isVisible} mangaTitle={mangaTitle} />
            {imageUrls && (
                    <img src={imageUrls[nextIndex]} loading="lazy" className="h-screen object-contain select-none" />
            )}
            <div className="w-full h-10 flex flex-row justify-center items-center absolute bottom-0">
                <p className="font-bold text-base text-shadow-md text-shadow-zinc-900">
                    {nextIndex + 1}/{imageCount}
                </p>
            </div>
            <FooterBar isVisible={isVisible} />
        </div>
    );
}