import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import CountryGrid from "@/components/CountryGrid";
import { api } from "@/lib/api";
import { formatLabel } from "@/lib/utils";

interface Props {
  params: Promise<{ domain: string }>;
}

export default async function DomainPage({ params }: Props) {
  const { domain } = await params;
  const countries = await api.getCountries(domain);

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-12 tracking-tight">
      <div className="max-w-[90%] md:max-w-[85%] mx-auto">
        <Breadcrumb domain={domain} />

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold mb-3 text-accent uppercase tracking-[0.2em]">
            {formatLabel(domain)}
          </h1>
          <div className="w-28 h-0.5 mx-auto bg-accent mt-2 skew-x-12" />
          <p className="text-foreground/50 text-sm uppercase mt-4 tracking-widest font-mono">
            Select a nation to review classified assets
          </p>
        </div>

        <CountryGrid countries={countries} domain={domain} />

        {/* Back */}
        <div className="text-center mt-16">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 border border-border hover:border-accent rounded-sm uppercase text-sm tracking-[0.2em] transition font-mono"
            style={{ clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0% 100%)" }}
          >
            <span>←</span>
            <span>Back to home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
