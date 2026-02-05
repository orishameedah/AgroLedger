import { getProduceById } from "@/lib/actions/produce.actions";
import { getFarmerSettings } from "@/lib/actions/user.actions";
import ProductDetailsClient from "@/components/marketplace/ProductDetailsPage";
import { notFound } from "next/navigation";
import RelatedProduce from "@/components/marketplace/RelatedProduce";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let produce;

  try {
    // Attempt to fetch
    produce = await getProduceById(id);

    // Check 1: If the fetch worked but the ID is genuinely wrong in MongoDB
    if (produce === null) {
      return notFound();
    }
  } catch (error) {
    // Check 2: If the fetch CRASHED (Timeout, No Internet, MongoDB Down)
    // This forces Next.js to show error.tsx
    throw new Error("NETWORK_FAILURE");
  }

  // Check 3: Proceed to fetch farmer settings
  const farmer = await getFarmerSettings(produce.userId);
  console.log("Farmer data from Server:", farmer); // Check your terminal, not the browser console

  return (
    <div className="max-w-7xl mx-auto px-4 py-5">
      <ProductDetailsClient produce={produce} farmer={farmer} />
      <RelatedProduce
        farmerId={produce.userId}
        category={produce.category}
        currentProduceId={id}
        farmName={farmer.farmName}
      />
    </div>
  );
}
