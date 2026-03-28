import Link from "next/link";
import ContentHeader from "@/components/ContentHeader";
import ArticleContent from "@/components/ArticleContent";
import { api } from "@/lib/api";

interface Props {
  params: Promise<{
    domain: string;
    country: string;
    family: string;
    model: string;
  }>;
}

export default async function ModelPage({ params }: Props) {
  const { domain, country, family, model } = await params;
  const data = await api.getModel(model);

  return (
    <main className="min-h-screen bg-background text-foreground px-4 py-10">
      <div className="max-w-[90%] md:max-w-[75%] mx-auto space-y-8">
        <ContentHeader model={data} domain={domain} country={country} />
        <ArticleContent model={data} />

        {/* Back */}
        <div className="border-t border-border pt-8 flex justify-center">
          <Link
            href={`/${domain}/${country}/${family}`}
            className="inline-flex items-center space-x-2 px-6 py-3 border border-border hover:border-accent rounded-sm uppercase text-sm tracking-[0.2em] transition font-mono"
            style={{ clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0% 100%)" }}
          >
            <span>←</span>
            <span>Back to family</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
