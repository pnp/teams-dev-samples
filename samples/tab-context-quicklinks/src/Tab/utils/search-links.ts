import { QuickLink } from "../models/quick-link";

export function searchLinks(links: QuickLink[], query: string) {
  const trimmed = query.trim().toLowerCase();

  if (!trimmed) {
    return links;
  }

  return links.filter((link) => {
    const titleMatch = link.title.toLowerCase().includes(trimmed);
    const descriptionMatch = link.description?.toLowerCase().includes(trimmed) ?? false;
    return titleMatch || descriptionMatch;
  });
}
