// // app/marketplace/blockchain-explorer/page.tsx
// import {
//   fetchAllProduce,
//   fetchAllBlockchainData,
// } from "@/lib/actions/produce.actions";
// import { ShieldCheck, HardDrive } from "lucide-react";

// export default async function BlockchainExplorer() {
//   // 1. Get all IDs from DB (even edited/deleted ones)
//   const dbResult = await fetchAllProduce("");
//   const allIds = dbResult.data.map((item: any) => item._id);

//   // 2. Fetch the "Supreme Truth" directly from the Smart Contract
//   const bcResult = await fetchAllBlockchainData(allIds);

//   return (
//     <div className="p-10 bg-[#f8fafc] min-h-screen">
//       <div className="max-w-6xl mx-auto space-y-8">
//         <div className="flex items-center gap-3 border-b-4 border-emerald-500 pb-4">
//           <HardDrive className="w-10 h-10 text-slate-900" />
//           <div>
//             <h1 className="text-3xl font-black text-slate-900 uppercase">
//               On-Chain Ledger
//             </h1>
//             <p className="text-slate-500 text-sm font-medium">
//               Bypassing MongoDB Logic • Fetching Raw Contract State
//             </p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 gap-4">
//           {bcResult.records?.map((record: any) => (
//             <div
//               key={record.id}
//               className={`p-6 rounded-3xl border-2 flex items-center justify-between shadow-sm transition-all ${
//                 record.isNotarized
//                   ? "bg-white border-slate-100"
//                   : "bg-slate-50 border-dashed border-slate-200 opacity-60"
//               }`}
//             >
//               <div className="space-y-1">
//                 <span className="text-[10px] font-mono text-slate-400">
//                   UUID: {record.id}
//                 </span>
//                 <h3 className="font-bold text-slate-800 flex items-center gap-2">
//                   {record.isNotarized ? (
//                     <ShieldCheck className="w-4 h-4 text-emerald-500" />
//                   ) : null}
//                   {record.isNotarized
//                     ? "VALID BLOCKCHAIN RECORD"
//                     : "UNPUBLISHED RECORD"}
//                 </h3>
//               </div>

//               {record.isNotarized ? (
//                 <div className="flex gap-12 text-right">
//                   <div>
//                     <p className="text-[10px] uppercase text-slate-400 font-bold">
//                       Notarized Price
//                     </p>
//                     <p className="text-xl font-black text-emerald-600">
//                       ₦{record.price.toLocaleString()}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-[10px] uppercase text-slate-400 font-bold">
//                       Notarized Stock
//                     </p>
//                     <p className="text-xl font-black text-slate-900">
//                       {record.quantity} Units
//                     </p>
//                   </div>
//                   <div className="w-48">
//                     <p className="text-[10px] uppercase text-slate-400 font-bold">
//                       Verification Date
//                     </p>
//                     <p className="text-[11px] font-medium text-slate-600">
//                       {new Date(record.timestamp).toLocaleString()}
//                     </p>
//                   </div>
//                 </div>
//               ) : (
//                 <p className="text-sm font-medium text-slate-400 italic">
//                   No data found in smart contract storage
//                 </p>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// app/blockchain-explorer/page.tsx
import {
  fetchAllBlockchainData,
  getAllProduceIds,
} from "@/lib/actions/produce.actions";

export default async function BlockchainExplorer() {
  // Option A: If using the Event Listener (Zero MongoDB)
  // const bcResult = await fetchAllBlockchainData();

  // Option B: If using the ID List (MongoDB only for the "Key")
  const idResult = await getAllProduceIds();
  const bcResult = await fetchAllBlockchainData(idResult.ids);

  if (!bcResult.success) return <div>Error: {bcResult.error}</div>;

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">🔗 Direct Ledger State</h1>
      <div className="space-y-4">
        {bcResult.records?.map((record: any) => (
          <div
            key={record.id}
            className="p-4 border rounded-xl bg-white font-mono text-sm"
          >
            <p className="text-slate-400">ID: {record.id}</p>
            <p className="text-emerald-600 font-bold">Price: ₦{record.price}</p>
            <p className="text-slate-900">Stock: {record.quantity} units</p>
          </div>
        ))}
      </div>
    </div>
  );
}
