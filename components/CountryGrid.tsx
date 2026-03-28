"use client";

import { useState } from "react";
import Link from "next/link";
import { CountryDto } from "@/lib/api";
import { formatLabel } from "@/lib/utils";

interface Props {
  countries: CountryDto[];
  domain: string;
}

export default function CountryGrid({ countries, domain }: Props) {
  const [search, setSearch] = useState("");

  const filtered = countries.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      {/* Search */}
      <div className="text-center mb-10">
        <input
          type="text"
          placeholder="Filter by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-surface border border-border text-foreground text-sm px-4 py-2 w-64 rounded-sm focus:outline-none focus:border-accent font-mono text-center tracking-widest"
        />
      </div>

      {/* Stats */}
      {filtered.length > 0 && (
        <div className="text-center mb-10 text-foreground/40 uppercase text-xs tracking-[0.25em] font-mono">
          {filtered.length} {filtered.length === 1 ? "country" : "countries"}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center mt-16 text-foreground/40 uppercase font-mono">
          No available data for &quot;{search}&quot;.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-8">
          {filtered.map((country) => (
            <Link
              key={country.id}
              href={`/${encodeURIComponent(domain)}/${encodeURIComponent(country.slug)}`}
              className="group block"
            >
              <div
                className="relative overflow-hidden bg-surface border border-border rounded-sm transition-all duration-200 hover:border-accent/80 hover:shadow-[0_0_15px_rgba(234,179,8,0.15)]"
                style={{ clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0% 100%)" }}
              >
                <div className="p-6 -skew-x-4">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-accent/40" />

                  <h3 className="text-xl font-bold mb-2 text-accent skew-x-4">
                    {formatLabel(country.name)}
                  </h3>

                  <div className="mt-4 pt-3 border-t border-border group-hover:border-accent/60 transition skew-x-4">
                    <p className="text-xs uppercase tracking-wide text-foreground/50 group-hover:text-accent transition font-mono">
                      Access dossier →
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
