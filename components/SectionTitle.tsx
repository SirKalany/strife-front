export default function SectionTitle({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="w-1 h-6 bg-accent" />
      <h2 className="text-2xl font-semibold text-accent uppercase tracking-widest">
        {children}
      </h2>
    </div>
  );
}