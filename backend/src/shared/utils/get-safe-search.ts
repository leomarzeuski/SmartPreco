export function getSafeSearch(search: string): string {
  return search.replace(/[%_]/g, '\\$&');
}