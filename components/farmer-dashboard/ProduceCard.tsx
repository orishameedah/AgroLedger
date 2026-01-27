import { MoreVertical } from "lucide-react";
import { ActionDropdown } from "../ui/ActionDropDown";
import { StatusRing } from "./StatusRing";
import { getProduceSyncStatus } from "@/lib/utils/Produce";

const DataPoint = ({ label, value, isEmerald, isBold }: any) => (
  <div>
    <p className="text-[9px] uppercase text-slate-400 font-bold tracking-wider">
      {label}
    </p>
    <p
      className={`text-sm ${isEmerald ? "text-emerald-500" : ""} ${
        isBold ? "text-emerald-600 font-bold" : "font-semibold"
      }`}
    >
      {value}
    </p>
  </div>
);

function ProduceCard({ item, actions, activeMenu, setActiveMenu }: any) {
  const { isOutOfSync } = getProduceSyncStatus(item);

  const dropdownStatus =
    item.blockchainStatus === "processing"
      ? "processing"
      : isOutOfSync
        ? "sync"
        : item.blockchainStatus;

  return (
    <div className="mobile-inventory-card relative overflow-visible">
      <div className="flex items-center gap-4 mb-4">
        <StatusRing produce={item} image={item.image} />
        <div className="flex-1">
          <h4 className="font-bold text-slate-900 dark:text-white leading-tight">
            {item.name}
          </h4>
          <p className="text-[11px] text-slate-500">
            {item.category} • {item.updatedAt ? "Date" : "No Date"}
          </p>
        </div>
        <button
          className="p-2"
          onClick={() =>
            setActiveMenu(activeMenu === item._id ? null : item._id)
          }
        >
          <MoreVertical className="w-5 h-5 text-slate-400" />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100">
        <div className="flex flex-col">
          <p className="text-[9px] uppercase font-bold text-slate-400">Qty</p>
          {item.quantity <= 0 ? (
            <p className="text-[10px] font-black text-red-500 uppercase tracking-tighter">
              Out of Stock
            </p>
          ) : (
            <p className="text-xs font-bold text-slate-700">{`${item.quantity} ${item.unit}`}</p>
          )}
        </div>
        <DataPoint
          label="Price/Unit"
          value={`₦${(item.pricePerUnit || 0).toLocaleString()}`}
          isEmerald
        />
        <DataPoint
          label="Total"
          value={`₦${(item.totalPrice || 0).toLocaleString()}`}
          isBold
        />
      </div>
      {activeMenu === item._id && (
        <ActionDropdown
          status={dropdownStatus}
          actions={actions}
          isMobile
          onClose={() => setActiveMenu(null)}
        />
      )}
    </div>
  );
}

export { ProduceCard };
