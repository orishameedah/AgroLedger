import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col justify-center items-center gap-2">
        <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
        <p className="text-slate-500 font-medium">Loading Produce Details...</p>
      </div>
    </div>
  );
}
