import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import FamilyGrid from "@/components/FamilyGrid";
import { api } from "@/lib/api";
import { formatLabel } from "@/lib/utils";

interface Props {
  params: Promise<{ domain: string; country: string }>;
}

export default async function CountryPage({ params }: Props) {
  const { domain, country } = await params;
  const families = await api.getFamilies(domain, country);

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-12 tracking-tight">
      <div className="max-w-[90%] md:max-w-[85%] mx-auto">
        <Breadcrumb domain={domain} country={country} />

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold mb-3 text-accent uppercase tracking-[0.2em]">
            {formatLabel(country)} — {formatLabel(domain)}
          </h1>
          <div className="w-28 h-0.5 mx-auto bg-accent mt-2 skew-x-12" />
          <p className="text-foreground/50 text-sm uppercase mt-4 tracking-widest font-mono">
            Select a family to explore {formatLabel(domain)} vehicles
          </p>
        </div>

        <FamilyGrid families={families} domain={domain} country={country} />

        {/* Back */}
        <div className="text-center mt-16">
          <Link
            href={`/${domain}`}
            className="inline-flex items-center space-x-2 px-6 py-3 border border-border hover:border-accent rounded-sm uppercase text-sm tracking-[0.2em] transition font-mono"
            style={{ clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0% 100%)" }}
          >
            <span>←</span>
            <span>Back to domain</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
