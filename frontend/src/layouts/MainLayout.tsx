import { ReactNode } from "react";

// Components
import NavBar from "../components/NavBar"


interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="flex flex-row w-screen h-screen bg-stone-900">
            <NavBar />
            { children }
        </div>
    );
}