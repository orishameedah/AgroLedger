"use client";

import {
  MoreVertical,
  Edit2,
  Trash2,
  Globe,
  Search,
  Plus,
  EyeOff,
} from "lucide-react";
import { ActionDropdown } from "../ui/ActionDropDown";
import { AddProduceModal } from "./AddProduceModal";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  fetchAllProduce,
  deleteProduce,
  publishProduceToBlockchain,
  unpublishProduce,
} from "@/lib/actions/produce.actions";
import { Loader2 } from "lucide-react";
import { Pagination } from "../ui/Pagination";
import toast from "react-hot-toast";
import { UniversalDeleteModal } from "../ui/DeleteConfirmation";
import { getProduceSyncStatus } from "@/lib/utils/Produce";

export function ProduceList() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { data: session } = useSession();
  const [produce, setProduce] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const getActions = (item: any) => {
    // Use your utility to determine the current sync state
    const { isOutOfSync } = getProduceSyncStatus(item);

    const actions: any[] = [
      {
        label: "Edit Entry",
        icon: Edit2,
        onClick: () => handleEdit(item),
      },
      {
        label: "Delete Entry",
        icon: Trash2,
        onClick: () => {
          setItemToDelete(item._id);
          setIsDeleteModalOpen(true);
        },
        variant: "danger" as const,
      },
    ];

    // BLOCKCHAIN LOGIC
    if (item.blockchainStatus === "processing") {
      actions.push({
        label: "Blockchain Processing...",
        icon: Loader2,
        onClick: () => {}, // Disable interaction while processing
        variant: "default",
      });
    } else if (!item.isPublished) {
      // SCENARIO: Not yet on the market
      actions.push({
        label: "Publish to Market",
        icon: Globe,
        onClick: () => handlePublish(item._id),
        variant: "success",
      });
    } else if (isOutOfSync) {
      // SCENARIO: Published but data changed (Price/Qty mismatch)
      actions.push({
        label: "Sync Changes",
        icon: Globe,
        onClick: () => handlePublish(item._id), // Calls the same action to update snapshot
        variant: "success",
      });
    } else {
      // SCENARIO: Published and fully synced
      actions.push({
        label: "Unpublish Entry",
        icon: EyeOff,
        onClick: () => handleUnpublish(item._id),
        variant: "danger",
      });
    }

    return actions;
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const filteredProduce = produce.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.unit.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // New Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProduce.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProduce.length / itemsPerPage);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  // 1. Fetch Logic
  const loadData = async () => {
    if (!session?.user?.id) return;
    setIsLoading(true);
    const result = await fetchAllProduce(session.user.id);
    if (result.success) {
      setProduce(result.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [session?.user?.id]);

  // 2. Modified handleEdit to handle MongoDB _id
  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);

    const result = await deleteProduce(itemToDelete);

    if (result.success) {
      toast.success("Record deleted successfully");
      loadData(); // Your function that fetches fresh data
      setIsDeleteModalOpen(false);
    } else {
      toast.error("Unable to delete entry");
    }
    setIsDeleting(false);
  };

  // Inside ProduceList component
  const handlePublish = async (produceId: string) => {
    const loadingToast = toast.loading("Syncing with Sepolia Blockchain...");

    try {
      // 1. Call your server action
      const result = await publishProduceToBlockchain(produceId);

      if (result.success) {
        toast.success("Successfully notarized on blockchain!", {
          id: loadingToast,
        });
        loadData(); // Refresh the list to show the new "Verified" status
      } else {
        toast.error(`Blockchain Error: ${result.error}`, { id: loadingToast });
      }
    } catch (error) {
      toast.error("An unexpected error occurred", { id: loadingToast });
    }
  };

  const handleUnpublish = async (id: string) => {
    const loading = toast.loading("Removing from marketplace...");
    const res = await unpublishProduce(id);

    if (res.success) {
      toast.success("Item is now private", { id: loading });
      loadData();
    } else {
      toast.error("Failed to unpublish", { id: loading });
    }
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p>Loading your harvest records...</p>
      </div>
    );
  }

  // Inside ProduceList component, before the return
  const outOfSyncCount = produce.filter((item) => {
    const { isOutOfSync } = getProduceSyncStatus(item);
    return isOutOfSync; // Only count items that are published but modified
  }).length;
  return (
    <div className="space-y-6">
      {/* --- SHARED TOP BAR --- */}

      {/* --- REAL-TIME SYNC NOTIFICATION --- */}
      {outOfSyncCount > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r-xl shadow-sm animate-in slide-in-from-top duration-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-full">
                <Globe className="w-4 h-4 text-amber-600 animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-bold text-amber-900">
                  {outOfSyncCount}{" "}
                  {outOfSyncCount === 1 ? "item needs" : "items need"}{" "}
                  re-verification
                </p>
                <p className="text-xs text-amber-700">
                  You've made changes that aren't synced with the blockchain
                  marketplace yet. <br />
                  Click on the "Sync Changes" action in the produce list of the
                  item to update
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      <header className="produce-header">
        <div className="flex items-center gap-3 flex-1 min-w-60">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search produce..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="produce-search produce-search:focus"
            />
          </div>
        </div>
        <button onClick={handleOpenAdd} className="produce-add">
          <Plus className="w-4 h-4" /> Add Entry
        </button>
      </header>

      {produce.length === 0 ? (
        <div className="produce-none">
          <p className="text-slate-500">
            No records found. Start by adding your first harvest!
          </p>
        </div>
      ) : (
        <>
          {/* --- DESKTOP TABLE --- */}
          <div className="produce-desk">
            <table className="inventory-table overflow-visible">
              <thead>
                <tr>
                  <th className="inventory-th">Image</th>
                  <th className="inventory-th">Name</th>
                  <th className="inventory-th">Category</th>
                  <th className="inventory-th">Quantity</th>
                  <th className="inventory-th">Price/Unit</th>
                  <th className="inventory-th">Total</th>
                  <th className="inventory-th">Date</th>
                  <th className="inventory-th text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* {produce.map((item) => ( */}
                {/* {filteredProduce.map((item) => ( */}
                {currentItems.map((item) => (
                  <ProduceRow
                    key={item._id} // MongoDB uses _id
                    item={item}
                    actions={getActions(item)}
                    activeMenu={activeMenu}
                    setActiveMenu={setActiveMenu}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* --- MOBILE CARDS --- */}
          <div className="md:hidden space-y-4">
            {/* {produce.map((item) => ( */}
            {/* {filteredProduce.map((item) => ( */}
            {currentItems.map((item) => (
              <ProduceCard
                key={item._id}
                item={item}
                actions={getActions(item)}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
              />
            ))}
          </div>

          {/* --- PAGINATION CONTROLS --- */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}

      <AddProduceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          loadData();
        }}
        editingEntry={editingItem}
        onSubmit={loadData}
      />

      <UniversalDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Confirm Deletion"
        description="This harvest record will be permanently removed from your storage. This action cannot be undone."
      />
    </div>
  );
}

const StatusRing = ({ produce, image }: { produce: any; image: string }) => {
  // 1. Comparison Logic: Does the current state match the last notarized promise?
  // const outOfSync = getProduceSyncStatus(produce).isOutOfSync;
  const { isOutOfSync } = getProduceSyncStatus(produce);

  // 2. State Management: Determine which color "Mode" to show
  let status = "none";

  if (produce.blockchainStatus === "processing") {
    status = "processing"; // Sepolia transaction is in flight
  } else if (produce.isPublished && isOutOfSync) {
    status = "sync"; // Data mismatch between DB and Ledger
  } else if (produce.isPublished) {
    status = "published"; // Perfectly verified
  }

  return (
    <div className="relative w-12 h-12">
      {/* Produce Image with Dynamic Border */}
      <img
        src={image}
        className={`w-12 h-12 rounded-lg object-cover border-2 transition-all ${
          status === "published"
            ? "border-emerald-500 shadow-sm shadow-emerald-100"
            : status === "processing"
              ? "border-blue-500 animate-pulse"
              : status === "sync"
                ? "border-amber-500 shadow-sm shadow-amber-100"
                : "border-slate-400 dark:border-slate-700 shadow-inner"
        }`}
        alt={produce.name}
      />

      {/* Notification Badge Dot */}
      {status !== "none" && (
        <span
          className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-800 transition-colors duration-300 ${
            status === "published"
              ? "bg-emerald-500"
              : status === "processing"
                ? "bg-blue-500"
                : "bg-amber-500"
          }`}
        />
      )}
    </div>
  );
};

function ProduceRow({ item, actions, activeMenu, setActiveMenu }: any) {
  // 1. Check sync status once at the top
  const { isOutOfSync } = getProduceSyncStatus(item);

  // 2. Decide what color the dropdown header should be
  // We use "sync" if it's out of sync, otherwise use the database status
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
            status={dropdownStatus} // <-- Now passes "sync" if needed!
            actions={actions}
            onClose={() => setActiveMenu(null)}
          />
        )}
      </td>
    </tr>
  );
}

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
        {/* <DataPoint label="Qty" value={`${item.quantity} ${item.unit}`} /> */}
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
          status={dropdownStatus} // <-- Correct sync status for mobile!
          actions={actions}
          isMobile
          onClose={() => setActiveMenu(null)}
        />
      )}
    </div>
  );
}

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
