"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { getInquiries, deleteInquiry } from "../actions";
import toast from "react-hot-toast";

export default function InquiriesPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await getInquiries();
    setData(res);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this inquiry?")) {
      await deleteInquiry(id);
      toast.success("Inquiry removed from registry");
      loadData();
    }
  };

  const filteredData = data.filter(i => 
    i.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.mobile?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.product?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-brand-primary">Inquiry Vault</h1>
          <p className="text-xs font-bold text-brand-secondary tracking-widest uppercase mt-1">Direct Leads from Website</p>
        </div>
        <div className="relative group w-full md:w-80">
          <Icon icon="solar:magnifer-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/20 w-4 h-4 group-focus-within:text-brand-secondary transition-colors" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-brand-primary/5 rounded-xl p-3 pl-11 text-[11px] font-bold text-brand-primary focus:ring-4 focus:ring-brand-secondary/5 transition-all outline-none shadow-sm placeholder:text-brand-primary/20 tracking-wider"
          />
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-brand-primary/5 overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-primary/5 text-[10px] uppercase font-bold text-brand-primary/60 tracking-widest border-b border-brand-primary/5">
            <tr>
              <th className="p-6">User Details</th>
              <th className="p-6">Inquiry For</th>
              <th className="p-6">Location</th>
              <th className="p-6">Channel</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-primary/5">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-20 text-center">
                  <Icon icon="line-md:loading-loop" className="w-10 h-10 text-brand-secondary mx-auto" />
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-20 text-center text-brand-primary/30 italic font-serif">No inquiries found in this sector.</td>
              </tr>
            ) : filteredData.map(i => (
              <tr key={i.id} className="hover:bg-brand-primary/[0.02] transition-colors group">
                <td className="p-6">
                  <p className="font-bold text-brand-primary">{i.name}</p>
                  <p className="text-[11px] text-brand-secondary font-medium">{i.mobile}</p>
                  <p className="text-[9px] text-brand-primary/30 font-bold uppercase mt-1">{new Date(i.createdAt).toLocaleString()}</p>
                </td>
                <td className="p-6">
                  <p className="font-bold text-brand-primary line-clamp-1">{i.product || 'General Inquiry'}</p>
                  {i.pieces && <p className="text-[10px] text-brand-primary/40 font-medium italic">Requirement: {i.pieces} Units</p>}
                </td>
                <td className="p-6">
                  <p className="text-xs font-bold text-brand-primary/60">{i.city || 'N/A'}</p>
                  <p className="text-[10px] text-brand-primary/30 font-medium uppercase tracking-widest">{i.state || 'India'}</p>
                </td>
                <td className="p-6">
                   <div className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${i.type === 'PRODUCT' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/10'}`}>
                      {i.type} Lead
                   </div>
                </td>
                <td className="p-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <a 
                      href={`https://wa.me/${i.mobile.replace(/\D/g, '')}`} 
                      target="_blank"
                      className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                      title="Contact on WhatsApp"
                    >
                      <Icon icon="logos:whatsapp-icon" className="w-5 h-5 grayscale hover:grayscale-0 transition-all" />
                    </a>
                    <button
                      onClick={() => handleDelete(i.id)}
                      className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                      title="Archive Lead"
                    >
                      <Icon icon="solar:trash-bin-trash-bold-duotone" className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
