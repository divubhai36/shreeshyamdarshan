"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { getOrders, updateOrderStatus } from "../actions";
import CustomSelect from "@/components/CustomSelect";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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

  const downloadPDF = async (order) => {
    const doc = new jsPDF();
    const primaryColor = [26, 67, 50]; // #1a4332
    const secondaryColor = [197, 160, 89]; // #c5a059

    // Helper to convert image URL to Base64
    const getBase64Image = (url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        };
        img.onerror = () => resolve(null);
      });
    };

    // Pre-load all item images
    const imagesArray = await Promise.all(
      order.items.map(item => getBase64Image(item.product?.images?.[0] || '/hero.png'))
    );

    // Header
    doc.setFontSize(24);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("SHREE SHYAM DARSHAN", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("PREMIUM WHOLESALE REGISTRY • ORDER DETAILS", 14, 28);

    // Color bar
    doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setLineWidth(1.5);
    doc.line(14, 32, 60, 32);

    // Order Info
    doc.setFontSize(11);
    doc.setTextColor(51, 65, 85);
    doc.text(`Order Number: #${order.orderNumber}`, 14, 45);
    doc.text(`Booking Date: ${new Date(order.createdAt).toLocaleString()}`, 14, 52);
    doc.text(`Order Status: ${order.status}`, 14, 59);

    // Wholesaler info
    doc.setFontSize(10);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text("BILLING TO", 120, 45);
    doc.setFontSize(11);
    doc.setTextColor(26, 67, 50);
    doc.text(order.wholesaler.name, 120, 52);
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(order.wholesaler.companyName || "Partner", 120, 58);
    doc.text(`Phone: ${order.wholesaler.phone || "N/A"}`, 120, 64);
    if (order.wholesaler.address) {
      const splitAddr = doc.splitTextToSize(order.wholesaler.address, 70);
      doc.text(splitAddr, 120, 70);
    }

    // Items Table
    const tableData = order.items.map((item, index) => {
      const mrp = item.originalPrice || item.price;
      const rate = item.price;
      const savings = mrp - rate;

      return [
        index + 1,
        "", // Reserved for image
        {
          content: `${item.product?.name || "Product"}\nID: ${item.product?.productId || "N/A"}${item.variantName ? `\nVariant: ${item.variantName}` : ""}`,
          styles: { fontStyle: 'bold' }
        },
        `${item.product?.unit?.toLowerCase() === "dozen" ? item.quantity / 12 : item.quantity} ${item.product?.unit || 'Pcs'}`,
        {
          content: `Rs. ${rate.toLocaleString()}${savings > 0 ? `\nMRP Rs. ${mrp.toLocaleString()}` : ""}`,
          styles: { fontSize: 8 }
        },
        {
          content: `Rs. ${(item.quantity * item.price).toLocaleString()}${savings > 0 ? `\nRs. ${(item.quantity * mrp).toLocaleString()}` : ""}`,
          styles: { halign: 'right' }
        }
      ];
    });

    // Add Totals Row
    const totalQty = order.items.reduce((acc, it) => acc + it.quantity, 0);
    const grandMRP = order.items.reduce((acc, it) => acc + (it.originalPrice || it.price) * it.quantity, 0);

    tableData.push([
      { content: "FINAL SUMMARY", colSpan: 3, styles: { halign: 'right', fontStyle: 'bold', fillColor: [248, 244, 235] } },
      { content: `${totalQty} Pcs`, styles: { halign: 'center', fontStyle: 'bold', fillColor: [248, 244, 235] } },
      { content: "Total Amount", styles: { halign: 'right', fontStyle: 'bold', fillColor: [248, 244, 235] } },
      {
        content: `Rs. ${order.totalAmount.toLocaleString()}`,
        styles: { fontSize: 11, fontStyle: 'bold', fillColor: [26, 67, 50], textColor: 255, halign: 'right', minCellHeight: 18 }
      }
    ]);

    autoTable(doc, {
      startY: 90,
      head: [["", "Image", "Product Details", "Qty", "Price Info", "Total"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: "bold", fontSize: 10 },
      styles: { fontSize: 9, cellPadding: 5, valign: 'middle' },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 22 },
        2: { cellWidth: 65 },
        3: { halign: "center", cellWidth: 22 },
        4: { halign: "left", cellWidth: 30 },
        5: { halign: "right", cellWidth: 40 }
      },
      didDrawCell: (data) => {
        // Draw Image
        if (data.section === 'body' && data.column.index === 1 && data.row.index < order.items.length) {
          const base64 = imagesArray[data.row.index];
          if (base64) {
            doc.addImage(base64, 'JPEG', data.cell.x + 2, data.cell.y + 2, 18, 18);
          }
        }

        // Draw Strikethrough (Regular lines or Final Summary)
        if (data.section === 'body' && (data.column.index === 4 || data.column.index === 5)) {
          let shouldStrike = false;
          let amountText = "";
          let lineYAdj = 12;

          if (data.row.index < order.items.length) {
            // Regular order items
            const item = order.items[data.row.index];
            const mrp = item.originalPrice || item.price;
            if (mrp > item.price) {
              shouldStrike = true;
              const label = (data.column.index === 4) ? "Rs. " : "Rs. "; // Consistent labels
              const amount = (data.column.index === 4) ? mrp : (item.quantity * mrp);
              amountText = `${label}${amount.toLocaleString()}`;
            }
          } else if (data.row.index === order.items.length && data.column.index === 5) {
            // Summary total cell - Draw smaller MRP below the large payable total
            if (grandMRP > order.totalAmount) {
              shouldStrike = true;
              amountText = `Rs. ${grandMRP.toLocaleString()}`;

              // Switch to smaller font for the "Old Total"
              doc.setFontSize(9);
              doc.setTextColor(255, 255, 255); // Pure solid white for visibility

              const textWidth = doc.getTextWidth(amountText);
              let lineX = data.cell.x + data.cell.width - textWidth - 5;
              let lineY = data.cell.y + data.cell.height - 4; // Position at bottom

              doc.text(amountText, lineX, lineY);

              // Draw White strike for dark background
              doc.setDrawColor(255, 255, 255);
              doc.setLineWidth(0.3);
              doc.line(lineX, lineY - 1, lineX + textWidth, lineY - 1);

              // Reset for any subsequent autoTable processing
              doc.setFontSize(9);
              doc.setTextColor(255, 255, 255);

              // Prevent the default strike logic from running since we manually drew it
              shouldStrike = false;
            }
          }

          if (shouldStrike && amountText) {
            const textWidth = doc.getTextWidth(amountText);
            let lineX = data.cell.x + 5;
            if (data.column.index === 5) { // Right aligned
              lineX = data.cell.x + data.cell.width - textWidth - 5;
            }

            // Adjust Y position based on row type (Summary row is taller)
            const lineY = data.cell.y + (data.row.index < order.items.length ? 12.2 : 10.5);

            // Set Color: Grey for regular rows, White for summary cell (which has dark background)
            if (data.row.index < order.items.length) {
              doc.setDrawColor(150, 150, 150);
            } else {
              doc.setDrawColor(255, 255, 255);
            }

            doc.setLineWidth(0.3);
            doc.line(lineX, lineY, lineX + textWidth, lineY);
          }
        }
      }
    });

    const finalY = doc.lastAutoTable.finalY + 20;

    // Signature Area
    doc.setDrawColor(241, 245, 249);
    doc.line(140, finalY + 15, 190, finalY + 15);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("Authorized Signature", 145, finalY + 20);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("Order details for Shree Shyam Darshan Automation System.", 14, 285);
    doc.text(`Record ID: ${order.id}`, 14, 290);

    doc.save(`Order_${order.orderNumber}.pdf`);
  };

  useEffect(() => { loadData(); }, []);

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("DATE_DESC");

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

  const counts = {
    ALL: data?.length || 0,
    PENDING: data?.filter(o => o.status === 'PENDING').length || 0,
    APPROVED: data?.filter(o => o.status === 'APPROVED').length || 0,
    DISPATCHED: data?.filter(o => o.status === 'DISPATCHED').length || 0,
    COMPLETED: data?.filter(o => o.status === 'COMPLETED').length || 0,
    CANCELLED: data?.filter(o => o.status === 'CANCELLED').length || 0,
  };

  const metrics = {
    totalValue: data?.reduce((acc, o) => acc + o.totalAmount, 0) || 0,
    activePipe: counts.PENDING + counts.APPROVED + counts.DISPATCHED,
    completed: counts.COMPLETED,
    totalDiscount: data?.reduce((acc, o) => acc + (o.originalTotal - o.totalAmount), 0) || 0
  };

  const filteredOrders = (data || []).filter(o => {
    const matchesSearch = o.orderNumber?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.wholesaler?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.wholesaler?.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.status.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortOrder === "DATE_DESC") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortOrder === "DATE_ASC") return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortOrder === "TOTAL_DESC") return b.totalAmount - a.totalAmount;
    if (sortOrder === "TOTAL_ASC") return a.totalAmount - b.totalAmount;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      {/* Unified Header & Search Command Row */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8 mb-12 py-8 border-b border-brand-primary/5">
        <div className="shrink-0">
          <h1 className="text-4xl font-serif font-bold text-brand-primary tracking-tight">Order Registry</h1>
          <p className="text-[10px] font-black text-brand-secondary uppercase tracking-[0.4em] mt-2">B2B Procurement Command</p>
        </div>

        <div className="flex flex-wrap items-end gap-6 w-full xl:w-auto">
          {/* Search Control */}
          <div className="flex flex-col gap-1.5 grow lg:grow-0 min-w-[320px]">
             <label className="text-[10px] font-black text-brand-primary/30 uppercase tracking-[0.2em] ml-1">Search Orders</label>
             <div className="relative group">
                <Icon icon="solar:magnifer-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/20 w-4 h-4 group-focus-within:text-brand-secondary transition-colors" />
                <input
                   suppressHydrationWarning
                   type="text"
                   placeholder="Search ID or Wholesaler name..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full bg-white border border-brand-primary/5 rounded-2xl p-3 pl-11 text-[11px] font-bold text-brand-primary focus:ring-8 focus:ring-brand-secondary/5 transition-all outline-none shadow-sm placeholder:text-brand-primary/20 tracking-wider h-[46px]"
                />
             </div>
          </div>

          <div className="flex flex-col gap-1.5 grow lg:grow-0">
             <label className="text-[10px] font-black text-brand-primary/30 uppercase tracking-[0.2em] ml-1">Order Status</label>
             <CustomSelect
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                   { value: "ALL", label: `All Orders (${counts.ALL})` },
                   { value: "PENDING", label: `Pending (${counts.PENDING})` },
                   { value: "APPROVED", label: `Approved (${counts.APPROVED})` },
                   { value: "DISPATCHED", label: `Dispatched (${counts.DISPATCHED})` },
                   { value: "COMPLETED", label: `Completed (${counts.COMPLETED})` },
                   { value: "CANCELLED", label: `Cancelled (${counts.CANCELLED})` },
                ]}
                className="w-full lg:w-56"
             />
          </div>

          <div className="flex flex-col gap-1.5 grow lg:grow-0">
             <label className="text-[10px] font-black text-brand-primary/30 uppercase tracking-[0.2em] ml-1">Sort Orders</label>
             <CustomSelect
                value={sortOrder}
                onChange={setSortOrder}
                options={[
                   { value: "DATE_DESC", label: "Date (Newest)" },
                   { value: "DATE_ASC", label: "Date (Oldest)" },
                   { value: "TOTAL_DESC", label: "Value (Highest)" },
                   { value: "TOTAL_ASC", label: "Value (Lowest)" },
                ]}
                className="w-full lg:w-48"
             />
          </div>
        </div>
      </div>

      {/* Intelligence Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-[32px] border border-brand-primary/5 shadow-sm hover:shadow-xl transition-all group">
          <p className="text-[10px] font-black text-brand-primary/30 uppercase tracking-widest mb-1">Processing</p>
          <p className="text-2xl font-black text-brand-primary tracking-tighter">{metrics.activePipe}</p>
          <div className="mt-3 inline-flex items-center px-2 py-0.5 bg-blue-50 text-[10px] font-bold text-blue-600 rounded-lg">
             Orders in Progress
          </div>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-brand-primary/5 shadow-sm hover:shadow-xl transition-all group">
          <p className="text-[10px] font-black text-brand-primary/30 uppercase tracking-widest mb-1">Completed</p>
          <p className="text-2xl font-black text-brand-primary tracking-tighter">{metrics.completed}</p>
          <div className="mt-3 inline-flex items-center px-2 py-0.5 bg-indigo-50 text-[10px] font-bold text-indigo-600 rounded-lg">
             Successfully Delivered
          </div>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-brand-primary/5 shadow-sm hover:shadow-xl transition-all group lg:col-span-1">
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Total Discount Given</p>
          <p className="text-2xl font-black text-emerald-500 tracking-tighter">₹{metrics.totalDiscount.toLocaleString()}</p>
          <div className="mt-3 inline-flex items-center px-2 py-0.5 bg-emerald-50 text-[10px] font-bold text-emerald-600 rounded-lg">
             Wholesaler Discount
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-brand-primary/5 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Icon icon="solar:round-alt-arrow-up-bold-duotone" className="w-20 h-20 text-brand-primary" />
          </div>
          <p className="text-[10px] font-black text-brand-primary/30 uppercase tracking-widest mb-1">Total Order Value</p>
          <p className="text-2xl font-black text-brand-primary tracking-tighter">₹{metrics.totalValue.toLocaleString()}</p>
          <div className="mt-3 inline-flex items-center px-2 py-0.5 bg-emerald-50 text-[10px] font-bold text-emerald-600 rounded-lg">
             All Orders Total
          </div>
        </div>

      </div>

      <div className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-brand-primary/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[1000px]">
            <thead className="bg-brand-primary/5 text-[10px] uppercase font-bold text-brand-primary/60 tracking-widest border-b border-brand-primary/5">
              <tr>
                <th className="p-6">Order ID</th>
                <th className="p-6">Wholesaler</th>
                <th className="p-6">Amount</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-primary/5">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-32 text-center">
                    <Icon icon="line-md:loading-loop" className="w-12 h-12 text-brand-secondary mx-auto" />
                    <p className="text-[10px] font-black text-brand-primary/20 uppercase tracking-widest mt-4">Syncing Registry...</p>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-32 text-center">
                    <div className="opacity-10 mb-4">
                      <Icon icon="solar:clipboard-remove-broken" className="w-16 h-16 mx-auto" />
                    </div>
                    <p className="text-brand-primary/30 italic font-serif text-lg">No records found matching your current command filter.</p>
                  </td>
                </tr>
              ) : filteredOrders.map(o => (
              <tr key={o.id} className="hover:bg-brand-primary/[0.02] transition-colors group">
                <td className="p-6">
                  <p onClick={() => setViewOrder(o)} className="font-bold text-brand-primary group-hover:text-brand-secondary cursor-pointer transition-colors">#{o.orderNumber}</p>
                  <p className="text-[10px] text-brand-primary/40 font-medium">{new Date(o.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="p-6">
                  <p className="font-bold text-brand-primary">{o.wholesaler?.name}</p>
                  <p className="text-[10px] text-brand-primary/40 font-medium uppercase tracking-widest">{o.wholesaler?.companyName || 'Private Partner'}</p>
                </td>
                <td className="p-6">
                  <p className="font-bold text-black">₹{o.totalAmount.toLocaleString()}</p>
                  <p className="text-[10px] text-brand-primary/40 font-medium">{o.items.length} Units Ordered</p>
                </td>
                <td className="p-6">
                  <div className={`inline-flex items-center px-4 py-1.5 rounded-full border text-[9px] font-bold uppercase tracking-widest ${STATUS_COLORS[o.status]}`}>
                    {o.status}
                  </div>
                </td>
                <td className="p-6 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <CustomSelect
                      value={o.status}
                      onChange={(val) => handleStatusUpdate(o.id, val)}
                      options={[
                        { value: "PENDING", label: "Pending" },
                        { value: "APPROVED", label: "Approved" },
                        { value: "DISPATCHED", label: "Dispatched" },
                        { value: "COMPLETED", label: "Completed" },
                        { value: "CANCELLED", label: "Cancelled" },
                      ]}
                      className="w-44"
                    />
                    <button
                      onClick={() => setViewOrder(o)}
                      className="p-3 bg-brand-primary/5 text-brand-primary rounded-xl hover:bg-brand-primary hover:text-white transition-all shadow-sm group/view"
                      title="View Manifest"
                    >
                      <Icon icon="solar:eye-bold-duotone" className="w-5 h-5 group-hover/view:scale-110 transition-transform" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Order Manifest View (Detailed View) */}
      {viewOrder && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Top Command Bar */}
          <header className="h-20 border-b border-brand-primary/5 flex items-center justify-between px-8 lg:px-12 bg-white sticky top-0 z-20">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setViewOrder(null)}
                className="flex items-center gap-2 text-brand-primary/40 hover:text-brand-primary transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-brand-primary/5 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all">
                  <Icon icon="lucide:arrow-left" className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest hidden sm:block">Back to Registry</span>
              </button>
              <div className="h-10 w-px bg-brand-primary/5 hidden sm:block"></div>
              <div>
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-serif font-bold text-brand-primary leading-none">Manifest #{viewOrder.orderNumber}</h2>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest shadow-sm ${STATUS_COLORS[viewOrder.status]}`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
                    {viewOrder.status}
                  </div>
                </div>
                <p className="text-[10px] font-bold text-brand-secondary uppercase tracking-[0.2em] mt-1.5">Registered: {new Date(viewOrder.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => downloadPDF(viewOrder)}
                className="flex items-center gap-3 px-8 py-3.5 bg-brand-primary text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-xl hover:bg-brand-secondary hover:scale-105 transition-all active:scale-95"
              >
                <Icon icon="solar:file-download-bold-duotone" className="w-5 h-5" />
                Generate Official PDF
              </button>
              <button
                onClick={() => setViewOrder(null)}
                className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
              >
                <Icon icon="lucide:x" className="w-6 h-6" />
              </button>
            </div>
          </header>

          {/* Main Manifest Body */}
          <main className="flex-1 overflow-hidden flex flex-col lg:flex-row bg-brand-primary/[0.01]">
            {/* Left Sidebar: Client & Financial Stats */}
            <aside className="w-full lg:w-80 border-r border-brand-primary/5 p-6 lg:p-8 overflow-y-auto bg-white/50 backdrop-blur-sm">
              <div className="space-y-8">
                {/* Client Profile */}
                <div>
                  <label className="text-[10px] font-black text-brand-primary/20 uppercase tracking-[0.3em] block mb-3">B2B Wholesaler Profile</label>
                  <div className="p-5 bg-brand-primary/2 rounded-[24px] border border-brand-primary/5">
                    <p className="text-xl font-serif font-bold text-brand-primary leading-tight">{viewOrder.wholesaler.name}</p>
                    <p className="text-xs font-bold text-brand-secondary mt-2 uppercase tracking-widest">{viewOrder.wholesaler.companyName || 'Private Partner'}</p>

                    <div className="mt-8 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-brand-primary/5 flex items-center justify-center text-brand-primary/40 shadow-sm">
                          <Icon icon="solar:phone-bold-duotone" className="w-4 h-4" />
                        </div>
                        <p className="text-[13px] font-bold text-brand-primary/70">{viewOrder.wholesaler.phone || 'N/A'}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-brand-primary/5 flex items-center justify-center text-brand-primary/40 shadow-sm">
                          <Icon icon="solar:letter-bold-duotone" className="w-4 h-4" />
                        </div>
                        <p className="text-[13px] font-bold text-brand-primary/70 truncate">{viewOrder.wholesaler.email}</p>
                      </div>
                      <div className="flex items-start gap-4 pt-4 border-t border-brand-primary/5">
                        <Icon icon="solar:map-point-bold-duotone" className="w-5 h-5 text-brand-primary/20 shrink-0" />
                        <p className="text-[12px] font-medium text-brand-primary/40 leading-relaxed italic">
                          {viewOrder.wholesaler.address || 'Logistics address not registered in profile.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div>
                  <label className="text-[10px] font-black text-brand-primary/20 uppercase tracking-[0.3em] block mb-3">Payment Summary</label>
                  <div className="p-6 bg-brand-primary text-white rounded-[32px] shadow-2xl relative overflow-hidden group">
                     {/* Decorative background element */}
                    <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                      <Icon icon="solar:wad-of-money-bold" className="w-48 h-48" />
                    </div>

                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Final Payable Amount</p>
                    <p className="text-2xl font-black tracking-tight leading-none mb-6">₹{viewOrder.totalAmount.toLocaleString()}</p>

                    <div className="pt-6 border-t border-white/10 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Gross Value</span>
                        <span className="text-sm font-bold opacity-60 line-through">₹{viewOrder.originalTotal?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Total Discount</span>
                        <span className="text-sm font-black text-emerald-400">₹{(viewOrder.originalTotal - viewOrder.totalAmount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Items Allocated</span>
                        <span className="text-sm font-black">{viewOrder.items.reduce((acc, it) => acc + it.quantity, 0)} Pcs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Right Panel: Expanded Product List */}
            <section className="flex-1 p-6 lg:p-8 overflow-y-auto custom-scrollbar bg-brand-primary/1">
              <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex items-center justify-between py-3 border-b border-brand-primary/5 mb-6">
                  <h3 className="text-sm font-black text-brand-primary uppercase tracking-[0.3em]">Order Product List</h3>
                  <div className="flex items-center gap-3 px-4 py-2 bg-brand-secondary/5 rounded-2xl border border-brand-secondary/10">
                    <Icon icon="solar:box-minimalistic-bold-duotone" className="w-5 h-5 text-brand-secondary" />
                    <span className="text-[10px] font-black text-brand-secondary uppercase tracking-widest">Packing Helper</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 pb-20">
                  {viewOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center p-4 bg-white rounded-[24px] border border-brand-primary/5 hover:border-brand-secondary/30 transition-all gap-6 shadow-sm hover:shadow-lg group">
                      {/* Product Visual */}
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-brand-primary/5 border border-brand-primary/5 shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-500">
                        <img src={item.product?.images?.[0] || '/hero.png'} alt={item.product?.name} className="w-full h-full object-cover" />
                      </div>

                      {/* Details Center */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                          <h4 className="font-serif font-bold text-brand-primary text-base truncate">{item.product?.name}</h4>
                          <div className="flex items-center gap-2">
                             <span className="px-3 py-1 bg-brand-primary/5 text-brand-primary text-[9px] font-black uppercase tracking-widest rounded-lg border border-brand-primary/5">ID: {item.product?.productId || 'N/A'}</span>
                             {item.variantName && (
                               <span className="px-3 py-1 bg-brand-secondary text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg">VARIANT: {item.variantName}</span>
                             )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          <div>
                            <p className="text-[9px] font-black text-brand-primary/20 uppercase tracking-widest mb-1.5">Rate Multiplier</p>
                            <div className="flex items-baseline gap-2">
                              <span className="text-base font-bold text-brand-primary tracking-tight">₹{item.price.toLocaleString()}</span>
                              {item.originalPrice > item.price && (
                                <span className="text-xs text-brand-primary/20 line-through font-bold">₹{item.originalPrice.toLocaleString()}</span>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-brand-primary/20 uppercase tracking-widest mb-1.5">Allocation</p>
                            <p className="text-lg font-black text-brand-primary leading-none">
                              {item.product?.unit?.toLowerCase() === "dozen" ? item.quantity / 12 : item.quantity}
                              <span className="text-xs lowercase italic font-normal opacity-40 ml-1">{item.product?.unit?.toLowerCase() || 'pcs'}</span>
                            </p>
                          </div>
                          <div className="col-span-2 sm:col-span-1 border-t sm:border-t-0 sm:border-l border-brand-primary/5 pt-2 sm:pt-0 sm:pl-6 text-right sm:text-left">
                            <p className="text-[9px] font-black text-brand-secondary uppercase tracking-widest mb-1">Sub Total</p>
                            <p className="text-lg font-black text-brand-secondary tracking-tighter leading-none">₹{(item.quantity * item.price).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>

                      {/* Verification Checkmark (Optional UX) */}
                      <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-primary/5 border border-brand-primary/5 text-brand-primary/20 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Icon icon="solar:check-circle-bold-duotone" className="w-6 h-6" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </main>
        </div>
      )}
    </div>
  );
}
