// app/(marketplaceBuyer)/layout.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { redirect } from "next/navigation";
import { Toaster } from "react-hot-toast";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // 1. Security: If no session, redirect to a general login or buyer login
  if (!session) {
    redirect("/login/buyer");
  }

  // 2. Wrap children in the Marketplace-specific shell
  // We pass the entire user object (containing name, role, email) to the layout
  return (
    <MarketplaceLayout user={session.user}>
      <Toaster position="top-center" />
      {children}
    </MarketplaceLayout>
  );
}
