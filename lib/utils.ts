export function formatLabel(value: string): string {
  return decodeURIComponent(value).replace(/-/g, " ");
}
