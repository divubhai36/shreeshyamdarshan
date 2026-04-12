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
        item.quantity,
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
        3: { halign: "center", cellWidth: 16 },
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
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-brand-primary">Order List</h1>
          <p className="text-xs font-bold text-brand-secondary tracking-widest uppercase mt-1">B2B Wholselers Order</p>
        </div>
        <div className="relative group w-full md:w-80">
          <Icon icon="solar:magnifer-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/20 w-4 h-4 group-focus-within:text-brand-secondary transition-colors" />
          <input
            suppressHydrationWarning
            type="text"
            placeholder="Search by ID, wholesaler or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-brand-primary/5 rounded-xl p-3 pl-11 text-[11px] font-bold text-brand-primary focus:ring-4 focus:ring-brand-secondary/5 transition-all outline-none shadow-sm placeholder:text-brand-primary/20 tracking-wider"
          />

        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-brand-primary/5">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-primary/5 text-[10px] uppercase font-bold text-brand-primary/60 tracking-widest border-b border-brand-primary/5">
            <tr>
              <th className="p-6 rounded-tl-[40px]">Order ID</th>
              <th className="p-6">Wholesaler</th>
              <th className="p-6">Valuation</th>
              <th className="p-6">Fulfillment State</th>
              <th className="p-6 text-right rounded-tr-[40px]">Fulfillment Control</th>
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
                    <button
                      onClick={() => setViewOrder(o)}
                      className="p-3 bg-brand-primary/5 text-brand-primary rounded-xl hover:bg-brand-primary hover:text-white transition-all shadow-sm group/view"
                      title="View Manifest"
                    >
                      <Icon icon="solar:eye-bold-duotone" className="w-5 h-5 group-hover/view:scale-110 transition-transform" />
                    </button>
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
                      className="w-44"
                    />
                  </div>
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
            <div className="absolute top-8 right-8 flex items-center gap-3">
              <button
                onClick={() => downloadPDF(viewOrder)}
                className="flex items-center gap-2 px-6 py-2.5 bg-brand-secondary text-white rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg hover:scale-105 transition-all"
              >
                <Icon icon="solar:download-bold" className="w-4 h-4" />
                Download PDF
              </button>
              <button suppressHydrationWarning onClick={() => setViewOrder(null)} className="w-10 h-10 bg-brand-primary/5 rounded-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all">
                <Icon icon="lucide:x" className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-12">
              <div className="flex items-center gap-2">
                <h2 className="text-3xl font-serif font-bold text-brand-primary">Order Details</h2>
                <div className={`flex items-center justify-center py-1 px-4 rounded-full border text-[10px] font-bold uppercase tracking-[0.3em] ${STATUS_COLORS[viewOrder.status]}`}>
                  {viewOrder.status}
                </div>
              </div>
              <p className="text-sm text-brand-primary/40 mt-1 font-medium tracking-widest uppercase">ID: #{viewOrder.orderNumber} • {new Date(viewOrder.createdAt).toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 bg-brand-primary/2 p-8 rounded-[32px] border border-brand-primary/5">
              <div>
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/40 mb-4 ml-1">Client Information</h3>
                <p className="text-lg font-serif font-bold text-brand-primary">{viewOrder.wholesaler.name}</p>
                <p className="text-sm font-medium text-brand-primary/60 mt-1 uppercase tracking-widest">{viewOrder.wholesaler.companyName || 'B2B Client'}</p>
                <p className="text-sm text-brand-primary/40 mt-3 font-medium leading-relaxed">{viewOrder.wholesaler.address || 'Standard Partner Logistics'}</p>
              </div>
              <div>
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/40 mb-4 ml-1">Contact Details</h3>
                <p className="text-sm font-bold text-brand-primary">{viewOrder.wholesaler.email}</p>
                <p className="text-sm font-bold text-brand-primary mt-2">{viewOrder.wholesaler.phone || 'Registry Phone Not Available'}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-6 ml-1">
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/40">Allocated Inventory Items</h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-brand-secondary/5 rounded-lg border border-brand-secondary/10">
                  <Icon icon="solar:box-minimalistic-bold-duotone" className="w-3 h-3 text-brand-secondary" />
                  <span className="text-[9px] font-black text-brand-secondary uppercase tracking-widest leading-none">Packing Helper</span>
                </div>
              </div>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                {viewOrder.items.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-white rounded-3xl border border-brand-primary/5 hover:border-brand-secondary/30 transition-all gap-4 shadow-sm">
                    <div className="flex items-center gap-5 w-full sm:w-auto">
                      <div className="w-16 h-20 rounded-2xl overflow-hidden bg-gray-50 border border-brand-primary/10 shrink-0 shadow-inner">
                        <img src={item.product?.images?.[0] || '/hero.png'} alt={item.product?.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-brand-primary text-base leading-tight mb-1">{item.product?.name}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 bg-brand-primary/5 text-brand-primary text-[9px] font-black uppercase tracking-widest rounded-lg border border-brand-primary/5 shadow-sm">Product_ID: {item.product?.productId || 'N/A'}</span>
                          {item.variantName && (
                            <span className="px-2 py-0.5 bg-brand-secondary text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-md">Variant: {item.variantName}</span>
                          )}
                        </div>
                        <div className="flex items-baseline gap-2 mt-3">
                          <p className="text-[10px] font-black text-brand-primary/60 uppercase tracking-widest leading-none">
                            ₹{item.price.toLocaleString()}
                          </p>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <p className="text-[10px] text-brand-primary/20 line-through font-bold">₹{item.originalPrice.toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between sm:justify-end gap-10 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-brand-primary/5">
                      <div className="bg-brand-primary/5 px-6 py-3 rounded-2xl text-center sm:text-right min-w-[100px] border border-brand-primary/5">
                        <p className="text-[9px] font-black text-brand-primary/30 uppercase tracking-widest mb-0.5">Quantity</p>
                        <p className="text-xl font-black text-brand-primary leading-none">{item.quantity} <span className="text-[10px] lowercase italic font-normal opacity-40">pcs</span></p>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <p className="text-[9px] font-black text-brand-primary/20 uppercase tracking-widest mb-1">Subtotal</p>
                        <div className="flex items-baseline gap-2">
                          {item.originalPrice && item.originalPrice > item.price && (
                            <p className="text-sm font-bold text-brand-primary/10 line-through tracking-wider">₹{(item.quantity * item.originalPrice).toLocaleString()}</p>
                          )}
                          <p className="text-xl text-brand-secondary font-black tracking-tight leading-none">₹{(item.quantity * item.price).toLocaleString()}</p>
                        </div>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <p className="text-[8px] font-black text-emerald-600/60 uppercase tracking-tighter mt-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                            Order Savings: ₹{(item.quantity * (item.originalPrice - item.price)).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-brand-primary/5 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
              <div>
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-brand-primary/5 rounded-lg border border-brand-primary/5 text-[9px] font-black text-brand-primary/50 uppercase tracking-widest">
                    Total Units: {viewOrder.items.reduce((acc, it) => acc + it.quantity, 0)}
                  </div>
                </div>
              </div>
              <div className="text-right w-full sm:w-auto">
                <div className="flex flex-col items-end">
                  <p className="text-[10px] text-brand-primary/40 font-bold uppercase tracking-widest mb-1">Total Amount</p>
                  {viewOrder.originalTotal > viewOrder.totalAmount ? (
                    <div className="flex gap-2">
                      <div className="flex flex-col items-end">
                        <div className="mt-1 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 italic">
                          <p className="text-xs font-black text-green-600 uppercase tracking-widest">Saved ₹{(viewOrder.originalTotal - viewOrder.totalAmount).toLocaleString()}</p>
                        </div>
                        <p className="text-xl font-bold text-brand-primary/50 line-through tracking-wider leading-none mb-1">₹{viewOrder.originalTotal.toLocaleString()}</p>
                      </div>
                      <p className="text-4xl font-black text-brand-primary tracking-tight">₹{viewOrder.totalAmount.toLocaleString()}</p>
                    </div>
                  ) : (
                    <p className="text-4xl font-black text-brand-primary tracking-tight">₹{viewOrder.totalAmount.toLocaleString()}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
