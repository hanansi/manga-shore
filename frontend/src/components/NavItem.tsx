interface NavItemProps {
    title: string;
    Icon: React.ElementType;
}

export default function NavItem({ title, Icon }: NavItemProps) {
    return (
        <div className="flex flex-col gap-2 justify-center items-center cursor-pointer">
            <Icon />
            <p className="text-sm font-bold">{title}</p>
        </div>
    );
}