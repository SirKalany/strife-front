"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";
import { api, DomainDto, CountryDto, FamilyDto } from "@/lib/api";
import { adminApi } from "@/lib/adminApi";
import Link from "next/link";

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
  slug: string;
  name: string;
  yearIntroduced: string;
  yearRetired: string;
  imageUrl: string;
  article: string;
  specs: SpecSection[];
  operators: OperatorEntry[];
}

// --- Helpers ---

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

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

// --- Step indicator ---

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`w-7 h-7 flex items-center justify-center text-xs font-mono border rounded-sm transition ${
              i + 1 === current
                ? "border-accent text-accent"
                : i + 1 < current
                  ? "border-accent bg-accent text-background"
                  : "border-border text-foreground/30"
            }`}
          >
            {i + 1}
          </div>
          {i < total - 1 && (
            <div
              className={`w-8 h-0.5 ${i + 1 < current ? "bg-accent" : "bg-border"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// --- Shared input styles ---

const inputClass =
  "w-full bg-background border border-border text-foreground px-3 py-2 text-sm font-mono focus:outline-none focus:border-accent transition rounded-sm";

const labelClass =
  "text-xs font-mono uppercase tracking-widest text-foreground/50 block mb-1";

// --- Main page ---

export default function NewArticlePage() {
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) router.push("/admin");
  }, [router]);

  const [step, setStep] = useState(1);

  // Step 1
  const [domains, setDomains] = useState<DomainDto[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<DomainDto | null>(null);

  // Step 2
  const [countries, setCountries] = useState<CountryDto[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryDto | null>(
    null,
  );
  const [newCountryName, setNewCountryName] = useState("");
  const [creatingCountry, setCreatingCountry] = useState(false);

  // Step 3
  const [families, setFamilies] = useState<FamilyDto[]>([]);
  const [selectedFamily, setSelectedFamily] = useState<FamilyDto | null>(null);
  const [newFamilyName, setNewFamilyName] = useState("");
  const [newFamilyImage, setNewFamilyImage] = useState("");
  const [newFamilyDescription, setNewFamilyDescription] = useState("");
  const [creatingFamily, setCreatingFamily] = useState(false);

  // Step 4
  const [modelForm, setModelForm] = useState<ModelForm>({
    slug: "",
    name: "",
    yearIntroduced: "",
    yearRetired: "",
    imageUrl: "",
    article: "",
    specs: [],
    operators: [],
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load domains on mount
  useEffect(() => {
    api.getDomains().then(setDomains);
  }, []);

  // Load ALL countries when domain is selected
  useEffect(() => {
    if (selectedDomain) {
      api.getAllCountries().then(setCountries);
    }
  }, [selectedDomain]);

  // Load families when country is selected
  useEffect(() => {
    if (selectedDomain && selectedCountry) {
      api
        .getFamilies(selectedDomain.slug, selectedCountry.slug)
        .then(setFamilies);
    }
  }, [selectedDomain, selectedCountry]);

  // --- Step 1: Domain ---
  function renderStep1() {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-accent uppercase tracking-widest mb-6">
          Select Domain
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {domains.map((domain) => (
            <button
              key={domain.slug}
              onClick={() => {
                setSelectedDomain(domain);
                setSelectedCountry(null);
                setSelectedFamily(null);
                setStep(2);
              }}
              className={`p-4 border text-left rounded-sm transition font-mono uppercase tracking-wide text-sm ${
                selectedDomain?.slug === domain.slug
                  ? "border-accent text-accent"
                  : "border-border text-foreground/50 hover:border-accent hover:text-accent"
              }`}
              style={{ clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0% 100%)" }}
            >
              {domain.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // --- Step 2: Country ---
  function renderStep2() {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-accent uppercase tracking-widest mb-6">
          Select or Create Country
        </h2>

        {countries.length > 0 && (
          <div>
            <p className={labelClass}>Existing countries</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {countries.map((country) => (
                <button
                  key={country.slug}
                  onClick={() => {
                    setSelectedCountry(country);
                    setStep(3);
                  }}
                  className={`p-4 border text-left rounded-sm transition font-mono uppercase tracking-wide text-sm ${
                    selectedCountry?.slug === country.slug
                      ? "border-accent text-accent"
                      : "border-border text-foreground/50 hover:border-accent hover:text-accent"
                  }`}
                  style={{
                    clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0% 100%)",
                  }}
                >
                  {country.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-border pt-6 space-y-3">
          <p className={labelClass}>Or create a new country</p>
          <input
            type="text"
            placeholder="Country name"
            value={newCountryName}
            onChange={(e) => setNewCountryName(e.target.value)}
            className={inputClass}
          />
          <button
            onClick={async () => {
              if (!newCountryName) return;
              setCreatingCountry(true);
              try {
                const created = await adminApi.createCountry({
                  slug: slugify(newCountryName),
                  name: newCountryName,
                  flagUrl: "",
                });
                setSelectedCountry({
                  id: created.id,
                  slug: created.slug,
                  name: created.name,
                  flagUrl: "",
                });
                setStep(3);
              } catch (e) {
                setError(
                  e instanceof Error ? e.message : "Failed to create country.",
                );
              } finally {
                setCreatingCountry(false);
              }
            }}
            disabled={creatingCountry || !newCountryName}
            className="px-6 py-2 bg-accent text-background font-bold uppercase tracking-widest text-xs font-mono hover:bg-accent-hover transition disabled:opacity-50 rounded-sm"
          >
            {creatingCountry ? "Creating..." : "Create & Select"}
          </button>
        </div>

        <button
          onClick={() => setStep(1)}
          className="text-xs font-mono text-foreground/40 hover:text-accent transition"
        >
          ← Back
        </button>
      </div>
    );
  }

  // --- Step 3: Family ---
  function renderStep3() {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-accent uppercase tracking-widest mb-6">
          Select or Create Family
        </h2>

        {families.length > 0 && (
          <div>
            <p className={labelClass}>Existing families</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {families.map((family) => (
                <button
                  key={family.slug}
                  onClick={() => {
                    setSelectedFamily(family);
                    setStep(4);
                  }}
                  className={`p-4 border text-left rounded-sm transition font-mono uppercase tracking-wide text-sm ${
                    selectedFamily?.slug === family.slug
                      ? "border-accent text-accent"
                      : "border-border text-foreground/50 hover:border-accent hover:text-accent"
                  }`}
                  style={{
                    clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0% 100%)",
                  }}
                >
                  {family.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-border pt-6 space-y-3">
          <p className={labelClass}>Or create a new family</p>
          <input
            type="text"
            placeholder="Family name"
            value={newFamilyName}
            onChange={(e) => setNewFamilyName(e.target.value)}
            className={inputClass}
          />
          <input
            type="text"
            placeholder="Image URL (optional)"
            value={newFamilyImage}
            onChange={(e) => setNewFamilyImage(e.target.value)}
            className={inputClass}
          />
          <textarea
            placeholder="Description (optional)"
            value={newFamilyDescription}
            onChange={(e) => setNewFamilyDescription(e.target.value)}
            rows={3}
            className={inputClass}
          />
          <button
            onClick={async () => {
              if (!newFamilyName || !selectedDomain || !selectedCountry) return;
              setCreatingFamily(true);
              try {
                const created = await adminApi.createFamily({
                  slug: slugify(newFamilyName),
                  name: newFamilyName,
                  imageUrl: newFamilyImage,
                  description: newFamilyDescription,
                  domainId: selectedDomain.id,
                  countryId: selectedCountry.id,
                });
                setSelectedFamily({
                  id: created.id,
                  slug: created.slug,
                  name: created.name,
                  imageUrl: created.imageUrl,
                  description: created.description,
                });
                setStep(4);
              } catch (e) {
                setError(
                  e instanceof Error ? e.message : "Failed to create family.",
                );
              } finally {
                setCreatingFamily(false);
              }
            }}
            disabled={creatingFamily || !newFamilyName}
            className="px-6 py-2 bg-accent text-background font-bold uppercase tracking-widest text-xs font-mono hover:bg-accent-hover transition disabled:opacity-50 rounded-sm"
          >
            {creatingFamily ? "Creating..." : "Create & Select"}
          </button>
        </div>

        <button
          onClick={() => setStep(2)}
          className="text-xs font-mono text-foreground/40 hover:text-accent transition"
        >
          ← Back
        </button>
      </div>
    );
  }

  // --- Step 4: Model ---
  function renderStep4() {
    return (
      <div className="space-y-8">
        <h2 className="text-xl font-bold text-accent uppercase tracking-widest mb-6">
          Create Model
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Name</label>
            <input
              type="text"
              value={modelForm.name}
              onChange={(e) =>
                setModelForm((f) => ({
                  ...f,
                  name: e.target.value,
                  slug: slugify(e.target.value),
                }))
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Slug (auto-generated)</label>
            <input
              type="text"
              value={modelForm.slug}
              onChange={(e) =>
                setModelForm((f) => ({ ...f, slug: e.target.value }))
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Year Introduced</label>
            <input
              type="number"
              value={modelForm.yearIntroduced}
              onChange={(e) =>
                setModelForm((f) => ({ ...f, yearIntroduced: e.target.value }))
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
              value={modelForm.yearRetired}
              onChange={(e) =>
                setModelForm((f) => ({ ...f, yearRetired: e.target.value }))
              }
              className={inputClass}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Image URL</label>
            <input
              type="text"
              value={modelForm.imageUrl}
              onChange={(e) =>
                setModelForm((f) => ({ ...f, imageUrl: e.target.value }))
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
                setModelForm((f) => ({
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

          {modelForm.specs.map((section, si) => (
            <div
              key={si}
              className="border border-border rounded-sm p-4 space-y-3 bg-surface"
            >
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Section name (e.g. DIMENSIONS)"
                  value={section.name}
                  onChange={(e) =>
                    setModelForm((f) => {
                      const specs = [...f.specs];
                      specs[si] = { ...specs[si], name: e.target.value };
                      return { ...f, specs };
                    })
                  }
                  className={inputClass}
                />
                <button
                  onClick={() =>
                    setModelForm((f) => ({
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
                      setModelForm((f) => {
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
                      setModelForm((f) => {
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
                      setModelForm((f) => {
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
                  setModelForm((f) => {
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
            value={modelForm.article}
            onChange={(e) =>
              setModelForm((f) => ({ ...f, article: e.target.value }))
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
                setModelForm((f) => ({
                  ...f,
                  operators: [...f.operators, { countryId: "", notes: "" }],
                }))
              }
              className="text-xs font-mono text-accent hover:text-accent-hover transition uppercase tracking-widest"
            >
              + Add Operator
            </button>
          </div>

          {modelForm.operators.map((op, oi) => (
            <div key={oi} className="flex gap-2">
              <select
                value={op.countryId}
                onChange={(e) =>
                  setModelForm((f) => {
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
                  setModelForm((f) => {
                    const operators = [...f.operators];
                    operators[oi] = { ...operators[oi], notes: e.target.value };
                    return { ...f, operators };
                  })
                }
                className={inputClass}
              />
              <button
                onClick={() =>
                  setModelForm((f) => ({
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
        <div className="flex items-center gap-4 pt-4 border-t border-border">
          <button
            onClick={() => setStep(3)}
            className="text-xs font-mono text-foreground/40 hover:text-accent transition"
          >
            ← Back
          </button>
          <button
            onClick={async () => {
              if (
                !modelForm.name ||
                !modelForm.yearIntroduced ||
                !selectedFamily
              )
                return;
              setSubmitting(true);
              setError("");
              try {
                await adminApi.createModel({
                  slug: modelForm.slug,
                  name: modelForm.name,
                  yearIntroduced: parseInt(modelForm.yearIntroduced),
                  yearRetired: modelForm.yearRetired
                    ? parseInt(modelForm.yearRetired)
                    : null,
                  imageUrl: modelForm.imageUrl,
                  article: modelForm.article,
                  specs: buildSpecsPayload(modelForm.specs),
                  familyId: selectedFamily.id,
                  operators: modelForm.operators
                    .filter((op) => op.countryId)
                    .map((op) => ({
                      countryId: op.countryId,
                      notes: op.notes,
                    })),
                });
                router.push("/admin/dashboard");
              } catch {
                setError("Failed to create model.");
              } finally {
                setSubmitting(false);
              }
            }}
            disabled={
              submitting || !modelForm.name || !modelForm.yearIntroduced
            }
            className="px-8 py-2 bg-accent text-background font-bold uppercase tracking-widest text-sm font-mono hover:bg-accent-hover transition disabled:opacity-50 rounded-sm"
            style={{ clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0% 100%)" }}
          >
            {submitting ? "Saving..." : "Save Article"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="text-xs text-accent font-mono tracking-widest mb-1">
            [ ADMIN PANEL ]
          </div>
          <h1 className="text-3xl font-bold text-accent uppercase tracking-[0.2em]">
            New Article
          </h1>
          <Link
            href="/admin/dashboard"
            className="text-xs font-mono text-foreground/40 hover:text-accent transition mt-2 inline-block"
          >
            ← Back to dashboard
          </Link>
        </div>

        <StepIndicator current={step} total={4} />

        <div className="border border-border bg-surface p-8 rounded-sm">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>
      </div>
    </main>
  );
}
