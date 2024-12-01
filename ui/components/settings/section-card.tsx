import { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  children: ReactNode;
}

export function SectionCard({ title, children }: SectionCardProps) {
  return (
    <section className="rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-medium mb-4">{title}</h2>
      {children}
    </section>
  );
}
