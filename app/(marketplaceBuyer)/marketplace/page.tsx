import { getAllMarketplaceProduce } from "@/lib/actions/produce.actions";
import { MarketplaceBuyer } from "@/components/marketplace/MarketplaceBuyer";
import Chatbot from "@/components/ui/Chatbot";
import { getProduceSyncStatus } from "@/lib/utils/Produce";

interface ProduceItem {
  name: string;
  unit: string;
  status: boolean;
  category: string;
  lastPublishedSnapshot?: {
    quantity: number;
    pricePerUnit: number;
  };
}

export default async function MarketplacePage() {
  // Fetch data directly from MongoDB
  const produceData = await getAllMarketplaceProduce();
  if (!produceData || produceData.length === 0) {
    throw new Error("Connection error: Unable to load marketplace.");
  }
  const totalCount = produceData.length;

  // Just to demonstrate usage, ideally should be used for each item

  const cleanedData = produceData.map((p: ProduceItem) => {
    const { isOutOfSync } = getProduceSyncStatus(p); // Pass individual item, not array
    return {
      name: p.name,
      price: p.lastPublishedSnapshot?.pricePerUnit,
      unit: p.unit,
      category: p.category,
      quantity: p.lastPublishedSnapshot?.quantity,
      status: isOutOfSync ? "Pending" : "Verified",
    };
  });

  const serializedData = JSON.parse(JSON.stringify(cleanedData));

  console.log("Serialised content:", serializedData);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-y-2 gap-x-4">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Fresh Produce
        </h1>
        <p className="text-slate-500 font-medium">
          {totalCount}{" "}
          {totalCount === 1 ? "fresh produce item" : "fresh produce items"}{" "}
          available in marketplace.
        </p>
      </div>

      {/* Pass the MongoDB data to our client component */}
      <MarketplaceBuyer produceData={produceData} />
      <Chatbot contextType="marketplace" contextData={serializedData} />
    </div>
  );
}
