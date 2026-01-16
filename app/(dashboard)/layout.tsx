import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DashboardLayout } from "@/components/farmer-dashboard/DashboardLayout";
import { redirect } from "next/navigation";
import { Toaster } from "react-hot-toast"; // 1. Add this import

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Security: If no session, they can't see the dashboard
  if (!session) {
    redirect("/login/farmer");
  }

  return (
    <DashboardLayout user={session.user}>
      <Toaster />
      {children}
    </DashboardLayout>
  );
}
