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
      <header className="flex flex-col space-y-6">
        <Breadcrumb
          domain={domain}
          country={country}
          family={model.family?.slug}
          familyTitle={model.family?.name}
          model={model.slug}
          modelTitle={model.name}
        />
        <div className="max-w-3xl mx-auto w-full space-y-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-accent">
            {model.name}
          </h1>

          {model.family?.description && (
            <p className="text-foreground/60 text-base md:text-lg leading-relaxed">
              {model.family.description}
            </p>
          )}
        </div>
      </header>
      {model.family?.imageUrl && (
        <img
          src={model.family.imageUrl}
          alt={model.name}
          className="w-full h-64 md:h-100 object-cover rounded-sm shadow-lg mt-6"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      )}
    </>
  );
}
