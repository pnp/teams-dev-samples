export function isHttpUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:";
  } catch {
    return false;
  }
}
