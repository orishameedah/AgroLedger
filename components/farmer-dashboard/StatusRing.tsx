import { getProduceSyncStatus } from "@/lib/utils/Produce";

const StatusRing = ({ produce, image }: { produce: any; image: string }) => {
  const { isOutOfSync } = getProduceSyncStatus(produce);

  let status = "none";

  if (produce.blockchainStatus === "processing") {
    status = "processing";
  } else if (produce.isPublished && isOutOfSync) {
    status = "sync";
  } else if (produce.isPublished) {
    status = "published";
  }

  return (
    <div className="relative w-12 h-12">
      <img
        src={image}
        className={`w-12 h-12 rounded-lg object-cover border-2 transition-all ${
          status === "published"
            ? "border-emerald-500 shadow-sm shadow-emerald-100"
            : status === "processing"
              ? "border-blue-500 animate-pulse"
              : status === "sync"
                ? "border-amber-500 shadow-sm shadow-amber-100"
                : "border-slate-400 dark:border-slate-700 shadow-inner"
        }`}
        alt={produce.name}
      />
      {status !== "none" && (
        <span
          className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-800 transition-colors duration-300 ${
            status === "published"
              ? "bg-emerald-500"
              : status === "processing"
                ? "bg-blue-500"
                : "bg-amber-500"
          }`}
        />
      )}
    </div>
  );
};

export { StatusRing };
