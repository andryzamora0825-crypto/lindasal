"use client";

import type { PostStatus } from "@/lib/types/social.types";
import {
  LayoutList,
  Clock,
  CheckCircle,
  Send,
  XCircle,
  ShieldOff,
} from "lucide-react";

interface PostFiltersProps {
  activeFilter: PostStatus | "all";
  onFilterChange: (filter: PostStatus | "all") => void;
  counts: Record<string, number>;
}

const FILTERS: { value: PostStatus | "all"; label: string; icon: React.ElementType }[] = [
  { value: "all", label: "Todos", icon: LayoutList },
  { value: "pending", label: "Pendientes", icon: Clock },
  { value: "approved", label: "Aprobados", icon: CheckCircle },
  { value: "published", label: "Publicados", icon: Send },
  { value: "failed", label: "Fallidos", icon: XCircle },
  { value: "rejected", label: "Rechazados", icon: ShieldOff },
];

export default function PostFilters({ activeFilter, onFilterChange, counts }: PostFiltersProps) {
  const totalAll = Object.values(counts).reduce((sum, c) => sum + c, 0);

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {FILTERS.map((f) => {
        const isActive = activeFilter === f.value;
        const count = f.value === "all" ? totalAll : (counts[f.value] || 0);
        const Icon = f.icon;

        return (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all duration-300 ${
              isActive
                ? "bg-gold/10 border-gold/40 text-gold-dark shadow-[0_0_12px_rgba(201,168,76,0.15)]"
                : "bg-white/50 border-gray-200 text-gray-500 hover:bg-white hover:text-navy hover:shadow-sm"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{f.label}</span>
            {count > 0 && (
               <span
                 className={`ml-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-black ${
                   isActive
                     ? "bg-gold/20 text-gold-dark"
                     : "bg-gray-100 text-gray-500"
                 }`}
               >
                 {count}
               </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
