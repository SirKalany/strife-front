interface InfoRowProps {
  label: string;
  value: string;
}

export default function InfoRow({ label, value }: InfoRowProps) {
  if (!value) return null;

  return (
    <div className="flex justify-between items-start px-3 py-2 bg-surface border border-border rounded-sm text-sm">
      <span className="text-foreground/50 font-mono uppercase tracking-wide mr-4 shrink-0">
        {label}
      </span>
      <span className="text-foreground text-right">{value}</span>
    </div>
  );
}