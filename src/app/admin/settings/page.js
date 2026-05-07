"use client";
import React, { useState } from 'react';
import { Icon } from '@iconify/react';

export default function AdminSettings() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match!" });
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "Password updated successfully!" });
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage({ type: "error", text: data.error || "Update failed" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center max-w-4xl mx-auto text-left py-10 px-4">
      <div className="mb-12 text-center lg:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-secondary/10 border border-brand-secondary/20 text-brand-secondary text-[10px] uppercase font-bold tracking-widest mb-4">
            <Icon icon="solar:shield-keyhole-bold-duotone" className="w-4 h-4" />
            Security Protocol
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-brand-primary mb-3">Administrative Access</h1>
        <p className="text-sm text-brand-primary/40 font-medium tracking-wide">Manage your secure credentials and site-wide permissions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-3 w-full">
          <div className="bg-white p-6 md:p-8 lg:p-12 rounded-[32px] md:rounded-[48px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-black/5 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <Icon icon="solar:lock-keyhole-minimalistic-bold-duotone" className="w-32 h-32 text-brand-primary" />
            </div>
            
            <form onSubmit={handleUpdatePassword} className="space-y-8 text-left relative z-10">
              {message.text && (
                <div className={`p-5 rounded-2xl text-[11px] font-bold uppercase tracking-widest flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${message.type === "success" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-red-500/10 text-red-600 border border-red-500/20"}`}>
                  <Icon icon={message.type === "success" ? "solar:check-circle-bold-duotone" : "solar:danger-bold-duotone"} className="w-5 h-5 shrink-0" />
                  {message.text}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-[0.2em] pl-2 block">New Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/20 group-focus-within:text-brand-secondary transition-colors">
                    <Icon icon="solar:key-square-bold-duotone" className="w-6 h-6" />
                  </div>
                  <input 
                    type={showNew ? "text" : "password"} 
                    placeholder="Enter New Password" 
                    className="w-full p-5 pl-14 pr-12 bg-black/2 border border-transparent rounded-[24px] focus:bg-white focus:border-brand-secondary focus:ring-4 focus:ring-brand-secondary/10 outline-none transition-all duration-300 font-medium" 
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-primary/30 hover:text-brand-secondary transition-colors p-2 rounded-lg hover:bg-brand-secondary/5">
                    <Icon icon={showNew ? "solar:eye-bold-duotone" : "solar:eye-closed-bold-duotone"} className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-[0.2em] pl-2 block">Verify Credentials</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/20 group-focus-within:text-brand-secondary transition-colors">
                    <Icon icon="solar:shield-check-bold-duotone" className="w-6 h-6" />
                  </div>
                  <input 
                    type={showConfirm ? "text" : "password"} 
                    placeholder="Confirm New Password" 
                    className="w-full p-5 pl-14 pr-12 bg-black/2 border border-transparent rounded-[24px] focus:bg-white focus:border-brand-secondary focus:ring-4 focus:ring-brand-secondary/10 outline-none transition-all duration-300 font-medium" 
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-primary/30 hover:text-brand-secondary transition-colors p-2 rounded-lg hover:bg-brand-secondary/5">
                    <Icon icon={showConfirm ? "solar:eye-bold-duotone" : "solar:eye-closed-bold-duotone"} className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <button 
                disabled={loading} 
                type="submit" 
                className="w-full py-5 mt-4 bg-linear-to-r from-brand-secondary to-[#d4af37] text-white font-bold rounded-[24px] uppercase tracking-[0.25em] text-[11px] shadow-[0_10px_25px_rgba(212,175,55,0.3)] hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <Icon icon="line-md:loading-loop" className="w-6 h-6" /> : (
                  <>
                    <Icon icon="solar:lock-password-bold-duotone" className="w-5 h-5 text-white" />
                    Update Security Vault
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 w-full space-y-6">
            <div className="bg-brand-primary p-6 md:p-8 rounded-[32px] md:rounded-[40px] text-white relative overflow-hidden shadow-xl border border-white/5">
                <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12 pointer-events-none">
                    <Icon icon="solar:info-circle-bold-duotone" className="w-24 h-24" />
                </div>
                <h4 className="text-lg font-serif font-bold mb-3 relative z-10">Requirement Protocol</h4>
                <ul className="text-[11px] font-medium text-white/60 space-y-3 relative z-10">
                    <li className="flex items-center gap-2"><Icon icon="solar:check-read-bold" className="text-brand-secondary w-4 h-4" /> Minimum 6 characters</li>
                    <li className="flex items-center gap-2"><Icon icon="solar:check-read-bold" className="text-brand-secondary w-4 h-4" /> Alpha-numeric strength</li>
                    <li className="flex items-center gap-2"><Icon icon="solar:check-read-bold" className="text-brand-secondary w-4 h-4" /> Case sensitive verification</li>
                </ul>
            </div>

            <div className="p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-dashed border-brand-primary/20 bg-brand-primary/2">
                <h4 className="text-xs font-bold text-brand-primary uppercase tracking-widest mb-2">Last Update</h4>
                <p className="text-[10px] text-brand-primary/40 font-bold uppercase tracking-widest">Automatic sync with master database enabled</p>
            </div>
        </div>
      </div>
    </div>
  );
}
