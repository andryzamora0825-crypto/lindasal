import React, { useState, useEffect } from "react";
import { Product } from "@/types/store";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAdd: (product: Product, quantity: number) => void;
  onOrderWhatsApp: (product: Product, quantity: number) => void;
}

export default function ProductModal({ product, onClose, onAdd, onOrderWhatsApp }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="modal-name">
      <div className="absolute inset-0 bg-navy/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-[900px] rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-fade-in-up">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/50 backdrop-blur-md rounded-full text-navy border border-pearl hover:bg-gold hover:border-gold transition-colors"
          aria-label="Cerrar"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Modal Image */}
        <div className="w-full md:w-[45%] bg-[#f8f5f0] relative flex items-center justify-center min-h-[250px] p-8">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image_url} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
          ) : (
            <i className="fa-solid fa-bottle-droplet text-6xl text-teal/40"></i>
          )}
          
          <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
            {product.stock < 10 && (
              <span className="bg-red-500/90 text-[0.65rem] font-bold uppercase text-white px-3 py-1 rounded shadow-sm border border-red-400">
                ¡Quedan {product.stock}!
              </span>
            )}
            {product.is_featured && (
              <span className="bg-gold/90 text-[0.65rem] font-bold uppercase text-navy px-3 py-1 rounded shadow-sm border border-gold-light/40">
                Nuevo
              </span>
            )}
          </div>
        </div>

        {/* Modal Info */}
        <div className="w-full md:w-[55%] p-6 md:p-10 flex flex-col max-h-[85vh] overflow-y-auto">
          <span className="text-[0.7rem] font-bold tracking-[0.15em] text-gold uppercase mb-2">{product.category}</span>
          <h2 id="modal-name" className="font-heading text-3xl md:text-4xl font-bold text-navy mb-2 leading-[1.15]">{product.name}</h2>
          <div className="font-heading text-3xl font-bold bg-gradient-to-r from-gold to-teal bg-clip-text text-transparent mb-6">
            ${product.price.toFixed(2)}
          </div>
          
          <p className="text-navy-light/70 leading-[1.8] text-[0.95rem] mb-8">{product.description}</p>

          <div className="flex flex-col gap-3 mb-8">
            <div className="flex items-center gap-3 text-sm text-navy font-semibold">
              <i className="fa-solid fa-leaf text-teal w-5 text-center"></i>
              <span>100% Natural y Orgánico</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-navy font-semibold">
              <i className="fa-solid fa-earth-americas text-teal w-5 text-center"></i>
              <span>Origen: Ecuador</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-navy font-semibold">
              <i className="fa-solid fa-box-open text-teal w-5 text-center"></i>
              <span>Disponibles: {product.stock} unidades</span>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-pearl-dark">
            <label className="text-xs font-bold text-navy uppercase tracking-wider mb-2 block">Cantidad</label>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-pearl-dark rounded-xl overflow-hidden bg-pearl/30">
                <button 
                  className="w-12 h-12 flex items-center justify-center text-navy hover:bg-gold/20 transition-colors"
                  onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)}
                  aria-label="Reducir cantidad"
                >
                  <i className="fa-solid fa-minus text-xs"></i>
                </button>
                <span className="w-10 text-center font-bold text-navy">{quantity}</span>
                <button 
                  className="w-12 h-12 flex items-center justify-center text-navy hover:bg-gold/20 transition-colors"
                  onClick={() => setQuantity(q => q < product.stock ? q + 1 : q)}
                  aria-label="Aumentar cantidad"
                >
                  <i className="fa-solid fa-plus text-xs"></i>
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => onAdd(product, quantity)}
                className="flex-[1] bg-navy border border-navy text-pearl font-medium py-3.5 rounded-xl transition-all shadow-md hover:bg-navy-light text-[0.9rem] flex justify-center items-center gap-2"
              >
                <i className="fa-solid fa-bag-shopping"></i> Añadir al carrito
              </button>
              <button 
                onClick={() => onOrderWhatsApp(product, quantity)}
                className="flex-[1] bg-[#25D366] text-white font-medium py-3.5 rounded-xl transition-all shadow-[0_4px_15px_rgba(37,211,102,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(37,211,102,0.4)] text-[0.9rem] flex justify-center items-center gap-2"
              >
                <i className="fa-brands fa-whatsapp"></i> Pedir vía WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
