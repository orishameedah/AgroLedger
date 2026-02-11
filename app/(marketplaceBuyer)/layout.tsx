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

  if (!session) {
    redirect("/login/buyer");
  }

  return (
    <MarketplaceLayout user={session.user}>
      <Toaster position="top-center" />
      {children}
    </MarketplaceLayout>
  );
}
