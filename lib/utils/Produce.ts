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
