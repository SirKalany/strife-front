"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { isLoggedIn } from "@/lib/auth";
import { api, FamilyDto } from "@/lib/api";
import { adminApi } from "@/lib/adminApi";

const inputClass =
  "w-full bg-background border border-border text-foreground px-3 py-2 text-sm font-mono focus:outline-none focus:border-accent transition rounded-sm";

const labelClass =
  "text-xs font-mono uppercase tracking-widest text-foreground/50 block mb-1";

export default function EditFamilyPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.family as string;

  const [family, setFamily] = useState<FamilyDto | null>(null);
  const [form, setForm] = useState({
    name: "",
    imageUrl: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/admin");
      return;
    }

    if (!slug) return;

    api
      .getAllFamilies()
      .then((families) => {
        console.log("slug:", slug);
        console.log("families:", families);
        const found = families.find((f) => f.slug === slug);
        console.log("found:", found);

        if (found) {
          setFamily(found);
          setForm({
            name: found.name,
            imageUrl: found.imageUrl ?? "",
            description: found.description ?? "",
          });
        } else {
          setError("Family not found.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load family.");
        setLoading(false);
      });
  }, [router, slug]);

  async function handleSubmit() {
    if (!form.name) return;

    setSubmitting(true);
    setError("");

    try {
      await adminApi.updateFamily(slug, {
        slug,
        name: form.name,
        imageUrl: form.imageUrl,
        description: form.description,
      });

      router.push("/admin/dashboard");
    } catch {
      setError("Failed to update family.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground/40 font-mono text-sm uppercase">
          Loading...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="text-xs text-accent font-mono tracking-widest mb-1">
            [ ADMIN PANEL ]
          </div>
          <h1 className="text-3xl font-bold text-accent uppercase tracking-[0.2em]">
            Edit Family
          </h1>
          <Link
            href="/admin/dashboard"
            className="text-xs font-mono text-foreground/40 hover:text-accent transition mt-2 inline-block"
          >
            ← Back to dashboard
          </Link>
        </div>

        <div className="border border-border bg-surface p-8 rounded-sm space-y-6">
          <div>
            <label className={labelClass}>Slug (read-only)</label>
            <div className="px-3 py-2 bg-background border border-border text-foreground/30 font-mono text-sm">
              {slug}
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Name (Changing this may break image paths)
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Image URL (e.g. /family/t90.jpg)
            </label>
            <input
              type="text"
              value={form.imageUrl}
              onChange={(e) =>
                setForm((f) => ({ ...f, imageUrl: e.target.value }))
              }
              className={inputClass}
              placeholder="/family/t90.jpg"
            />
            {form.imageUrl && (
              <img
                src={form.imageUrl}
                alt="Preview"
                className="mt-3 w-full h-40 object-cover border border-border rounded-sm"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            )}
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              rows={4}
              className={inputClass}
            />
          </div>

          {error && <p className="text-red-500 text-xs font-mono">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={submitting || !form.name}
            className="w-full py-2 bg-accent text-background font-bold uppercase tracking-widest text-sm font-mono hover:bg-accent-hover transition disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </main>
  );
}
