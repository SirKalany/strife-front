"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isLoggedIn } from "@/lib/auth";
import { api, CountryDto, ModelDetailDto } from "@/lib/api";
import { adminApi } from "@/lib/adminApi";

// --- Types ---

interface SpecField {
  key: string;
  value: string;
}

interface SpecSection {
  name: string;
  fields: SpecField[];
}

interface OperatorEntry {
  countryId: string;
  notes: string;
}

interface ModelForm {
  name: string;
  yearIntroduced: string;
  yearRetired: string;
  imageUrl: string;
  article: string;
  specs: SpecSection[];
  operators: OperatorEntry[];
}

// --- Helpers ---

function buildSpecsPayload(
  specs: SpecSection[],
): Record<string, Record<string, string>> {
  const result: Record<string, Record<string, string>> = {};
  for (const section of specs) {
    if (!section.name) continue;
    const fields: Record<string, string> = {};
    for (const field of section.fields) {
      if (field.key && field.value) fields[field.key] = field.value;
    }
    result[section.name.toUpperCase()] = fields;
  }
  return result;
}

function specsToSections(
  specs: Record<string, Record<string, unknown>>,
): SpecSection[] {
  return Object.entries(specs).map(([name, fields]) => ({
    name,
    fields: Object.entries(fields).map(([key, value]) => ({
      key,
      value: String(value),
    })),
  }));
}

// --- Shared input styles ---

const inputClass =
  "w-full bg-background border border-border text-foreground px-3 py-2 text-sm font-mono focus:outline-none focus:border-accent transition rounded-sm";

const labelClass =
  "text-xs font-mono uppercase tracking-widest text-foreground/50 block mb-1";

// --- Main page ---

export default function EditModelPage({
  params,
}: {
  params: Promise<{ model: string }>;
}) {
  const router = useRouter();
  const [modelSlug, setModelSlug] = useState("");
  const [modelData, setModelData] = useState<ModelDetailDto | null>(null);
  const [countries, setCountries] = useState<CountryDto[]>([]);
  const [form, setForm] = useState<ModelForm>({
    name: "",
    yearIntroduced: "",
    yearRetired: "",
    imageUrl: "",
    article: "",
    specs: [],
    operators: [],
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/admin");
      return;
    }
    params.then(({ model }) => {
      setModelSlug(model);
      Promise.all([api.getModel(model), api.getAllCountries()]).then(
        ([data, allCountries]) => {
          setModelData(data);
          setCountries(allCountries);
          setForm({
            name: data.name,
            yearIntroduced: String(data.yearIntroduced),
            yearRetired: data.yearRetired ? String(data.yearRetired) : "",
            imageUrl: data.imageUrl ?? "",
            article: data.article ?? "",
            specs: specsToSections(data.specs ?? {}),
            operators: data.operators.map((op) => ({
              countryId:
                allCountries.find((c) => c.slug === op.countrySlug)?.id ?? "",
              notes: op.notes ?? "",
            })),
          });
          setLoading(false);
        },
      );
    });
  }, [router, params]);

  async function handleSubmit() {
    if (!form.name || !form.yearIntroduced) return;
    setSubmitting(true);
    setError("");
    try {
      await adminApi.updateModel(modelSlug, {
        slug: modelSlug,
        name: form.name,
        yearIntroduced: parseInt(form.yearIntroduced),
        yearRetired: form.yearRetired ? parseInt(form.yearRetired) : null,
        imageUrl: form.imageUrl,
        article: form.article,
        specs: buildSpecsPayload(form.specs),
        familyId: modelData?.family.id,
        operators: form.operators
          .filter((op) => op.countryId)
          .map((op) => ({ countryId: op.countryId, notes: op.notes })),
      });
      router.push("/admin/dashboard");
    } catch {
      setError("Failed to update model.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground/40 font-mono text-sm uppercase tracking-widest">
          Loading...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="text-xs text-accent font-mono tracking-widest mb-1">
            [ ADMIN PANEL ]
          </div>
          <h1 className="text-3xl font-bold text-accent uppercase tracking-[0.2em]">
            Edit Model
          </h1>
          <Link
            href="/admin/dashboard"
            className="text-xs font-mono text-foreground/40 hover:text-accent transition mt-2 inline-block"
          >
            ← Back to dashboard
          </Link>
        </div>

        <div className="border border-border bg-surface p-8 rounded-sm space-y-8">
          {/* Read-only info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Slug (read-only)</label>
              <div className="px-3 py-2 bg-background border border-border rounded-sm text-foreground/30 font-mono text-sm">
                {modelSlug}
              </div>
            </div>
            <div>
              <label className={labelClass}>Family (read-only)</label>
              <div className="px-3 py-2 bg-background border border-border rounded-sm text-foreground/30 font-mono text-sm">
                {modelData?.family.name}
              </div>
            </div>
          </div>

          {/* Editable fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Year Introduced</label>
              <input
                type="number"
                value={form.yearIntroduced}
                onChange={(e) =>
                  setForm((f) => ({ ...f, yearIntroduced: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                Year Retired (leave empty if still in service)
              </label>
              <input
                type="number"
                value={form.yearRetired}
                onChange={(e) =>
                  setForm((f) => ({ ...f, yearRetired: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Image URL</label>
              <input
                type="text"
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, imageUrl: e.target.value }))
                }
                className={inputClass}
              />
            </div>
          </div>

          {/* Specs builder */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className={labelClass}>Specs</p>
              <button
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    specs: [
                      ...f.specs,
                      { name: "", fields: [{ key: "", value: "" }] },
                    ],
                  }))
                }
                className="text-xs font-mono text-accent hover:text-accent-hover transition uppercase tracking-widest"
              >
                + Add Section
              </button>
            </div>

            {form.specs.map((section, si) => (
              <div
                key={si}
                className="border border-border rounded-sm p-4 space-y-3 bg-background"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Section name (e.g. DIMENSIONS)"
                    value={section.name}
                    onChange={(e) =>
                      setForm((f) => {
                        const specs = [...f.specs];
                        specs[si] = { ...specs[si], name: e.target.value };
                        return { ...f, specs };
                      })
                    }
                    className={inputClass}
                  />
                  <button
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        specs: f.specs.filter((_, i) => i !== si),
                      }))
                    }
                    className="text-red-500 hover:text-red-400 font-mono text-xs uppercase tracking-widest shrink-0"
                  >
                    Remove
                  </button>
                </div>

                {section.fields.map((field, fi) => (
                  <div key={fi} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Field name"
                      value={field.key}
                      onChange={(e) =>
                        setForm((f) => {
                          const specs = [...f.specs];
                          const fields = [...specs[si].fields];
                          fields[fi] = { ...fields[fi], key: e.target.value };
                          specs[si] = { ...specs[si], fields };
                          return { ...f, specs };
                        })
                      }
                      className={inputClass}
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={field.value}
                      onChange={(e) =>
                        setForm((f) => {
                          const specs = [...f.specs];
                          const fields = [...specs[si].fields];
                          fields[fi] = { ...fields[fi], value: e.target.value };
                          specs[si] = { ...specs[si], fields };
                          return { ...f, specs };
                        })
                      }
                      className={inputClass}
                    />
                    <button
                      onClick={() =>
                        setForm((f) => {
                          const specs = [...f.specs];
                          specs[si] = {
                            ...specs[si],
                            fields: specs[si].fields.filter((_, i) => i !== fi),
                          };
                          return { ...f, specs };
                        })
                      }
                      className="text-red-500 hover:text-red-400 font-mono text-xs shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <button
                  onClick={() =>
                    setForm((f) => {
                      const specs = [...f.specs];
                      specs[si] = {
                        ...specs[si],
                        fields: [...specs[si].fields, { key: "", value: "" }],
                      };
                      return { ...f, specs };
                    })
                  }
                  className="text-xs font-mono text-foreground/40 hover:text-accent transition uppercase tracking-widest"
                >
                  + Add Field
                </button>
              </div>
            ))}
          </div>

          {/* Article */}
          <div>
            <label className={labelClass}>Article / Service History</label>
            <textarea
              value={form.article}
              onChange={(e) =>
                setForm((f) => ({ ...f, article: e.target.value }))
              }
              rows={8}
              className={inputClass}
              placeholder="Write the service history and article text here..."
            />
          </div>

          {/* Operators */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className={labelClass}>Operators</p>
              <button
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    operators: [...f.operators, { countryId: "", notes: "" }],
                  }))
                }
                className="text-xs font-mono text-accent hover:text-accent-hover transition uppercase tracking-widest"
              >
                + Add Operator
              </button>
            </div>

            {form.operators.map((op, oi) => (
              <div key={oi} className="flex gap-2">
                <select
                  value={op.countryId}
                  onChange={(e) =>
                    setForm((f) => {
                      const operators = [...f.operators];
                      operators[oi] = {
                        ...operators[oi],
                        countryId: e.target.value,
                      };
                      return { ...f, operators };
                    })
                  }
                  className={inputClass}
                >
                  <option value="">Select country</option>
                  {countries.map((c) => (
                    <option key={c.slug} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Notes"
                  value={op.notes}
                  onChange={(e) =>
                    setForm((f) => {
                      const operators = [...f.operators];
                      operators[oi] = {
                        ...operators[oi],
                        notes: e.target.value,
                      };
                      return { ...f, operators };
                    })
                  }
                  className={inputClass}
                />
                <button
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      operators: f.operators.filter((_, i) => i !== oi),
                    }))
                  }
                  className="text-red-500 hover:text-red-400 font-mono text-xs shrink-0"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-xs font-mono">{error}</p>}

          {/* Submit */}
          <div className="pt-4 border-t border-border">
            <button
              onClick={handleSubmit}
              disabled={submitting || !form.name || !form.yearIntroduced}
              className="px-8 py-2 bg-accent text-background font-bold uppercase tracking-widest text-sm font-mono hover:bg-accent-hover transition disabled:opacity-50 rounded-sm"
              style={{ clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0% 100%)" }}
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
