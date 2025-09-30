import { useNavigate } from "react-router-dom";

// Lucide Icons
import { LucideArrowLeft } from "lucide-react";

export default function BackButton() {
    const navigate = useNavigate();

    function goBack() {
        navigate(-1);
    }

    return (
        <button onClick={goBack} 
            className="absolute top-2 left-2 cursor-pointer w-auto h-auto">
            <LucideArrowLeft />
        </button>
    );
}