"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { getOrders, updateOrderStatus } from "../actions";
import CustomSelect from "@/components/CustomSelect";

const STATUS_COLORS = {
  PENDING: "bg-amber-50 text-amber-600 border-amber-200",
  APPROVED: "bg-blue-50 text-blue-600 border-blue-200",
  DISPATCHED: "bg-indigo-50 text-indigo-600 border-indigo-200",
  COMPLETED: "bg-emerald-50 text-emerald-600 border-emerald-200",
  CANCELLED: "bg-rose-50 text-rose-600 border-rose-200",
};

export default function OrdersPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewOrder, setViewOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await getOrders();
    setData(res);
    setLoading(false);
  };

  const handleStatusUpdate = async (id, status) => {
    await updateOrderStatus(id, status);
    loadData();
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-brand-primary">Order Registry</h1>
          <p className="text-xs font-bold text-brand-secondary tracking-widest uppercase mt-1">Transaction Monitor</p>
        </div>
        <div className="relative group w-full md:w-80">
          <Icon icon="solar:magnifer-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/20 w-4 h-4 group-focus-within:text-brand-secondary transition-colors" />
          <input
            type="text"
            placeholder="Search by ID, wholesaler or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-brand-primary/5 rounded-xl p-3 pl-11 text-[11px] font-bold text-brand-primary focus:ring-4 focus:ring-brand-secondary/5 transition-all outline-none shadow-sm placeholder:text-brand-primary/20 tracking-wider"
          />
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-brand-primary/5 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-primary/5 text-[10px] uppercase font-bold text-brand-primary/60 tracking-widest border-b border-brand-primary/5">
            <tr>
              <th className="p-6">Order ID</th>
              <th className="p-6">Wholesaler</th>
              <th className="p-6">Valuation</th>
              <th className="p-6">Fulfillment State</th>
              <th className="p-6 text-right">Fulfillment Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-primary/5">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-20 text-center">
                  <Icon icon="line-md:loading-loop" className="w-10 h-10 text-brand-secondary mx-auto" />
                </td>
              </tr>
            ) : data.filter(o => 
                o.orderNumber?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.wholesaler?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.wholesaler?.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.status.toLowerCase().includes(searchTerm.toLowerCase())
            ).length === 0 ? (
              <tr>
                <td colSpan="5" className="p-20 text-center text-brand-primary/30 italic font-serif">No orders matching your search criteria.</td>
              </tr>
            ) : data.filter(o => 
                o.orderNumber?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.wholesaler?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.wholesaler?.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.status.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(o => (
              <tr key={o.id} className="hover:bg-brand-primary/[0.02] transition-colors group">
                <td className="p-6" onClick={() => setViewOrder(o)}>
                   <p className="font-bold text-brand-primary group-hover:text-brand-secondary cursor-pointer transition-colors">#{o.orderNumber}</p>
                   <p className="text-[10px] text-brand-primary/40 font-medium">{new Date(o.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="p-6">
                  <p className="font-bold text-brand-primary">{o.wholesaler?.name}</p>
                  <p className="text-[10px] text-brand-primary/40 font-medium uppercase tracking-widest">{o.wholesaler?.companyName || 'Private Partner'}</p>
                </td>
                <td className="p-6">
                  <p className="font-bold text-black font-serif">₹{o.totalAmount.toLocaleString()}</p>
                  <p className="text-[10px] text-brand-primary/40 font-medium">{o.items.length} Units Ordered</p>
                </td>
                <td className="p-6">
                  <div className={`inline-flex items-center px-4 py-1.5 rounded-full border text-[9px] font-bold uppercase tracking-widest ${STATUS_COLORS[o.status]}`}>
                    {o.status}
                  </div>
                </td>
                <td className="p-6 text-right">
                  <CustomSelect 
                    value={o.status} 
                    onChange={(val) => handleStatusUpdate(o.id, val)}
                    options={[
                      { value: "PENDING", label: "Mark Pending" },
                      { value: "APPROVED", label: "Authorize Fulfillment" },
                      { value: "DISPATCHED", label: "Indicate Dispatched" },
                      { value: "COMPLETED", label: "Finalize Handover" },
                      { value: "CANCELLED", label: "Void Order" },
                    ]}
                    className="w-48 ml-auto"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Manifest View (Detailed View) */}
      {viewOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-primary/80 backdrop-blur-md p-4 overflow-y-auto pt-20 pb-10">
          <div className="bg-white max-w-4xl w-full rounded-[40px] p-8 lg:p-12 shadow-2xl relative my-auto border border-white/20">
            <button onClick={()=>setViewOrder(null)} className="absolute top-8 right-8 w-10 h-10 bg-brand-primary/5 rounded-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all">
              <Icon icon="lucide:x" className="w-5 h-5" />
            </button>
            
            <div className="flex justify-between items-start mb-12">
              <div>
                <h2 className="text-3xl font-serif font-bold text-brand-primary">Order Manifest</h2>
                <p className="text-sm text-brand-primary/40 mt-1 font-medium tracking-widest uppercase">ID: #{viewOrder.orderNumber} • {new Date(viewOrder.createdAt).toLocaleString()}</p>
              </div>
              <div className={`px-6 py-2 rounded-full border text-[10px] font-bold uppercase tracking-[0.3em] ${STATUS_COLORS[viewOrder.status]}`}>
                 {viewOrder.status}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 bg-brand-primary/2 p-8 rounded-[32px] border border-brand-primary/5">
                <div>
                    <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/40 mb-4 ml-1">Client Authorization</h3>
                    <p className="text-lg font-serif font-bold text-brand-primary">{viewOrder.wholesaler.name}</p>
                    <p className="text-sm font-medium text-brand-primary/60 mt-1 uppercase tracking-widest">{viewOrder.wholesaler.companyName || 'B2B Client'}</p>
                    <p className="text-sm text-brand-primary/40 mt-3 font-medium leading-relaxed">{viewOrder.wholesaler.address || 'Standard Partner Logistics'}</p>
                </div>
                <div>
                    <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/40 mb-4 ml-1">Communication Channels</h3>
                    <p className="text-sm font-bold text-brand-primary">{viewOrder.wholesaler.email}</p>
                    <p className="text-sm font-bold text-brand-primary mt-2">{viewOrder.wholesaler.phone || 'Registry Phone Not Available'}</p>
                </div>
            </div>

            <div>
                 <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/40 mb-6 ml-1">Allocated Inventory Items</h3>
                 <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                    {viewOrder.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center p-5 bg-white rounded-2xl border border-brand-primary/5 hover:bg-brand-primary/[0.01] transition-all">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-14 rounded-xl overflow-hidden bg-gray-50 border border-brand-primary/10">
                                    <img src={item.product?.images?.[0] || '/hero.png'} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="font-bold text-brand-primary">{item.product?.name}</p>
                                    <p className="text-[10px] text-brand-primary/40 uppercase font-bold tracking-widest mt-1">₹{item.price.toLocaleString()} per unit</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-serif font-bold text-brand-primary">Qty: {item.quantity}</p>
                                <p className="text-[10px] text-brand-secondary font-bold tracking-[0.2em] mt-1 uppercase">Subtotal: ₹{(item.quantity * item.price).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>

            <div className="mt-12 pt-8 border-t border-brand-primary/5 flex justify-between items-end">
                <div>
                   <p className="text-[10px] text-brand-primary/40 font-bold uppercase tracking-widest mb-2">Registry Signature</p>
                   <p className="text-xs font-serif italic text-brand-primary/30">Secure Transaction Verified by SSD Internal Logs</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] text-brand-primary/40 font-bold uppercase tracking-widest mb-1">Taxation & Fulfillment Inclusive</p>
                   <p className="text-4xl font-serif font-bold text-brand-primary tracking-tight">₹{viewOrder.totalAmount.toLocaleString()}</p>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
