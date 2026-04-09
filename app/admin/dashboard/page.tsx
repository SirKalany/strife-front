"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isLoggedIn, removeToken } from "@/lib/auth";
import { api, ModelSummaryDto, FamilyDto, CountryDto } from "@/lib/api";
import { adminApi } from "@/lib/adminApi";

export default function AdminDashboard() {
  const router = useRouter();
  const [models, setModels] = useState<ModelSummaryDto[]>([]);
  const [families, setFamilies] = useState<FamilyDto[]>([]);
  const [countries, setCountries] = useState<CountryDto[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/admin");
      return;
    }
    api.getAllModels().then(setModels);
    api.getAllFamilies().then(setFamilies);
    api.getAllCountries().then(setCountries);
  }, [router]);

  function handleLogout() {
    removeToken();
    router.push("/admin");
  }

  async function handleDeleteModel(slug: string) {
    if (!confirm(`Delete model "${slug}" permanently?`)) return;
    setDeleting(slug);
    setError("");
    try {
      await adminApi.deleteModel(slug);
      setModels((prev) => prev.filter((m) => m.slug !== slug));
    } catch {
      setError(`Failed to delete model ${slug}.`);
    } finally {
      setDeleting(null);
    }
  }

  async function handleDeleteFamily(slug: string) {
    if (!confirm(`Delete family "${slug}" and ALL its models permanently?`))
      return;
    setDeleting(slug);
    setError("");
    try {
      await adminApi.deleteFamily(slug);
      setFamilies((prev) => prev.filter((f) => f.slug !== slug));
      api.getAllModels().then(setModels);
    } catch {
      setError(`Failed to delete family ${slug}.`);
    } finally {
      setDeleting(null);
    }
  }

  async function handleDeleteCountry(slug: string) {
    if (
      !confirm(
        `Delete country "${slug}" and ALL its families and models permanently?`,
      )
    )
      return;
    setDeleting(slug);
    setError("");
    try {
      await adminApi.deleteCountry(slug);
      setCountries((prev) => prev.filter((c) => c.slug !== slug));
      api.getAllFamilies().then(setFamilies);
      api.getAllModels().then(setModels);
    } catch {
      setError(`Failed to delete country ${slug}.`);
    } finally {
      setDeleting(null);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-6">
          <div>
            <div className="text-xs text-accent font-mono tracking-widest mb-1">
              [ ADMIN PANEL ]
            </div>
            <h1 className="text-3xl font-bold text-accent uppercase tracking-[0.2em]">
              Dashboard
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-border hover:border-red-500 text-foreground/50 hover:text-red-500 rounded-sm uppercase tracking-widest text-xs transition font-mono"
            style={{ clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0% 100%)" }}
          >
            Logout
          </button>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/new"
            className="group block border border-border hover:border-accent bg-surface p-6 rounded-sm transition hover:shadow-[0_0_15px_rgba(234,179,8,0.15)]"
            style={{ clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0% 100%)" }}
          >
            <div className="text-xs text-accent font-mono tracking-widest mb-2">
              [ NEW ENTRY ]
            </div>
            <h2 className="text-lg font-bold text-foreground uppercase tracking-wide group-hover:text-accent transition">
              Create Article
            </h2>
            <p className="text-foreground/40 text-sm font-mono mt-2">
              Add a new vehicle or weapon to the database.
            </p>
          </Link>
        </div>

        {/* Error */}
        {error && <p className="text-red-500 text-xs font-mono">{error}</p>}

        {/* Models */}
        <Section title="Models" items={models} getLabel={(m) => m.name}>
          {(filtered) =>
            filtered.map((model) => (
              <EntryRow
                key={model.slug}
                label={model.name}
                sub={`${model.yearIntroduced}${
                  model.yearRetired ? ` — ${model.yearRetired}` : " — present"
                }`}
                editHref={`/admin/edit/${model.slug}`}
                onDelete={() => handleDeleteModel(model.slug)}
                deleting={deleting === model.slug}
              />
            ))
          }
        </Section>

        {/* Families */}
        <Section title="Families" items={families} getLabel={(f) => f.name}>
          {(filtered) =>
            filtered.map((family) => (
              <EntryRow
                key={family.slug}
                label={family.name}
                onDelete={() => handleDeleteFamily(family.slug)}
                deleting={deleting === family.slug}
              />
            ))
          }
        </Section>

        {/* Countries */}
        <Section title="Countries" items={countries} getLabel={(c) => c.name}>
          {(filtered) =>
            filtered.map((country) => (
              <EntryRow
                key={country.slug}
                label={country.name}
                onDelete={() => handleDeleteCountry(country.slug)}
                deleting={deleting === country.slug}
              />
            ))
          }
        </Section>
      </div>
    </main>
  );
}

// --- Sub-components ---

function Section<T>({
  title,
  items,
  getLabel,
  children,
  defaultOpen = true,
}: {
  title: string;
  items: T[];
  getLabel: (item: T) => string;
  children: (filtered: T[]) => React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [filter, setFilter] = useState("");

  const filteredItems = items.filter((item) =>
    getLabel(item).toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div className="space-y-2">
      {/* Header */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between text-left text-sm font-mono uppercase tracking-widest text-foreground/50 hover:text-accent transition"
      >
        <span>
          {title} — {filteredItems.length}{" "}
          {filteredItems.length === 1 ? "entry" : "entries"}
        </span>
        <span
          className={`text-xs transform transition ${open ? "rotate-90" : ""}`}
        >
          ▶
        </span>
      </button>

      {/* Content */}
      {open && (
        <div className="space-y-3">
          {/* Filter */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={`Filter ${title.toLowerCase()}...`}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-border text-sm font-mono text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent"
            />
            {filter && (
              <button
                onClick={() => setFilter("")}
                className="text-xs font-mono text-foreground/50 hover:text-red-500"
              >
                Clear
              </button>
            )}
          </div>

          {/* List */}
          {filteredItems.length === 0 ? (
            <p className="text-foreground/30 font-mono text-sm">
              No matching entries.
            </p>
          ) : (
            <div className="space-y-2">{children(filteredItems)}</div>
          )}
        </div>
      )}
    </div>
  );
}

function EntryRow({
  label,
  sub,
  editHref,
  onDelete,
  deleting,
}: {
  label: string;
  sub?: string;
  editHref?: string;
  onDelete: () => void;
  deleting: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-surface border border-border rounded-sm">
      <div>
        <span className="text-foreground font-mono text-sm">{label}</span>
        {sub && (
          <span className="text-foreground/30 font-mono text-xs ml-3">
            {sub}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        {editHref && (
          <Link
            href={editHref}
            className="text-xs font-mono uppercase tracking-widest text-foreground/50 hover:text-accent transition"
          >
            Edit
          </Link>
        )}
        <button
          onClick={onDelete}
          disabled={deleting}
          className="text-xs font-mono uppercase tracking-widest text-foreground/50 hover:text-red-500 transition disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
