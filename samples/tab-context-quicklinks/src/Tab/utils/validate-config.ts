import { QuickLinksConfig } from "../models/quick-links-config";

export function validateConfig(data: unknown): data is QuickLinksConfig {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const object = data as Record<string, unknown>;

  if (!("default" in object)) {
    console.info("QuickLinks config: 'default' key is missing.");
    return false;
  }

  return true;
}
