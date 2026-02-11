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
    produce = await getProduceById(id);
    if (produce === null) {
      return notFound();
    }
  } catch (error) {
    throw new Error("NETWORK_FAILURE");
  }
  const farmer = await getFarmerSettings(produce.userId);

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
