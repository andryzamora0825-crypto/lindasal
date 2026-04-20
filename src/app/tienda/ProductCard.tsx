import React from "react";
import { Product } from "@/types/store";

interface ProductCardProps {
  product: Product;
  onQuickView: () => void;
  onAdd: () => void;
}

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

  return (
    <article className="bg-white rounded-3xl border border-pearl-dark shadow-sm overflow-hidden group hover:border-gold/40 hover:shadow-lg transition-all flex flex-col h-full">
      <div className="relative aspect-square w-full bg-[#f8f5f0] flex items-center justify-center overflow-hidden">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <i className="fa-solid fa-bottle-droplet text-[3.5rem] text-teal/40 group-hover:scale-110 transition-transform duration-500"></i>
        )}
        
        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10 items-start">
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
              <i className="fa-solid fa-star text-[0.55rem]"></i> Nuevo
            </span>
          )}
        </div>

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
        <div className="font-heading font-bold text-2xl text-navy mb-5 mt-auto">${product.price.toFixed(2)}</div>
        
        <button 
          onClick={(e) => {
            // Ripple animation logic could go here
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
