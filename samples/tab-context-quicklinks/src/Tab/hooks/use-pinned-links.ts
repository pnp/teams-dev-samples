import { useCallback, useMemo, useState } from "react";
import { QuickLink } from "../models/quick-link";
import { buildPinnedStorageKey, loadPinnedIds, savePinnedIds } from "../services/storage-service";

function resolveInitialPins(links: QuickLink[], storageKey: string) {
  if (links.length === 0) {
    return [];
  }

  const validIds = new Set(links.map((link) => link.id));
  const stored = loadPinnedIds(storageKey);

  if (stored === null) {
    return links.filter((link) => link.pinnedByDefault).map((link) => link.id);
  }

  const cleaned = stored.filter((id) => validIds.has(id));

  const newDefaults = links.filter((link) => link.pinnedByDefault && !cleaned.includes(link.id)).map((link) => link.id);

  if (newDefaults.length > 0) {
    const merged = [...cleaned, ...newDefaults];
    savePinnedIds(storageKey, merged);
    return merged;
  }

  return cleaned;
}

export function usePinnedLinks(links: QuickLink[], userObjectId?: string, groupId?: string, channelId?: string) {
  const storageKey = useMemo(
    () => buildPinnedStorageKey(userObjectId, groupId, channelId),
    [userObjectId, groupId, channelId]
  );

  const [version, setVersion] = useState(0);

  const pinnedIds = useMemo(
    () => resolveInitialPins(links, storageKey),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [links, storageKey, version]
  );

  const togglePin = useCallback(
    (linkId: string) => {
      const current = loadPinnedIds(storageKey) ?? pinnedIds;
      let next: string[];

      if (current.includes(linkId)) {
        next = current.filter((id) => id !== linkId);
      } else {
        next = [...current, linkId];
      }

      savePinnedIds(storageKey, next);
      setVersion((version) => version + 1);
    },
    [storageKey, pinnedIds]
  );

  const pinnedLinks = useMemo(() => {
    const linkMap = new Map(links.map((link) => [link.id, link]));
    return pinnedIds
      .map((id) => linkMap.get(id))
      .filter((link): link is QuickLink => link !== undefined);
  }, [pinnedIds, links]);

  const unpinnedLinks = useMemo(() => {
    const pinSet = new Set(pinnedIds);
    return links.filter((link) => !pinSet.has(link.id));
  }, [pinnedIds, links]);

  return { pinnedLinks, unpinnedLinks, pinnedIds, togglePin };
}
