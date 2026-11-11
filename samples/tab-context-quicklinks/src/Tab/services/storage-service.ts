export function buildPinnedStorageKey(userObjectId?: string, groupId?: string, channelId?: string) {
  const userSegment = userObjectId ?? "anonymous";
  const groupSegment = groupId ?? "default";
  const channelSegment = channelId ?? "personal";
  return `quicklinks:pinned:${userSegment}:${groupSegment}:${channelSegment}`;
}

export function loadPinnedIds(storageKey: string) {
  try {
    const raw = localStorage.getItem(storageKey);

    if (raw === null) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return null;
    }

    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return null;
  }
}

export function savePinnedIds(storageKey: string, pinnedIds: string[]) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(pinnedIds));
  } catch {
    // localStorage unavailable — fail gracefully
  }
}
