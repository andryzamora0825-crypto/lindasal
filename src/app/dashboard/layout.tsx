import { redirect } from "next/navigation";
import SidebarNav from "@/components/SidebarNav";
import ClientSidebarWrapper from "@/components/ClientSidebarWrapper";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = "lindasal_master";

  return (
    <ClientSidebarWrapper
      userButton={
        <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center font-bold text-navy">
          A
        </div>
      }
      sidebarNav={<SidebarNav />}
    >
      {children}
    </ClientSidebarWrapper>
  );
}
