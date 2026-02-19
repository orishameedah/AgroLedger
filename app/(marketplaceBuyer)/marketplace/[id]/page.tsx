import { getProduceById } from "@/lib/actions/produce.actions";
import { getFarmerSettings } from "@/lib/actions/user.actions";
import ProductDetailsClient from "@/components/marketplace/ProductDetailsPage";
import { notFound } from "next/navigation";
import RelatedProduce from "@/components/marketplace/RelatedProduce";
import Chatbot from "@/components/ui/Chatbot";

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
  const combinedData = {
    produceName: produce.name,
    producePrice: produce.lastPublishedSnapshot?.pricePerUnit,
    produceQuantity: produce.lastPublishedSnapshot?.quantity,
    unit: produce.unit,
    farmerName: farmer.fullName,
    farmName: farmer.farmName,
    phoneNumber: farmer.phone,
    location: farmer.locations,
  };

  const serializedData = JSON.parse(JSON.stringify(combinedData));

  return (
    <div className="max-w-7xl mx-auto px-4 py-5">
      <ProductDetailsClient produce={produce} farmer={farmer} />
      <RelatedProduce
        farmerId={produce.userId}
        category={produce.category}
        currentProduceId={id}
        farmName={farmer.farmName}
      />
      <Chatbot contextType="product" contextData={serializedData} />
    </div>
  );
}
