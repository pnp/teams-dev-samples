import { QuickLink } from "../models/quick-link";

// If duplicate IDs exist within the same area, the last entry wins.
export function deduplicateLinks(links: QuickLink[]) {
  const map = new Map<string, QuickLink>();

  for (const link of links) {
    map.set(link.id, link);
  }

  return Array.from(map.values());
}
