import AdminSidebar from "./Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex bg-[#f8f9fa] min-h-screen text-brand-primary overflow-x-hidden text-left">
      <AdminSidebar />
      <div className="flex-1 p-4 lg:p-10 ml-0 lg:ml-64 w-full max-w-[100vw] text-left">
        {children}
      </div>
    </div>
  );
}
