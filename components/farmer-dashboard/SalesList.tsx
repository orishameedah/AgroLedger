"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Search,
  Plus,
  MoreVertical,
  Trash2,
  Calendar,
  ShoppingBag,
  Users,
  Edit2,
} from "lucide-react";
import toast from "react-hot-toast";
import { Pagination } from "../ui/Pagination";
import { fetchSalesHistory, deleteSale } from "@/lib/actions/sales.actions";
import { ActionDropdown } from "../ui/ActionDropDown";
import { UniversalDeleteModal } from "../ui/DeleteConfirmation";
import { AddSaleModal } from "./AddSaleModal";

export function SalesList() {
  const { data: session } = useSession();
  const [sales, setSales] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const [editingItem, setEditingItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const loadData = async () => {
    if (!session?.user?.id) return;
    setIsLoading(true);
    const data = await fetchSalesHistory(session.user.id);
    setSales(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [session]);

  const getActions = (item: any) => [
    {
      label: "Edit / Add Buyers",
      icon: Edit2,
      onClick: () => {
        setEditingItem(item);
        setIsModalOpen(true);
      },
    },
    {
      label: "Delete Record",
      icon: Trash2,
      onClick: () => {
        setItemToDelete(item._id);
        setIsDeleteOpen(true);
      },
      variant: "danger" as const,
    },
  ];

  const filteredSales = sales.filter(
    (s) =>
      s.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.buyers.some((b: any) =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.unit.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSales.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);

  if (isLoading)
    return (
      <div className="py-20 text-center animate-pulse text-slate-400 font-bold uppercase text-xs">
        Syncing Ledger...
      </div>
    );

  return (
    <div className="space-y-6">
      <header className="produce-header">
        <div className="flex items-center gap-3 flex-1 min-w-60">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search sales or buyers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="produce-search produce-search:focus"
            />
          </div>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }}
          className="produce-add curso w-full text-center md:w-auto h-12"
        >
          <Plus size={18} className="text-center" /> New Sale Entry
        </button>
      </header>

      {/* --- DESKTOP TABLE (FIXED ALIGNMENT) --- */}
      <div className="hidden md:block bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-visible shadow-sm">
        <table className="w-full text-left overflow-visible">
          <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
            <tr className="text-[10px] uppercase font-black text-slate-400 tracking-[0.12em]">
              <th className="p-4">Produce</th>
              <th className="p-4">Category</th>
              <th className="p-4">Stock Out</th>
              <th className="p-4">Amount Received</th>
              <th className="p-4">Buyer Names</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {/* {filteredSales.map((sale) => ( */}
            {currentItems.map((sale) => (
              <SaleRow
                key={sale._id}
                sale={sale}
                actions={getActions(sale)}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MOBILE CARDS (FULLY RESPONSIVE) --- */}
      <div className="md:hidden space-y-4 px-1">
        {/* {filteredSales.map((sale) => ( */}
        {currentItems.map((sale) => (
          <SaleCard
            key={sale._id}
            sale={sale}
            actions={getActions(sale)}
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

      <AddSaleModal
        isOpen={isModalOpen}
        editingSale={editingItem}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
          loadData();
        }}
      />

      <UniversalDeleteModal
        isOpen={isDeleteOpen}
        title="Delete Sale"
        description="Returning items to inventory..."
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={async () => {
          await deleteSale(itemToDelete!);
          toast.success("Sales deleted successfully");
          loadData();
          setIsDeleteOpen(false);
        }}
      />
    </div>
  );
}

function SaleRow({ sale, actions, activeMenu, setActiveMenu }: any) {
  return (
    // <tr className="hover:bg-slate-50/30 transition-colors group">
    <tr className="inventory-row">
      <td className="px-6 py-5 font-bold text-slate-900 dark:text-white">
        {sale.productName}
      </td>
      <td className="px-6 py-5">
        <span className="text-[9px] bg-slate-100 px-2 py-1 rounded font-black text-slate-500 uppercase">
          {sale.category}
        </span>
      </td>
      <td className="px-6 py-5">
        <div className="flex flex-col">
          <span className="font-bold text-slate-700 dark:text-slate-300">
            {sale.totalQuantitySold} {sale.unit}
          </span>
        </div>
      </td>
      <td className="px-6 py-5">
        <p className="text-sm font-black text-emerald-600">
          ₦{sale.totalAmountReceived.toLocaleString()}
        </p>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          <Users size={12} className="text-slate-500" />
          <span className="text-xs text-slate-600 dark:text-slate-400">
            {sale.buyers[0]?.name || "Cash"}{" "}
            {sale.buyers.length > 1 && `+${sale.buyers.length - 1}`}
          </span>
        </div>
      </td>
      <td className="px-6 py-5 text-[10px] font-bold text-slate-400  tracking-tighter">
        {/* {new Date(sale.saleDate).toLocaleDateString()} */}
        {sale.saleDate
          ? new Date(sale.saleDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "No Date"}
      </td>
      <td className="px-6 py-5 text-center relative">
        <button
          onClick={() =>
            setActiveMenu(activeMenu === sale._id ? null : sale._id)
          }
          className="p-2 text-slate-300 cursor-pointer hover:text-slate-600"
        >
          <MoreVertical size={18} className="mx-auto" />
        </button>
        {activeMenu === sale._id && (
          <ActionDropdown
            actions={actions}
            onClose={() => setActiveMenu(null)}
          />
        )}
      </td>
    </tr>
  );
}

function SaleCard({ sale, actions, activeMenu, setActiveMenu }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-4xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <ShoppingBag size={20} />
          </div>
          <div>
            <h4 className="font-black text-slate-900 dark:text-white text-base leading-none">
              {sale.productName}
            </h4>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">
              {sale.category}
            </p>
          </div>
        </div>
        <button
          onClick={() =>
            setActiveMenu(activeMenu === sale._id ? null : sale._id)
          }
          className="p-2 text-slate-300 cursor-pointer"
        >
          <MoreVertical size={20} />
        </button>
        {activeMenu === sale._id && (
          <ActionDropdown
            actions={actions}
            onClose={() => setActiveMenu(null)}
            isMobile
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 py-4 border-y border-slate-50 dark:border-slate-800/50">
        <div className="space-y-0.5">
          <p className="text-[9px] uppercase font-bold text-slate-400">
            Qty Sold
          </p>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
            {sale.totalQuantitySold} {sale.unit}
          </p>
        </div>
        <div className="text-right space-y-0.5">
          <p className="text-[9px] uppercase font-bold text-slate-400">
            Total Revenue
          </p>
          <p className="text-sm font-black text-emerald-600">
            ₦{sale.totalAmountReceived.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
          <Calendar size={12} />{" "}
          {sale.saleDate
            ? new Date(sale.saleDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "No Date"}
        </div>
        <div className="flex items-center gap-2">
          <Users size={12} className="text-slate-500" />
          <span className="text-xs text-slate-600 dark:text-slate-400">
            {sale.buyers[0]?.name || "Cash"}{" "}
            {sale.buyers.length > 1 && `+${sale.buyers.length - 1}`}
          </span>
        </div>
        {/* <div className="bg-slate-50  dark:bg-slate-800/50 px-3 py-1 rounded-full text-[9px] font-bold text-slate-500 uppercase">
          {sale.buyers.length} Transactions
        </div> */}
      </div>
    </div>
  );
}
