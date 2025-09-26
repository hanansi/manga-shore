import { NavLink } from "react-router-dom";

// Lucide Icons
import { Compass, Ellipsis, Library, History } from "lucide-react";

// Components
import NavItem from "./NavItem";

export default function NavBar() {
    return (
        <div className="sticky top-0 h-screen w-1/6 max-w-24 left-0 bg-zinc-800 ">
           <nav className="flex flex-col gap-6 items-center mt-3.5">
               <NavLink to="/">
                   <NavItem title="Library" Icon={Library} />
               </NavLink>
               <NavLink to="/history">
                   <NavItem title="History" Icon={History} />
               </NavLink>
               <NavLink to="/search">
                   <NavItem title="Browse" Icon={Compass} />
               </NavLink>
               <NavLink to="/settings">
                   <NavItem title="More" Icon={Ellipsis} />
               </NavLink>
           </nav>
        </div>
    );
}