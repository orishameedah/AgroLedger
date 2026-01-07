import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FarmerSetupForm } from "@/components/forms/FarmerSetupForm";

export default async function FarmerSetupPage() {
  const session = await getServerSession(authOptions);

  // 1. Force Login Check
  if (!session) redirect("/login/farmer");

  // 2. Setup Completion Check
  if (session?.user?.isSetupComplete) {
    redirect("/farmer-dashboard");
  }

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center p-3 md:p-6 overflow-hidden bg-linear-to-b from-green-950/90 via-black/80 to-emerald-950/90 z-10">
      <FarmerSetupForm user={session.user} />
    </section>
  );
}
