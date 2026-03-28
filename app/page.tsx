import Link from "next/link";
import { api, DomainDto } from "@/lib/api";
import Carousel from "@/components/Carousel";
import { readdirSync } from "fs";
import { join } from "path";

function getCarouselImages(): string[] {
  const dir = join(process.cwd(), "public", "carousel");
  return readdirSync(dir)
    .filter((f) => /\.(webp|jpg|jpeg|png)$/i.test(f))
    .map((f) => `/carousel/${f}`);
}

export default async function Home() {
  const domains = await api.getDomains();
  const images = getCarouselImages();

  return (
    <main className="relative min-h-screen bg-background">
      <Carousel images={images} />
      <div className="absolute top-6 w-full text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-accent tracking-wide drop-shadow-lg">
          Military Equipment Database
        </h1>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
        <div className="flex gap-6">
          {domains.slice(0, 3).map((domain, index) => (
            <DomainCard key={domain.id} domain={domain} index={index} />
          ))}
        </div>
        <div className="flex gap-6">
          {domains.slice(3).map((domain, index) => (
            <DomainCard key={domain.id} domain={domain} index={index + 3} />
          ))}
        </div>
      </div>
    </main>
  );
}

function DomainCard({ domain, index }: { domain: DomainDto; index: number }) {
  return (
    <Link
      href={`/${domain.slug}`}
      className="group relative w-96 h-72"
      style={{ transform: "skew(-10deg, 0deg)" }}
    >
      <div
        className="absolute inset-0 bg-center bg-cover transition-all duration-300 group-hover:scale-105 border border-border group-hover:border-accent"
        style={{ backgroundImage: `url('/${domain.slug}image.webp')` }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-black/70 via-transparent to-black/90 group-hover:from-green-900/40 group-hover:to-black/80 transition-all duration-300" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34, 197, 94, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 197, 94, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      {/* Content */}
      <div
        className="relative h-full flex flex-col justify-center items-center"
        style={{ transform: "skew(10deg, 0deg)" }}
      >
        <div className="text-center">
          <div className="text-xs text-accent font-mono mb-1 opacity-80 group-hover:opacity-100">
            [ DOMAIN {String(index + 1).padStart(2, "0")} ]
          </div>
          <span className="text-3xl font-bold text-white tracking-wider group-hover:text-accent transition-colors">
            {domain.name.toUpperCase()}
          </span>
          <div className="mt-1 text-sm text-foreground/50 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
            &gt; ACCESS_GRANTED
          </div>
        </div>

        {/* Corner accent */}
        <div
          className="absolute top-2 right-2 w-3 h-3 bg-accent opacity-60 group-hover:opacity-100 transition-opacity"
          style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
        />
      </div>
    </Link>
  );
}
