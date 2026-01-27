"use client";

import { Search, Plus } from "lucide-react";
import { AddProduceModal } from "./AddProduceModal";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { MoreVertical, Edit2, Trash2, Globe, EyeOff } from "lucide-react";
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
import { ProduceRow } from "./ProduceRow";
import { ProduceCard } from "./ProduceCard";

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

    if (item.blockchainStatus === "processing") {
      actions.push({
        label: "Blockchain Processing...",
        icon: Loader2,
        onClick: () => {},
        variant: "default",
      });
    } else if (!item.isPublished) {
      actions.push({
        label: "Publish to Market",
        icon: Globe,
        onClick: () => handlePublish(item._id),
        variant: "success",
      });
    } else if (item.quantity === 0 && item.blockchainStatus === "published") {
      actions.push({
        label: "Out of Stock: Unpublish",
        icon: Trash2,
        onClick: () => handleUnpublish(item._id),
        variant: "danger",
      });
    } else if (isOutOfSync) {
      actions.push({
        label: "Sync Changes",
        icon: Globe,
        onClick: () => handlePublish(item._id),
        variant: "success",
      });
    } else {
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProduce.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProduce.length / itemsPerPage);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

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
      loadData();
      setIsDeleteModalOpen(false);
    } else {
      toast.error("Unable to delete entry");
    }
    setIsDeleting(false);
  };

  const handlePublish = async (produceId: string) => {
    const item = produce.find((p) => p._id === produceId);

    if (!item) return;
    const isPriceZero = item.pricePerUnit <= 0;
    const isQuantityZero = item.quantity <= 0;
    if (isPriceZero && isQuantityZero) {
      toast.error(
        "Cannot publish: Please set both a valid Price and Stock quantity first which must be greater than 0.",
      );
      return;
    }
    if (isPriceZero) {
      toast.error(
        "Cannot publish: Please set a valid Price first (must be greater than 0).",
      );
      return;
    }
    if (isQuantityZero) {
      toast.error(
        "Cannot publish: Please set a Stock quantity greater than 0.",
      );
      return;
    }
    const loadingToast = toast.loading("Deploying to Sepolia Blockchain...");
    try {
      const result = await publishProduceToBlockchain(produceId);
      if (result.success) {
        toast.success("Successfully deployed to blockchain!", {
          id: loadingToast,
        });
        loadData();
      } else {
        const errorMessage = result.error.includes("reverted")
          ? "Blockchain rejected the data. Check your price/stock values."
          : `Blockchain Error: ${result.error}`;

        toast.error(errorMessage, { id: loadingToast });
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.", {
        id: loadingToast,
      });
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

  const outOfSyncCount = produce.filter((item) => {
    const { isOutOfSync } = getProduceSyncStatus(item);
    return isOutOfSync;
  }).length;
  return (
    <div className="space-y-6">
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
                {currentItems.map((item) => (
                  <ProduceRow
                    key={item._id}
                    item={item}
                    actions={getActions(item)}
                    activeMenu={activeMenu}
                    setActiveMenu={setActiveMenu}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-4">
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
