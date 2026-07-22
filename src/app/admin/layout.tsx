import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { ClerkProvider } from "@clerk/nextjs";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <div className="min-h-screen bg-bone">
        <AdminSidebar />
        {/* Móvil: deja espacio para la barra superior (h-14) y la tab bar inferior.
            Escritorio: deja espacio para el sidebar fijo de 264px. */}
        <main className="md:pl-[264px]">
          <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 pt-[4.5rem] pb-28 md:pt-8 md:pb-14">
            {children}
          </div>
        </main>
      </div>
    </ClerkProvider>
  );
}
