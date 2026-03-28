import Breadcrumb from "@/components/Breadcrumb";
import { ModelDetailDto } from "@/lib/api";

interface ContentHeaderProps {
  model: ModelDetailDto;
  domain: string;
  country: string;
}

export default function ContentHeader({
  model,
  domain,
  country,
}: ContentHeaderProps) {
  return (
    <>
      <header className="flex flex-col space-y-4">
        <Breadcrumb
          domain={domain}
          country={country}
          family={model.family.slug}
          familyTitle={model.family.name}
          model={model.slug}
          modelTitle={model.name}
        />
        <h1 className="text-4xl md:text-5xl font-bold text-accent">
          {model.name}
        </h1>
      </header>

      {model.imageUrl && (
        <img
          src={model.imageUrl}
          alt={model.name}
          className="w-full h-64 md:h-100 object-cover rounded-sm shadow-lg mt-6"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      )}

      {model.family.description && (
        <p className="text-foreground/70 text-lg leading-relaxed mt-6">
          {model.family.description}
        </p>
      )}
    </>
  );
}
