export default function SkeletonMangaCard() {
    return (
        <div className="w-full h-auto animate-pulse ">
            <div className="w-full aspect-[64/91] bg-gray-300 dark:bg-gray-700 rounded-md"></div>
            <div className="flex flex-col items-start py-1">
                <div className="w-3/4 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 mb-2.5"></div>
                <div className="w-1/2 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 mb-2.5"></div>
            </div>
        </div>
    );
}