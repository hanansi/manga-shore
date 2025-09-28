import { useState } from "react";


interface SearchBarProps {
    onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [mangaQuery, setMangaQuery] = useState<string>("");

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const query = formData.get("manga-query") as string;

        if (!query) return; // Early return when query is empty

        // TODO - This stops the form from being spammed (maybe the cancelling isn't needed within the go backend)
        if (query === mangaQuery) return; // Early return if the query text didn't changed
        setMangaQuery(query);

        onSearch(query);
    }

    return(
        <form onSubmit={handleSubmit}>
            <input
                type='text'
                name="manga-query"
                className='bg-gray-50 text-black p-2 rounded-l-lg'
            />
            <button type="submit" className="bg-gray-300 text-black p-2 rounded-r-lg cursor-pointer">Search</button>
        </form>
    );
}