import { getRelatedProduce } from "@/lib/actions/produce.actions";
import Image from "next/image";
import Link from "next/link";

interface RelatedProps {
  farmerId: string;
  category: string;
  currentProduceId: string;
  farmName: string;
}

export default async function RelatedProduce({
  farmerId,
  category,
  currentProduceId,
  farmName,
}: RelatedProps) {
  const relatedItems = await getRelatedProduce(
    farmerId,
    category,
    currentProduceId,
  );

  // If there are absolutely no related items, return null so nothing shows up
  if (!relatedItems || relatedItems.length === 0) return null;

  // Determine the heading based on whether we found same-farmer or same-category items
  const isSameFarmer = relatedItems[0].userId === farmerId;

  return (
    <section className="mt-10 border-t border-slate-100 dark:border-slate-800 pt-9">
      <div className="mb-7">
        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">
          Recommendations
        </span>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight ">
          {isSameFarmer ? `More from ${farmName}` : `Other ${category} items`}
        </h2>
        <div className="h-1.5 w-12 bg-emerald-500 rounded-full mt-2"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedItems.map((item: any) => (
          <Link
            key={item._id}
            href={`/marketplace/${item._id}`}
            className="group block bg-white dark:bg-slate-900 rounded-4xl p-4 border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:border-emerald-500/30 transition-all duration-500"
          >
            <div className="relative aspect-square rounded-3xl overflow-hidden mb-4 bg-slate-50">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 dark:text-white truncate uppercase text-sm group-hover:text-emerald-600 transition-colors">
                {item.name}
              </h3>
              <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">
                ₦{item.pricePerUnit.toLocaleString()} / {item.unit}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
