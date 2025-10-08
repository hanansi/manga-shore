import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Lucide Icons
import { LucideArrowLeft } from "lucide-react";

export default function BackButton() {
    const navigate = useNavigate();

    function goBack() {
        navigate(-1);
    }

    useEffect(() => {
        function handleGoBackInput(event: KeyboardEvent) {
            if (event.code === "Escape") {
                goBack();
            }
        } 

       document.addEventListener("keydown", handleGoBackInput);

       return () => {
        document.removeEventListener("keydown", handleGoBackInput);
       }
    }, []);

    return (
        <button onClick={goBack} 
            className="cursor-pointer ml-2 w-10 h-10 flex flex-row justify-center items-center hover:bg-stone-700/80 hover:rounded-full">
            <LucideArrowLeft />
        </button>
    );
}