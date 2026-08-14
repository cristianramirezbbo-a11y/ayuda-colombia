export interface LeyendaItem {
  color: string;
  label: string;
  shape?: "circle" | "square";
}

export default function MapLegend({ items }: { items: LeyendaItem[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((item) => (
        <span
          key={item.label}
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600"
        >
          <span
            aria-hidden
            className="h-2.5 w-2.5 shrink-0"
            style={{
              backgroundColor: item.color,
              borderRadius: item.shape === "square" ? "3px" : "9999px",
            }}
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}
