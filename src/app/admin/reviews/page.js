"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { getReviews, updateReviewStatus, deleteReview, createReview, getWholesalers } from "../actions";
import CustomSelect from "@/components/CustomSelect";

const STATUS_COLORS = {
  PENDING: "bg-amber-50 text-amber-600 border-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-600 border-emerald-200",
  REJECTED: "bg-rose-50 text-rose-600 border-rose-200",
};

export default function ReviewsPage() {
  const [data, setData] = useState([]);
  const [wholesalers, setWholesalers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isDummy, setIsDummy] = useState(false);
  const [newReview, setNewReview] = useState({ wholesalerId: "", rating: 5, comment: "", dummyName: "", dummyCompany: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const [reviews, ws] = await Promise.all([getReviews(), getWholesalers()]);
    setData(reviews);

    // Filter wholesalers who don't have a review yet
    const existingWsIds = reviews.map(r => r.wholesalerId).filter(Boolean);
    setWholesalers(ws.filter(w => !existingWsIds.includes(w.id)));

    setLoading(false);
  };

  const handleCreateReview = async (e) => {
    e.preventDefault();

    if (isDummy) {
      if (!newReview.dummyName || !newReview.comment) return alert("Please enter a name and comment.");
    } else {
      if (!newReview.wholesalerId || !newReview.comment) return alert("Please select a wholesaler and write a comment.");
    }

    setSubmitting(true);
    const submissionData = isDummy
      ? { rating: newReview.rating, comment: newReview.comment, dummyName: newReview.dummyName, dummyCompany: newReview.dummyCompany }
      : { rating: newReview.rating, comment: newReview.comment, wholesalerId: newReview.wholesalerId };

    await createReview(submissionData);
    setSubmitting(false);
    setShowAddModal(false);
    setNewReview({ wholesalerId: "", rating: 5, comment: "", dummyName: "", dummyCompany: "" });
    setIsDummy(false);
    loadData();
  };

  const handleStatusUpdate = async (id, status) => {
    await updateReviewStatus(id, status);
    loadData();
  };

  const handleDelete = async (id) => {
    if (confirm("Permanently delete this feedback?")) {
      await deleteReview(id);
      loadData();
    }
  };

  const filteredData = data.filter(r =>
    (r.wholesaler?.name || r.dummyName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.comment || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.status || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      {/* ... previous header logic ... */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-brand-primary">Feedback Moderation</h1>
          <p className="text-xs font-bold text-brand-secondary tracking-widest uppercase mt-1">Manage Wholesaler Reviews</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative group w-full md:w-80">
            <Icon icon="solar:magnifer-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/20 w-4 h-4 group-focus-within:text-brand-secondary transition-colors" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-brand-primary/5 rounded-xl p-3 pl-11 text-[11px] font-bold text-brand-primary focus:ring-4 focus:ring-brand-secondary/5 transition-all outline-none shadow-sm placeholder:text-brand-primary/20 tracking-wider"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-brand-secondary transition-all shadow-lg active:scale-95 whitespace-nowrap"
          >
            <Icon icon="lucide:plus" className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-brand-primary/5">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-primary/5 text-[10px] uppercase font-bold text-brand-primary/60 tracking-widest border-b border-brand-primary/5">
            <tr>
              <th className="p-6 rounded-tl-3xl">Wholesaler</th>
              <th className="p-6">Feedback</th>
              <th className="p-6">Rating</th>
              <th className="p-6">Status</th>
              <th className="p-6 text-right rounded-tr-3xl">Moderation</th>
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
                <td colSpan="5" className="p-20 text-center text-brand-primary/30 italic font-serif">No feedback entries found.</td>
              </tr>
            ) : filteredData.map((r) => (
              <tr key={r.id} className="hover:bg-brand-primary/[0.02] transition-colors group">
                <td className="p-6">
                  <div className="flex  items-center gap-2 mb-1">
                    <p className="font-bold text-brand-primary">{r.wholesaler?.name || r.dummyName}</p>
                    {!r.dummyName && (
                      <span className="flex items-center gap-1 bg-green-50 text-green-600 p-1 rounded-full text-[7px] font-black uppercase tracking-widest border border-green-100">
                        <Icon icon="solar:verified-check-bold" className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-brand-primary/40 font-medium uppercase tracking-widest leading-normal">
                    {r.wholesaler?.companyName || r.dummyCompany || 'Independant Buyer'}
                  </p>
                </td>
                <td className="p-6 max-w-md">
                  <p className="text-xs text-brand-primary leading-relaxed italic">"{r.comment}"</p>
                  <p className="text-[9px] text-brand-primary/30 mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="p-6">
                  {!r.dummyName && (
                    <span className="flex items-center gap-1 bg-green-50 text-green-600 px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest border border-green-100 mb-2">
                      <Icon icon="solar:verified-check-bold" className="w-2.5 h-2.5" /> Original
                    </span>
                  )}
                  <div className="flex gap-0.5 text-brand-secondary">
                    {[...Array(5)].map((_, i) => (
                      <Icon key={i} icon="solar:star-bold" className={`w-3 h-3 ${i < r.rating ? 'text-amber-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                </td>
                <td className="p-6">
                  <div className={`inline-flex items-center px-4 py-1.5 rounded-full border text-[9px] font-bold uppercase tracking-widest ${STATUS_COLORS[r.status]}`}>
                    {r.status}
                  </div>
                </td>
                {/* <td className="p-6">
                  <div className={`inline-flex items-center px-4 py-1.5 rounded-full border text-[9px] font-bold uppercase tracking-widest ${STATUS_COLORS[r.status]}`}>
                    {r.status}
                  </div>
                </td> */}
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-3 items-center">
                    <CustomSelect
                      value={r.status}
                      options={[
                        { value: 'PENDING', label: 'Pending' },
                        { value: 'APPROVED', label: 'Approve' },
                        { value: 'REJECTED', label: 'Reject' }
                      ]}
                      onChange={(val) => handleStatusUpdate(r.id, val)}
                      className="w-32"
                    />
                    <button onClick={() => handleDelete(r.id)} className="p-2.5 text-brand-primary/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                      <Icon icon="solar:trash-bin-trash-bold-duotone" className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Review Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-brand-primary/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
            <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 text-brand-primary/20 hover:text-brand-primary transition-colors z-10">
              <Icon icon="lucide:x" className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-serif font-bold text-brand-primary mb-2">Configure Review</h2>
            <p className="text-[10px] font-bold text-brand-secondary uppercase tracking-widest mb-6">Create authentic or dummy feedback</p>

            <div className="flex bg-brand-primary/5 p-1 rounded-2xl mb-8">
              <button
                onClick={() => setIsDummy(false)}
                className={`flex-1 py-3 text-[10px] uppercase font-bold tracking-widest rounded-xl transition-all ${!isDummy ? 'bg-white shadow-sm text-brand-primary' : 'text-brand-primary/40'}`}
              >
                Real Account
              </button>
              <button
                onClick={() => setIsDummy(true)}
                className={`flex-1 py-3 text-[10px] uppercase font-bold tracking-widest rounded-xl transition-all ${isDummy ? 'bg-white shadow-sm text-brand-primary' : 'text-brand-primary/40'}`}
              >
                Dummy Profile
              </button>
            </div>

            <form onSubmit={handleCreateReview} className="space-y-6">
              {!isDummy ? (
                <div>
                  <label className="block text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest mb-2 ml-1">Select Wholesaler</label>
                  <CustomSelect
                    placeholder="Choose a partner account..."
                    options={wholesalers.map(w => ({ value: w.id, label: `${w.name} (${w.companyName || 'No Company'})` }))}
                    value={newReview.wholesalerId}
                    onChange={(val) => setNewReview({ ...newReview, wholesalerId: val })}
                    isSearchable={true}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest mb-2 ml-1">Customer Name</label>
                    <input
                      type="text"
                      className="w-full bg-brand-primary/2 border border-brand-primary/5 rounded-2xl p-4 text-xs font-bold text-brand-primary outline-none focus:ring-4 focus:ring-brand-secondary/5 transition-all"
                      placeholder="Enter Customer Name"
                      value={newReview.dummyName}
                      onChange={(e) => setNewReview({ ...newReview, dummyName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest mb-2 ml-1">City / Company</label>
                    <input
                      type="text"
                      className="w-full bg-brand-primary/2 border border-brand-primary/5 rounded-2xl p-4 text-xs font-bold text-brand-primary outline-none focus:ring-4 focus:ring-brand-secondary/5 transition-all"
                      placeholder="Enter City/Company"
                      value={newReview.dummyCompany}
                      onChange={(e) => setNewReview({ ...newReview, dummyCompany: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest mb-3 ml-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: s })}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${newReview.rating >= s ? 'bg-amber-100 text-amber-500 scale-105' : 'bg-brand-primary/2 text-brand-primary/10'}`}
                    >
                      <Icon icon="solar:star-bold" className="w-6 h-6" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest mb-2 ml-1">Description</label>
                <textarea
                  className="w-full bg-brand-primary/2 border border-brand-primary/5 rounded-2xl p-5 text-xs font-bold text-brand-primary outline-none focus:ring-4 focus:ring-brand-secondary/5 transition-all h-32 resize-none placeholder:text-brand-primary/10"
                  placeholder="Enter the review text here..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting || (!isDummy && wholesalers.length === 0)}
                className="w-full bg-brand-primary text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] shadow-xl hover:bg-brand-secondary transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {submitting ? <Icon icon="line-md:loading-loop" className="w-5 h-5" /> : (
                  <>
                    <Icon icon="solar:cloud-upload-bold-duotone" className="w-5 h-5" />
                    Publish {isDummy ? 'Dummy' : 'Verified'} Review
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
