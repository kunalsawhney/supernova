export default function Badge({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-accent text-white">
            {children}
        </span>
    );
}
