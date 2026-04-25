import React from "react";
import { Product } from "@/types/store";

interface ProductCardProps {
  product: Product;
  onQuickView: () => void;
  onAdd: () => void;
}

const getBrandStyle = (brand?: string) => {
  switch (brand) {
    case "LINDASAL":
      return { bg: "bg-[#c9a84c]", text: "text-white", label: "LINDASAL" };
    case "AGUADEMAR QUINTON":
      return { bg: "bg-teal", text: "text-white", label: "AGUADEMAR" };
    case "NAVELLA":
      return { bg: "bg-purple-600", text: "text-white", label: "NAVELLA" };
    default:
      return null;
  }
};

export default function ProductCard({ product, onQuickView, onAdd }: ProductCardProps) {
  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "comestible": return "Comestible";
      case "belleza": return "Belleza";
      case "terapeutica": return "Terapéutica";
      case "combos": return "Combos";
      default: return cat;
    }
  };

  const isLowStock = product.stock < 10;
  const brandStyle = getBrandStyle(product.brand);

  return (
    <article className="bg-white rounded-3xl border border-pearl-dark shadow-sm overflow-hidden group hover:border-gold/40 hover:shadow-lg transition-all flex flex-col h-full">
      <div className="relative aspect-square w-full bg-[#f8f5f0] flex items-center justify-center overflow-hidden">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="flex flex-col items-center gap-3 opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-500">
            {product.brand === "AGUADEMAR QUINTON" && <i className="fa-solid fa-droplet text-[3.5rem] text-teal"></i>}
            {product.brand === "NAVELLA" && <i className="fa-solid fa-flask text-[3.5rem] text-purple-400"></i>}
            {(product.brand === "LINDASAL" || !product.brand) && <i className="fa-solid fa-bottle-droplet text-[3.5rem] text-[#c9a84c]"></i>}
          </div>
        )}
        
        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10 items-start">
          {/* Brand badge */}
          {brandStyle && (
            <span className={`${brandStyle.bg} ${brandStyle.text} text-[0.6rem] font-extrabold tracking-[0.12em] uppercase px-2.5 py-1 rounded-md shadow-sm`}>
              {brandStyle.label}
            </span>
          )}
          <span className="bg-white/90 backdrop-blur-sm text-[0.65rem] font-bold tracking-wider uppercase text-navy px-2.5 py-1 rounded-md shadow-sm border border-pearl/60">
            {getCategoryLabel(product.category)}
          </span>
          {isLowStock && (
            <span className="bg-red-500/90 backdrop-blur-sm text-[0.65rem] font-bold tracking-wider uppercase text-white px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1 border border-red-400">
              <i className="fa-solid fa-fire"></i> ¡Quedan {product.stock}!
            </span>
          )}
          {product.is_featured && (
            <span className="bg-gold/90 backdrop-blur-sm text-[0.65rem] font-bold tracking-wider uppercase text-navy px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1 border border-gold-light/40">
              <i className="fa-solid fa-star text-[0.55rem]"></i> Destacado
            </span>
          )}
        </div>

        {/* Premium Discount Badge - Top Right Corner */}
        {product.discount_percentage && product.discount_percentage > 0 ? (
          <div className="absolute top-3 right-3 z-10">
            <div className="flex flex-col items-center justify-center w-[3.25rem] h-[3.25rem] bg-gradient-to-br from-[#c9a84c] to-[#9c813b] rounded-full shadow-[0_4px_12px_rgba(201,168,76,0.3)] border border-white/40 transform hover:rotate-3 transition-transform">
              <span className="text-navy font-heading font-extrabold text-[0.95rem] leading-none">-{product.discount_percentage}%</span>
              <span className="text-navy/90 text-[0.55rem] font-extrabold tracking-widest uppercase mt-0.5 leading-none">OFF</span>
            </div>
          </div>
        ) : null}

        {/* Hover overlay for quick view */}
        <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center backdrop-blur-[2px]">
          <button 
            onClick={onQuickView}
            className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 bg-white text-navy font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-gold hover:text-navy border border-transparent shadow-lg flex items-center gap-2"
          >
            <i className="fa-solid fa-eye"></i> Vista Rápida
          </button>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-heading font-semibold text-xl text-navy mb-1 leading-tight line-clamp-2 min-h-[50px]">{product.name}</h3>
        <p className="text-navy-light/60 text-sm line-clamp-2 mb-4 leading-relaxed">{product.description}</p>
        
        {/* Price section with discount logic */}
        <div className="mb-5 mt-auto flex items-end gap-2">
          {product.discount_percentage && product.discount_percentage > 0 ? (
            <>
              <span className="font-heading font-bold text-2xl text-navy">
                ${(product.price * (1 - product.discount_percentage / 100)).toFixed(2)}
              </span>
              <span className="font-heading font-medium text-lg text-slate-400 line-through mb-0.5">
                ${product.price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="font-heading font-bold text-2xl text-navy">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          className="w-full bg-gradient-to-r from-navy to-navy/90 hover:from-navy border border-navy text-pearl font-medium py-3 rounded-xl transition-all shadow-md hover:shadow-lg flex justify-center items-center gap-2 group-hover:bg-gold group-hover:border-gold group-hover:text-navy"
        >
          <i className="fa-solid fa-bag-shopping"></i> Agregar
        </button>
      </div>
    </article>
  );
}
