import SectionTitle from "@/components/SectionTitle";
import InfoRow from "@/components/InfoRow";
import { ModelDetailDto } from "@/lib/api";

interface Props {
  model: ModelDetailDto;
}

function stringify(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v);
}

function isObjectRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isArrayOfObjects(v: unknown): v is Record<string, unknown>[] {
  return Array.isArray(v) && v.every((item) => isObjectRecord(item));
}

function NamedCardList({ items }: { items: Record<string, unknown>[] }) {
  return (
    <div className="space-y-4">
      {items.map((item, i) => {
        const name = stringify(item["Name"]);
        const entries = Object.entries(item).filter(([k]) => k !== "Name");
        return (
          <div
            key={i}
            className="p-4 bg-surface border border-border rounded-sm"
          >
            {name && (
              <div className="text-sm text-foreground font-semibold mb-3 font-mono">
                {name}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {entries.map(([k, v]) => {
                const str = stringify(v);
                if (!str) return null;
                return <InfoRow key={k} label={k} value={str} />;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ArmamentSection({ armament }: { armament: Record<string, unknown> }) {
  const categories = ["Guns", "Rockets", "Missiles", "Bombs", "Others"];
  const hasAny = categories.some(
    (cat) =>
      Array.isArray(armament[cat]) && (armament[cat] as unknown[]).length > 0,
  );
  if (!hasAny) return null;

  return (
    <section>
      <SectionTitle>ARMAMENT</SectionTitle>
      <div className="space-y-6">
        {categories.map((cat) => {
          const list = armament[cat];
          if (!isArrayOfObjects(list) || list.length === 0) return null;
          return (
            <div key={cat}>
              <h4 className="text-sm font-semibold text-accent font-mono uppercase tracking-widest mb-3">
                {cat}
              </h4>
              <NamedCardList items={list} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SpecSection({
  sectionKey,
  value,
}: {
  sectionKey: string;
  value: unknown;
}) {
  if (sectionKey === "ARMAMENT" && isObjectRecord(value)) {
    return <ArmamentSection armament={value} />;
  }

  if (isArrayOfObjects(value)) {
    if (value.length === 0) return null;
    return (
      <section>
        <SectionTitle>{sectionKey}</SectionTitle>
        <NamedCardList items={value} />
      </section>
    );
  }

  if (isObjectRecord(value)) {
    const entries = Object.entries(value).filter(([, v]) => {
      const str = stringify(v);
      return str !== "";
    });
    if (entries.length === 0) return null;
    return (
      <section>
        <SectionTitle>{sectionKey}</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {entries.map(([k, v]) => (
            <InfoRow key={k} label={k} value={stringify(v)} />
          ))}
        </div>
      </section>
    );
  }

  return null;
}

export default function ArticleContent({ model }: Props) {
  return (
    <article className="max-w-5xl mx-auto space-y-8">
      {Object.entries(model.specs ?? {}).map(([key, value]) => (
        <SpecSection key={key} sectionKey={key} value={value} />
      ))}

      {model.article && (
        <section className="border-t border-border pt-6">
          <SectionTitle>Service History</SectionTitle>
          <p className="text-foreground/70 whitespace-pre-line leading-relaxed text-justify">
            {model.article}
          </p>
        </section>
      )}

      {model.operators?.length > 0 && (
        <section>
          <SectionTitle>OPERATORS</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {model.operators.map((op, i) => (
              <InfoRow key={i} label={op.countryName} value={op.notes ?? ""} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
