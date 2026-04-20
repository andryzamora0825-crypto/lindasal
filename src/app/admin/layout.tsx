import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { ClerkProvider } from "@clerk/nextjs";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <div className="flex min-h-screen bg-[#f1f5f9]">
        <AdminSidebar />
        <main className="flex-1 md:ml-[260px] p-6 lg:p-10 transition-all w-full flex flex-col">
          <div className="w-full max-w-[1400px] mx-auto flex-1 flex flex-col">
            {children}
          </div>
        </main>
      </div>
    </ClerkProvider>
  );
}
