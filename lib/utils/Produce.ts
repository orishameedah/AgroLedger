export function getProduceSyncStatus(produce: any) {
  // 1. If not published at all
  if (!produce.isPublished || !produce.lastPublishedSnapshot) {
    return { isOutOfSync: false, status: "none" };
  }

  // 2. Check for mismatches
  const hasPriceMismatch =
    produce.pricePerUnit !== produce.lastPublishedSnapshot.pricePerUnit;
  const hasQuantityMismatch =
    produce.quantity !== produce.lastPublishedSnapshot.quantity;

  const isOutOfSync = hasPriceMismatch || hasQuantityMismatch;

  return {
    isOutOfSync,
    status: isOutOfSync ? "sync_required" : "published",
  };
}

export const formatTime = (t?: string) => {
  if (!t) return "";
  const [h, m = "00"] = t.split(":");
  let hour = parseInt(h, 10);
  const minute = m.slice(0, 2);
  const suffix = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${suffix}`;
};
