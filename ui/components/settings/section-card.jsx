
export function SectionCard({ title, children }) {
    return (
        <section className="rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-medium mb-4">{title}</h2>
            {children}
        </section>
    );
}