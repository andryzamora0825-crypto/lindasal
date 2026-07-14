import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { ClerkProvider } from "@clerk/nextjs";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <div className="flex min-h-screen bg-bone">
        <AdminSidebar />
        <main className="flex-1 md:ml-[260px] px-4 pt-20 pb-10 md:pt-10 md:px-10 transition-all w-full flex flex-col">
          <div className="w-full max-w-[1400px] mx-auto flex-1 flex flex-col">
            {children}
          </div>
        </main>
      </div>
    </ClerkProvider>
  );
}
