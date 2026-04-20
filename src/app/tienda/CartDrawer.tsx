import React from "react";
import { CartItem } from "@/types/store";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemove: (id: string | number) => void;
  onChangeQty: (id: string | number, delta: number) => void;
  onCheckout: (customerName: string) => void;
}

export default function CartDrawer({ isOpen, onClose, cart, onRemove, onChangeQty, onCheckout }: CartDrawerProps) {
  const [customerName, setCustomerName] = React.useState("");
  
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-navy/60 z-[110] backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></div>
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[120] shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="complementary" aria-label="Carrito de compras"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-pearl-dark bg-pearl/30">
          <div className="flex items-center gap-3 text-navy">
            <i className="fa-solid fa-bag-shopping text-xl"></i>
            <h3 className="font-heading font-bold text-2xl">Tu Carrito</h3>
            <span className="bg-gold text-navy text-[0.7rem] font-bold px-2 py-0.5 rounded-full mt-1">{totalItems}</span>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-pearl-dark text-navy hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-white">
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70 mt-10">
              <i className="fa-solid fa-bag-shopping text-5xl text-pearl-dark mb-4"></i>
              <p className="font-heading text-xl text-navy font-bold mb-2">Tu carrito está vacío</p>
              <button onClick={onClose} className="mt-4 px-6 py-2 rounded-full border border-gold text-navy font-semibold hover:bg-gold transition-colors">
                Explorar productos
              </button>
            </div>
          ) : (
            cart.map(item => {
              const subtotal = item.price * item.quantity;
              return (
                <div key={item.id} className="flex gap-4 p-4 border border-pearl-dark rounded-2xl relative group bg-white shadow-sm hover:border-gold/30 hover:shadow-md transition-all">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {item.image_url ? <img src={item.image_url} alt={item.name} className="w-[70px] h-[70px] rounded-xl object-contain bg-[#f8f5f0] border border-pearl-dark/50" /> : <div className="w-[70px] h-[70px] rounded-xl bg-[#f8f5f0] border border-pearl-dark/50 flex items-center justify-center"><i className="fa-solid fa-bottle-droplet text-teal/30 text-2xl"></i></div>}
                  
                  <div className="flex flex-col flex-1">
                    <span className="font-heading font-bold text-navy leading-tight pr-6">{item.name}</span>
                    <span className="font-body font-bold text-gold">${item.price.toFixed(2)}</span>
                    
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-pearl-dark rounded-lg overflow-hidden h-8">
                        <button onClick={() => onChangeQty(item.id, -1)} className="w-8 h-full flex items-center justify-center text-navy bg-pearl/30 hover:bg-gold/20"><i className="fa-solid fa-minus text-[0.6rem]"></i></button>
                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                        <button onClick={() => onChangeQty(item.id, 1)} className="w-8 h-full flex items-center justify-center text-navy bg-pearl/30 hover:bg-gold/20"><i className="fa-solid fa-plus text-[0.6rem]"></i></button>
                      </div>
                      <span className="text-xs text-navy-light/60 font-semibold ml-auto">Sub: ${subtotal.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <button onClick={() => onRemove(item.id)} className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center text-red-400 bg-red-50 rounded-full hover:bg-red-500 hover:text-white transition-colors">
                    <i className="fa-solid fa-xmark text-xs"></i>
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Checkout */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-pearl-dark bg-pearl/30">
            <div className="flex justify-between items-end mb-4">
              <span className="font-heading text-lg font-semibold text-navy">Subtotal</span>
              <span className="font-heading text-3xl font-bold bg-gradient-to-r from-gold to-teal bg-clip-text text-transparent">${total.toFixed(2)}</span>
            </div>
            <p className="text-[0.75rem] text-navy-light/60 flex items-center gap-1.5 mb-5 font-medium">
              <i className="fa-solid fa-circle-info text-gold"></i> El total no incluye costos de envío
            </p>
            
            <div className="mb-4">
              <input 
                type="text" 
                placeholder="Ingresa tu nombre (Opcional)" 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-white border border-pearl-dark rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-gold/50"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={() => onCheckout(customerName)} className="flex-1 bg-[#25D366] text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-green-500/20 hover:-translate-y-1 hover:shadow-green-500/30 transition-all flex items-center justify-center gap-2">
                <i className="fa-brands fa-whatsapp text-lg"></i> Finalizar Pedido
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
