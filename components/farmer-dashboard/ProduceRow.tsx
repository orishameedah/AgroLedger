import { MoreVertical } from "lucide-react";
import { ActionDropdown } from "../ui/ActionDropDown";
import { StatusRing } from "./StatusRing";
import { getProduceSyncStatus } from "@/lib/utils/Produce";

function ProduceRow({ item, actions, activeMenu, setActiveMenu }: any) {
  const { isOutOfSync } = getProduceSyncStatus(item);

  const dropdownStatus =
    item.blockchainStatus === "processing"
      ? "processing"
      : isOutOfSync
        ? "sync"
        : item.blockchainStatus;

  return (
    <tr className="inventory-row">
      <td className="inventory-td">
        <StatusRing produce={item} image={item.image} />
      </td>
      <td className="inventory-td font-bold">{item.name}</td>
      <td className="inventory-td">
        <span className="px-2 py-1 bg-slate-50 dark:bg-slate-900 rounded-md text-[11px]">
          {item.category}
        </span>
      </td>
      <td className="inventory-td">
        {item.quantity <= 0 ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-600 uppercase tracking-widest animate-pulse">
            Out of Stock
          </span>
        ) : (
          <>
            {item.quantity}{" "}
            <span className="text-slate-400 text-xs">{item.unit}</span>
          </>
        )}
      </td>
      <td className="inventory-td">
        ₦{(item.pricePerUnit || 0).toLocaleString()}
      </td>
      <td className="inventory-td font-bold text-emerald-600">
        ₦{(item.totalPrice || 0).toLocaleString()}
      </td>
      <td className="inventory-td text-[11px] text-slate-500">
        {item.updatedAt
          ? new Date(item.updatedAt).toLocaleDateString()
          : "No Date"}
      </td>
      <td className="inventory-td relative text-center">
        <button
          onClick={() =>
            setActiveMenu(activeMenu === item._id ? null : item._id)
          }
          className="p-2 cursor-pointer text-slate-400"
        >
          <MoreVertical className="w-5 h-5 mx-auto" />
        </button>
        {activeMenu === item._id && (
          <ActionDropdown
            status={dropdownStatus}
            actions={actions}
            onClose={() => setActiveMenu(null)}
          />
        )}
      </td>
    </tr>
  );
}

export { ProduceRow };
