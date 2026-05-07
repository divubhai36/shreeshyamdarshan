"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { getWholesalers, createWholesaler, updateWholesaler, deleteWholesaler } from "../actions";
import toast from "react-hot-toast";


export default function WholesalersPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initForm = { name: "", email: "", password: "", companyName: "", phone: "", address: "", isActive: true };
  const [form, setForm] = useState(initForm);
  const [searchTerm, setSearchTerm] = useState("");

  const [showPasswords, setShowPasswords] = useState({});

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await getWholesalers();
    setData(res);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateWholesaler(editingId, form);
      toast.success("Identity Refined");
    } else {
      if (!form.password) {
        toast.error("Security violation: Password required");
        return;
      }
      await createWholesaler(form);
      toast.success("Account Provisioned");
    }
    setIsOpen(false);
    loadData();

  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-brand-primary">Wholesalers</h1>
          <p className="text-[10px] font-black text-brand-secondary tracking-[0.4em] uppercase mt-2 opacity-60">Wholesalers Account Management</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
          <div className="relative group w-full sm:w-80">
            <Icon icon="solar:magnifer-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/20 w-4 h-4 group-focus-within:text-brand-secondary transition-colors" />
            <input
              suppressHydrationWarning
              type="text"
              placeholder="Search by name, shop or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-brand-primary/5 rounded-xl p-3 pl-11 text-[11px] font-bold text-brand-primary focus:ring-4 focus:ring-brand-secondary/5 transition-all outline-none shadow-sm placeholder:text-brand-primary/20 tracking-wider"
            />

          </div>
          <button
            suppressHydrationWarning
            onClick={() => { setEditingId(null); setForm(initForm); setIsOpen(true); }}
            className="bg-brand-primary text-white px-6 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:shadow-2xl transition-all shadow-xl whitespace-nowrap flex items-center gap-2"
          >

            <Icon icon="lucide:plus" className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-brand-primary/5 overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-sm min-w-[900px]">
          <thead className="bg-brand-primary/5 text-[10px] uppercase font-bold text-brand-primary/60 tracking-widest border-b border-brand-primary/5">
            <tr>
              <th className="p-6">Client Identity</th>
              <th className="p-6">Company Profile</th>
              <th className="p-6">WhatsApp / Email</th>
              <th className="p-6">Password</th>
              <th className="p-6">Access Status</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-primary/5">
            {loading ? (
              <tr>
                <td colSpan="6" className="p-20 text-center">
                  <Icon icon="line-md:loading-loop" className="w-10 h-10 text-brand-secondary mx-auto" />
                </td>
              </tr>
            ) : data.filter(w =>
              w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              w.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              w.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              w.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              w.address?.toLowerCase().includes(searchTerm.toLowerCase())
            ).length === 0 ? (
              <tr>
                <td colSpan="6" className="p-20 text-center text-brand-primary/30 italic font-serif">No accounts matching your search criteria.</td>
              </tr>
            ) : data.filter(w =>
              w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              w.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              w.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              w.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              w.address?.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(w => (
              <tr key={w.id} className="hover:bg-brand-primary/[0.02] transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-brand-secondary/20 to-brand-secondary/5 flex items-center justify-center text-brand-secondary font-bold font-serif text-lg">
                      {w.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-brand-primary">{w.name}</p>
                      <p className="text-[9px] text-brand-secondary font-black uppercase tracking-tighter italic">Wholesaler</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <p className="font-bold text-brand-primary">{w.companyName || '—'}</p>
                  <p className="text-[10px] text-brand-primary/40 max-w-[200px] truncate">{w.address || 'No address provided'}</p>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon icon="logos:whatsapp-icon" className="w-3 h-3" />
                    <p className="font-bold text-brand-primary">{w.phone}</p>
                  </div>
                  <p className="text-[10px] text-brand-primary/40 break-all">{w.email || 'No email attached'}</p>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2">
                    <div className="bg-brand-primary/5 px-3 py-1.5 rounded-lg border border-brand-primary/5 relative group/pass overflow-hidden min-w-[120px]">
                      <p className="font-mono text-[11px] font-bold tracking-widest text-brand-primary">
                        {showPasswords[w.id] ? (w.plainPassword || 'N/A') : '••••••••'}
                      </p>
                      <button
                        suppressHydrationWarning
                        onClick={() => setShowPasswords(prev => ({ ...prev, [w.id]: !prev[w.id] }))}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-brand-secondary hover:scale-110 transition-transform"
                      >

                        <Icon icon={showPasswords[w.id] ? "solar:eye-bold-duotone" : "solar:eye-closed-bold-duotone"} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${w.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {w.isActive ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      suppressHydrationWarning
                      onClick={() => { setEditingId(w.id); setForm({ ...w, password: "" }); setIsOpen(true); }}
                      className="p-3 text-brand-primary/40 hover:text-brand-secondary hover:bg-brand-secondary/5 rounded-xl transition-all"
                    >

                      <Icon icon="solar:pen-new-square-bold-duotone" className="w-5 h-5" />
                    </button>
                    <button
                      suppressHydrationWarning
                      onClick={async () => { if (confirm("Terminate this account? All associated data will be frozen.")) { await deleteWholesaler(w.id); toast.success("Access Terminated"); loadData(); } }}
                      className="p-3 text-brand-primary/40 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
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

      {/* Account Provisioning Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-primary/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-white max-w-2xl w-full rounded-[40px] p-8 lg:p-12 shadow-2xl relative my-auto border border-white/20">
            <button onClick={() => setIsOpen(false)} className="absolute top-8 right-8 w-10 h-10 bg-brand-primary/5 rounded-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all">
              <Icon icon="lucide:x" className="w-5 h-5" />
            </button>

            <div className="mb-10">
              <h2 className="text-3xl font-serif font-bold text-brand-primary">{editingId ? 'Edit Information' : 'Wholesaler Account'}</h2>
              <p className="text-sm text-brand-primary/40 mt-1 font-medium">B2B Wholesaler Management</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/40 ml-2">Full Name</label>
                  <input suppressHydrationWarning type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full p-4 border border-brand-primary/5 rounded-2xl bg-brand-primary/2 focus:ring-4 focus:ring-brand-secondary/10 focus:bg-white outline-none transition-all font-bold text-brand-primary" required />

                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/40 ml-2">WhatsApp Number</label>
                  <input suppressHydrationWarning type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full p-4 border border-brand-primary/5 rounded-2xl bg-brand-primary/2 focus:ring-4 focus:ring-brand-secondary/10 focus:bg-white outline-none transition-all font-bold text-brand-primary placeholder:text-brand-primary/10" placeholder="Required for Login" required />

                </div>
              </div>

              {!editingId && (
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/40 ml-2">Password</label>
                  <input type="text" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full p-4 border border-brand-primary/5 rounded-2xl bg-brand-primary/2 focus:ring-4 focus:ring-brand-secondary/10 focus:bg-white outline-none transition-all font-bold text-brand-primary" placeholder="Set password" required />
                </div>
              )}

              {editingId && (
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/40 ml-2">New Access Code (Leave blank to keep current)</label>
                  <input type="text" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full p-4 border border-brand-primary/5 rounded-2xl bg-brand-primary/2 focus:ring-4 focus:ring-brand-secondary/10 focus:bg-white outline-none transition-all font-bold text-brand-primary" placeholder="Enter new password" />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/40 ml-2">Company Name</label>
                  <input type="text" value={form.companyName || ""} onChange={e => setForm({ ...form, companyName: e.target.value })} className="w-full p-4 border border-brand-primary/5 rounded-2xl bg-brand-primary/2 focus:ring-4 focus:ring-brand-secondary/10 focus:bg-white outline-none transition-all font-bold text-brand-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/40 ml-2">Optional Email</label>
                  <input type="email" value={form.email || ""} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full p-4 border border-brand-primary/5 rounded-2xl bg-brand-primary/2 focus:ring-4 focus:ring-brand-secondary/10 focus:bg-white outline-none transition-all font-bold text-brand-primary" placeholder="Optional for notifications" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/40 ml-2">Company Address</label>
                <textarea value={form.address || ""} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full p-4 border border-brand-primary/5 rounded-2xl bg-brand-primary/2 focus:ring-4 focus:ring-brand-secondary/10 focus:bg-white outline-none transition-all font-bold text-brand-primary h-24" />
              </div>

              <div className="flex items-center justify-between p-6 bg-brand-primary/5 rounded-[32px] border border-brand-primary/5 mb-4 group hover:bg-white hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-500">
                <div className="flex items-center gap-4 text-left">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${form.isActive ? 'bg-green-500/10 text-green-500' : 'bg-brand-primary/10 text-brand-primary/40'}`}>
                        <Icon icon={form.isActive ? "solar:shield-check-bold-duotone" : "solar:shield-warning-bold-duotone"} className="w-6 h-6" />
                    </div>
                    <div>
                        <label className="text-xs font-black uppercase tracking-[0.1em] text-brand-primary block leading-none">Account Access</label>
                        <p className="text-[9px] font-black text-brand-primary/40 uppercase tracking-[0.2em] mt-2 italic">{form.isActive ? 'Account Fully Authorized' : 'Authorization Suspended'}</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setForm({ ...form, isActive: !form.isActive })}
                    className={`relative w-16 h-9 rounded-full transition-all duration-500 p-1.5 focus:outline-none border-2 shadow-inner ${form.isActive ? 'bg-green-500 border-green-500/20' : 'bg-brand-primary/10 border-brand-primary/5'}`}
                >
                    <div className={`absolute top-1/2 -translate-y-1/2 w-7 h-7 bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all duration-500 flex items-center justify-center ${form.isActive ? 'left-7.5' : 'left-1'}`}>
                        <div className={`w-2 h-2 rounded-full ${form.isActive ? 'bg-green-500' : 'bg-brand-primary/20'}`} />
                    </div>
                </button>
              </div>

              <div className="pt-8 border-t border-brand-primary/5 flex justify-end gap-4">
                <button type="button" onClick={() => setIsOpen(false)} className="px-8 py-4 rounded-2xl font-bold uppercase tracking-widest bg-brand-primary/5 hover:bg-brand-primary/10 transition-all text-xs text-brand-primary">Discard</button>
                <button type="submit" className="px-10 py-4 rounded-2xl font-bold uppercase tracking-widest bg-brand-primary text-white hover:bg-brand-secondary transition-all shadow-xl text-xs flex items-center gap-2 hover:-translate-y-1 active:scale-95">
                  <Icon icon="solar:shield-check-bold" className="w-4 h-4" />
                  {editingId ? 'Update Information' : 'Authorize Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
