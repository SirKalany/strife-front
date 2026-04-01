"use client";

import Link from "next/link";
import { formatLabel } from "@/lib/utils";

interface BreadcrumbProps {
  domain?: string;
  country?: string;
  family?: string;
  familyTitle?: string;
  model?: string;
  modelTitle?: string;
}

export default function Breadcrumb({
  domain,
  country,
  family,
  familyTitle,
  model,
  modelTitle,
}: BreadcrumbProps) {
  return (
    <nav className="flex items-center justify-between text-sm text-foreground/50 mb-6">
      {/* Left: breadcrumb path */}
      <div className="flex items-center space-x-2">
        <Link href="/" className="hover:text-accent transition">
          Home
        </Link>

        {domain && (
          <>
            <span>/</span>
            {country || family || model ? (
              <Link
                href={`/${encodeURIComponent(domain)}`}
                className="hover:text-accent transition capitalize"
              >
                {decodeURIComponent(domain)}
              </Link>
            ) : (
              <span className="text-accent capitalize">
                {decodeURIComponent(domain)}
              </span>
            )}
          </>
        )}

        {country && (
          <>
            <span>/</span>
            {family || model ? (
              <Link
                href={`/${encodeURIComponent(domain!)}/${encodeURIComponent(country)}`}
                className="hover:text-accent transition capitalize"
              >
                {formatLabel(country)}
              </Link>
            ) : (
              <span className="text-accent capitalize">
                {formatLabel(country)}
              </span>
            )}
          </>
        )}

        {family && (
          <>
            <span>/</span>
            {model || modelTitle ? (
              <Link
                href={`/${encodeURIComponent(domain!)}/${encodeURIComponent(country!)}/${encodeURIComponent(family)}`}
                className="hover:text-accent transition"
              >
                {familyTitle || formatLabel(family)}
              </Link>
            ) : (
              <span className="text-accent">
                {familyTitle || formatLabel(family)}
              </span>
            )}
          </>
        )}

        {modelTitle && (
          <>
            <span>/</span>
            <span className="text-accent">{modelTitle}</span>
          </>
        )}
      </div>

      {/* Right: contact button */}
      <Link
        href="#"
        className="px-4 py-2 border border-border hover:border-accent text-foreground/50 hover:text-accent rounded-sm uppercase tracking-widest text-xs transition font-mono"
        style={{ clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0% 100%)" }}
      >
        Contact
      </Link>
      <Link
        href="/admin"
        className="px-4 py-2 border border-border hover:border-accent text-foreground/50 hover:text-accent rounded-sm uppercase tracking-widest text-xs transition font-mono"
        style={{ clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0% 100%)" }}
      >
        Admin
      </Link>
    </nav>
  );
}
