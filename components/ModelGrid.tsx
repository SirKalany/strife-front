"use client";

import { useState } from "react";
import Link from "next/link";
import { ModelSummaryDto } from "@/lib/api";

interface Props {
  models: ModelSummaryDto[];
  domain: string;
  country: string;
  family: string;
}

export default function ModelGrid({ models, domain, country, family }: Props) {
  const [search, setSearch] = useState("");

  const filtered = models.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      {/* Search */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Filter by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-surface border border-border text-foreground px-4 py-2 font-mono text-sm tracking-widest focus:outline-none focus:border-accent transition w-64 text-center rounded-sm"
        />
      </div>

      {/* Stats */}
      {filtered.length > 0 && (
        <div className="text-center mb-10 text-foreground/40 uppercase text-xs tracking-[0.25em] font-mono">
          {filtered.length} {filtered.length === 1 ? "model" : "models"}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center mt-16 text-foreground/40 uppercase font-mono">
          No models match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map((model) => (
            <Link
              key={model.slug}
              href={`/${encodeURIComponent(domain)}/${encodeURIComponent(country)}/${encodeURIComponent(family)}/${encodeURIComponent(model.slug)}`}
              className="group block"
            >
              <div
                className="relative overflow-hidden bg-surface border border-border rounded-sm transition-all duration-200 hover:border-accent/80 hover:shadow-[0_0_15px_rgba(234,179,8,0.15)]"
                style={{ clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0% 100%)" }}
              >
                {/* Image */}
                {model.imageUrl && (
                  <div className="overflow-hidden h-40">
                    <img
                      src={model.imageUrl}
                      alt={model.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  </div>
                )}

                <div className="p-6 -skew-x-4">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-accent/40" />

                  <h3 className="text-xl font-bold mb-1 text-accent skew-x-4">
                    {model.name}
                  </h3>

                  <p className="text-foreground/40 text-xs font-mono skew-x-4 mb-4">
                    {model.yearIntroduced}
                    {model.yearRetired
                      ? ` — ${model.yearRetired}`
                      : " — present"}
                  </p>

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
