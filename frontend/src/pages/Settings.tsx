import NavBar from "../components/NavBar";

export default function Library() {
    return (
        <div className="flex flex-row w-screen h-screen">
            <NavBar />
            <div className="bg-stone-900 flex-1 min-h-screen overflow-y-auto">
                <div className="flex flex-col items-center mt-3.5">
                    <h1>Settings</h1>
                </div>
            </div>
        </div>
    );
}