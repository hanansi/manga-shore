// Layouts
import MainLayout from "../layouts/MainLayout";

export default function Library() {
    return (
        <MainLayout>
            <div className="flex-1 min-h-screen overflow-y-auto">
                <div className="flex flex-col items-center mt-3.5">
                    <h1>Library</h1>
                </div>
            </div>
        </MainLayout>
    );
}