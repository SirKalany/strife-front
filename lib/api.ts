const API_BASE = "http://localhost:8080/api";

export interface DomainDto {
  id: string;
  slug: string;
  name: string;
}

export interface CountryDto {
  id: string;
  slug: string;
  name: string;
  flagUrl: string;
}

export interface FamilyDto {
  id: string;
  slug: string;
  name: string;
  imageUrl: string;
  description: string;
}

export interface ModelSummaryDto {
  id: string;
  slug: string;
  name: string;
  yearIntroduced: number;
  yearRetired: number | null;
  imageUrl: string;
}

export interface OperatorDto {
  country: CountryDto;
  notes: string;
}

export interface ModelDetailDto {
  id: string;
  slug: string;
  name: string;
  yearIntroduced: number;
  yearRetired: number | null;
  imageUrl: string;
  article: string;
  specs: Record<string, Record<string, unknown>>;
  family: FamilyDto;
  operators: OperatorDto[];
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
}

export const api = {
  getDomains: () => get<DomainDto[]>("/domains"),

  getCountries: (domain: string) =>
    get<CountryDto[]>(`/domains/${domain}/countries`),

  getFamilies: (domain: string, country: string) =>
    get<FamilyDto[]>(`/domains/${domain}/countries/${country}/families`),

  getModels: (family: string) =>
    get<ModelSummaryDto[]>(`/families/${family}/models`),

  getModel: (model: string) => get<ModelDetailDto>(`/models/${model}`),
};
