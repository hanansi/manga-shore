import { Routes, Route } from "react-router-dom";

// Pages
import Library from "./pages/Library";
import History from "./pages/History";
import Browse from "./pages/Browse";
import Settings from "./pages/Settings";
import MangaDetails from "./pages/MangaDetails";
import ChapterReader from "./pages/ChapterReader";

import './App.css';

// TODO - Handle aborting for fetch so user cannot spam the search input
// TODO - Fetch chapters
// TODO - Have a back button that remembers the state of the search input
// TODO - Have a reading page that fetches all images of a chapter
// TODO - Add a track progress bar for different mangas
export default function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Library />} />
                <Route path="/history" element={<History />} />
                <Route path="/search" element={<Browse />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/manga" element={<MangaDetails />} />
                <Route path="/chapter" element={<ChapterReader />} />
            </Routes> 
        </>
    );
}