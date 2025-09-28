import MainLayout from "../layouts/MainLayout";

// TODO - Add statistics
// TODO - Add about page
// TODO - Reader options
// TODO - Add apperance/theme changer
// TODO - Add download options/clear cache

export default function Library() {
    return (
        <MainLayout>
            <div className="flex-1 min-h-screen overflow-y-auto">
                <div className="flex flex-col items-center mt-3.5">
                    <h1>Settings</h1>
                </div>
            </div>
        </MainLayout>
    );
}