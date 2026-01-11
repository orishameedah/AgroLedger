"use client";

import {
  MoreVertical,
  Edit2,
  Trash2,
  Globe,
  Search,
  Filter,
  Plus,
} from "lucide-react";
import { ActionDropdown } from "../ui/ActionDropDown";
import { AddProduceModal } from "./AddProduceModal";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { fetchAllProduce, deleteProduce } from "@/lib/actions/produce.actions";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { UniversalDeleteModal } from "../ui/DeleteConfirmation";

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

  // 2. The Confirm Logic

  // Helper to generate actions for any view (Desktop or Mobile)
  const getActions = (item: any) => [
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
    {
      label: item.status === "published" ? "Unpublish" : "Publish to Market",
      icon: Globe,
      onClick: () => console.log("Blockchain", item._id),
      variant: "success" as const,
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const filteredProduce = produce.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.unit.toLowerCase().includes(searchQuery.toLowerCase())
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p>Loading your harvest records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* --- SHARED TOP BAR --- */}
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

          {totalPages > 1 && (
            <div className="produce-totalPages">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-emerald-600 disabled:opacity-30 transition-colors cursor-pointer;"
              >
                Previous
              </button>

              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-emerald-600 disabled:opacity-30 transition-colors cursor-pointer;"
              >
                Next
              </button>
            </div>
          )}
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

/* --- HELPER COMPONENTS (To keep logic dry and clean) --- */
const StatusRing = ({ status, image }: { status: string; image: string }) => (
  <div className="relative w-12 h-12">
    <img
      src={image}
      className={`w-12 h-12 rounded-lg object-cover border-2 transition-all ${
        status === "published"
          ? "border-emerald-500 shadow-sm"
          : status === "processing"
          ? "border-blue-500 animate-pulse"
          : "border-slate-200 dark:border-slate-700 shadow-inner"
      }`}
      alt="img"
    />
    {status !== "none" && (
      <span
        className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-800 transition-colors ${
          status === "published"
            ? "bg-emerald-500"
            : status === "processing"
            ? "bg-blue-500"
            : "bg-slate-300 dark:bg-slate-600" // New Gray dot for "none"
        }`}
      />
    )}
  </div>
);

function ProduceRow({ item, actions, activeMenu, setActiveMenu }: any) {
  return (
    <tr className="inventory-row">
      <td className="inventory-td">
        <StatusRing status={item.status} image={item.image} />
      </td>
      <td className="inventory-td font-bold">{item.name}</td>
      <td className="inventory-td">
        <span className="px-2 py-1 bg-slate-50 dark:bg-slate-900 rounded-md text-[11px]">
          {item.category}
        </span>
      </td>
      <td className="inventory-td">
        {item.quantity}{" "}
        <span className="text-slate-400 text-xs">{item.unit}</span>
      </td>
      <td className="inventory-td">
        ₦{(item.pricePerUnit || 0).toLocaleString()}
      </td>
      <td className="inventory-td font-bold text-emerald-600">
        ₦{(item.totalPrice || 0).toLocaleString()}
      </td>
      <td className="inventory-td text-[11px] text-slate-500">
        {item.createdAt
          ? new Date(item.createdAt).toLocaleDateString()
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
            status={item.blockchainStatus}
            actions={actions}
            onClose={() => setActiveMenu(null)}
          />
        )}
      </td>
    </tr>
  );
}

function ProduceCard({ item, actions, activeMenu, setActiveMenu }: any) {
  return (
    <div className="mobile-inventory-card relative overflow-visible">
      <div className="flex items-center gap-4 mb-4">
        <StatusRing status={item.status} image={item.image} />
        <div className="flex-1">
          <h4 className="font-bold text-slate-900 dark:text-white leading-tight">
            {item.name}
          </h4>
          <p className="text-[11px] text-slate-500">
            {item.category} •{" "}
            {item.createdAt
              ? new Date(item.createdAt).toLocaleDateString()
              : "No Date"}
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
        <DataPoint label="Qty" value={`${item.quantity} ${item.unit}`} />
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
          status={item.blockchainStatus}
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
