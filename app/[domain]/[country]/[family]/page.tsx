import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import ModelGrid from "@/components/ModelGrid";
import { api } from "@/lib/api";

interface Props {
  params: Promise<{ domain: string; country: string; family: string }>;
}

export default async function FamilyPage({ params }: Props) {
  const { domain, country, family } = await params;

  const [models, families] = await Promise.all([
    api.getModels(family),
    api.getFamilies(domain, country),
  ]);

  const familyData = families.find((f) => f.slug === family);

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-12 tracking-tight">
      <div className="max-w-[90%] md:max-w-[85%] mx-auto space-y-8">
        <Breadcrumb
          domain={domain}
          country={country}
          family={family}
          familyTitle={familyData?.name}
        />

        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-5xl font-extrabold mb-3 text-accent uppercase tracking-[0.2em]">
            {familyData?.name ?? family}
          </h1>
          <div className="w-28 h-0.5 mx-auto bg-accent mt-2 skew-x-12" />

          {familyData?.imageUrl && (
            <div className="overflow-hidden mx-auto shadow-lg border border-border max-w-[90%] mt-8">
              <img
                src={familyData.imageUrl}
                alt={familyData.name}
                className="w-full h-80 object-cover object-center"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>
          )}

          {familyData?.description && (
            <p className="text-foreground/50 text-sm uppercase mt-4 tracking-widest font-mono max-w-2xl mx-auto">
              {familyData.description}
            </p>
          )}
        </div>

        <ModelGrid
          models={models}
          domain={domain}
          country={country}
          family={family}
        />

        {/* Back */}
        <div className="text-center mt-16">
          <Link
            href={`/${domain}/${country}`}
            className="inline-flex items-center space-x-2 px-6 py-3 border border-border hover:border-accent rounded-sm uppercase text-sm tracking-[0.2em] transition font-mono"
            style={{ clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0% 100%)" }}
          >
            <span>←</span>
            <span>Back to families</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
