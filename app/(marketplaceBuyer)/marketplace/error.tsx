// "use client";

// import { useEffect } from "react";

// export default function Error({
//   error,
//   reset,
// }: {
//   error: Error & { digest?: string };
//   reset: () => void;
// }) {
//   useEffect(() => {
//     // Log the error to an error reporting service or the console
//     console.error("Marketplace Error:", error);
//   }, [error]);

//   return (
//     <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
//       <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-full mb-6">
//         <svg
//           className="w-8 h-8 text-red-600"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="Refreshed-Network-Icon"
//           />
//         </svg>
//       </div>

//       <h2 className="text-2xl font-black text-slate-900 dark:text-white">
//         Connection Interrupted
//       </h2>
//       <p className="text-slate-500 mt-2 mb-8 max-w-sm">
//         We couldn't reach the marketplace. This usually happens due to a slow
//         internet connection.
//       </p>

//       <button
//         onClick={() => reset()}
//         className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-3xl font-bold shadow-lg shadow-emerald-200 dark:shadow-none transition-all active:scale-95"
//       >
//         Try Again
//       </button>
//     </div>
//   );
// }

"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    console.error("Marketplace Error:", error);
  }, [error]);

  const handleTryAgain = () => {
    startTransition(() => {
      router.refresh(); // Tells Next.js to fetch the server data again
      reset(); // Tries to re-render the error boundary
    });
  };

  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-full mb-6">
        <svg
          className="w-8 h-8 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="Refreshed-Network-Icon"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-black text-slate-900 dark:text-white">
        Connection Interrupted
      </h2>
      <p className="text-slate-500 mt-2 mb-8 max-w-sm">
        We couldn't reach the marketplace. This usually happens due to a slow
        internet connection.
      </p>

      <button
        onClick={handleTryAgain}
        disabled={isPending}
        className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-3xl font-bold transition-all active:scale-95 disabled:opacity-50"
      >
        {isPending ? "Connecting..." : "Try Again"}
      </button>
    </div>
  );
}
