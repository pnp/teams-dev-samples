import { QuickLinksConfig } from "../models/quick-links-config";

export async function loadQuickLinksConfig() {
  const url = `${import.meta.env.BASE_URL}config/quicklinks.json`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to load QuickLinks configuration from ${url} (HTTP ${response.status}).`);
  }

  const data: QuickLinksConfig = await response.json();
  return data;
}
