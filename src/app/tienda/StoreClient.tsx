"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Product, CartItem } from "@/types/store";
import { mockProducts } from "@/data/mockProducts";
import { supabase } from "@/lib/supabase";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import CartDrawer from "./CartDrawer";

const WHATSAPP_NUMBER = "593964008919";

const BRANDS = [
  {
    id: "all",
    label: "Todas las Marcas",
    color: "bg-navy border-navy text-pearl",
    inactiveColor: "bg-white border-pearl-dark text-navy/70 hover:border-gold hover:text-navy",
    dot: null,
  },
  {
    id: "LINDASAL",
    label: "LINDASAL",
    color: "bg-[#c9a84c] border-[#c9a84c] text-white",
    inactiveColor: "bg-white border-pearl-dark text-[#c9a84c] hover:border-[#c9a84c]",
    dot: "bg-[#c9a84c]",
    icon: "fa-salt-shaker",
  },
  {
    id: "AGUADEMAR QUINTON",
    label: "AGUADEMAR",
    labelFull: "AGUADEMAR QUINTON",
    color: "bg-teal border-teal text-white",
    inactiveColor: "bg-white border-pearl-dark text-teal hover:border-teal",
    dot: "bg-teal",
    icon: "fa-droplet",
  },
  {
    id: "NAVELLA",
    label: "NAVELLA",
    color: "bg-purple-600 border-purple-600 text-white",
    inactiveColor: "bg-white border-pearl-dark text-purple-600 hover:border-purple-400",
    dot: "bg-purple-600",
    icon: "fa-sparkles",
  },
];

export default function StoreClient() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  
  // Load products from Supabase
  useEffect(() => {
    async function loadProducts() {
      try {
        const { data, error } = await supabase.from("productos").select("*");
        if (error) throw error;
        
        if (data) {
          // Filtramos en el cliente para evitar problemas con is_active = null en la base de datos
          const activeProducts = data.filter(p => p.is_active !== false);
          if (activeProducts.length > 0) {
            setProducts(activeProducts);
          } else if (data.length > 0) {
            // Si hay productos en la BD pero ninguno está activo, no mostramos los mock
            setProducts([]);
          }
        }
      } catch (err) {
        console.error("Error loading products from Supabase", err);
      }
    }
    loadProducts();
  }, []);
  
  // Filters
  const [activeBrand, setActiveBrand] = useState<string>("all");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeSort, setActiveSort] = useState<string>("relevance");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [priceMax, setPriceMax] = useState<number>(100);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  
  // Product Modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Load Cart from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("aguademar_cart");
      if (saved) setCart(JSON.parse(saved));
    } catch (err) {}
  }, []);

  // Save Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem("aguademar_cart", JSON.stringify(cart));
  }, [cart]);

  // Derived filtered products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowerSearch) || 
        p.category.toLowerCase().includes(lowerSearch) ||
        p.description?.toLowerCase().includes(lowerSearch) ||
        p.brand?.toLowerCase().includes(lowerSearch)
      );
    }

    if (activeBrand !== "all") {
      result = result.filter(p => p.brand === activeBrand);
    }

    if (activeCategory !== "all") {
      result = result.filter(p => p.category === activeCategory);
    }

    result = result.filter(p => p.price <= priceMax);

    switch (activeSort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "relevance":
      default:
        result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
        break;
    }

    return result;
  }, [products, searchTerm, activeBrand, activeCategory, priceMax, activeSort]);

  // Actions
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string | number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const changeQty = (id: string | number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: newQty > 0 ? newQty : 0 };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setActiveBrand("all");
    setActiveCategory("all");
    setActiveSort("relevance");
    setPriceMax(100);
  };

  const handleCheckout = async (customerName: string) => {
    if (cart.length === 0) return;

    let total = 0;
    cart.forEach(item => {
      const finalPrice = item.discount_percentage ? item.price * (1 - item.discount_percentage / 100) : item.price;
      total += finalPrice * item.quantity;
    });

    // Try to register the order in Supabase
    try {
      await supabase.from("ventas").insert([{
        customer_name: customerName || "Anónimo",
        items: cart,
        total_amount: total,
        status: "whatsapp_cart"
      }]);
    } catch (err) {
      console.error("No se pudo registrar la venta en la base de datos", err);
    }

    let message = `*🌊 NUEVO PEDIDO — LINDASAL*\n_Sal Marina 100% Orgánica de Ecuador_\n\n`;
    if (customerName) message += `👤 *Cliente:* ${customerName}\n\n`;
    message += `🛒 *Productos solicitados:*\n─────────────────────\n`;

    cart.forEach(item => {
      const finalPrice = item.discount_percentage ? item.price * (1 - item.discount_percentage / 100) : item.price;
      const sub = finalPrice * item.quantity;
      message += `• *${item.name}*\n  ${item.quantity} uni × $${finalPrice.toFixed(2)} = *$${sub.toFixed(2)}*\n`;
    });

    message += `─────────────────────\n💰 *TOTAL: $${total.toFixed(2)}*\n_(El total no incluye costos de envío)_\n\nPor favor, confírmeme disponibilidad, opciones de pago y tiempo de entrega. ¡Gracias! 🙏`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
    setCart([]);
    setIsCartOpen(false);
  };

  // Nav cart count
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      {/* Floating Cart Button */}
      <button 
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 w-[60px] h-[60px] bg-gold text-navy rounded-full shadow-[0_4px_20px_rgba(201,168,76,0.5)] flex items-center justify-center text-2xl z-40 transition-transform hover:scale-110"
        aria-label="Ver carrito"
      >
        <i className="fa-solid fa-bag-shopping"></i>
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white min-w-[24px] h-[24px] px-1.5 rounded-full text-xs font-bold flex items-center justify-center border-2 border-pearl">
            {totalItems}
          </span>
        )}
      </button>

      {/* BRAND FILTER HERO TABS */}
      <div className="w-full mb-6 sm:mb-8">
        <p className="text-xs font-bold text-navy/40 uppercase tracking-widest mb-3 sm:mb-4 text-center">Filtrar por Marca</p>
        <div className="flex gap-2 sm:gap-3 justify-start sm:justify-center overflow-x-auto pb-2 px-1 scrollbar-hide">
          {BRANDS.map(brand => (
            <button
              key={brand.id}
              onClick={() => setActiveBrand(brand.id)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold border-2 transition-all flex items-center gap-1.5 sm:gap-2 shadow-sm whitespace-nowrap shrink-0 ${
                activeBrand === brand.id ? brand.color : brand.inactiveColor
              }`}
            >
              {brand.dot && (
                <span className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${activeBrand === brand.id ? "bg-white/60" : brand.dot}`}></span>
              )}
              {brand.label}
              <span className="text-[0.65rem] sm:text-[0.7rem] opacity-70">
                ({products.filter(p => brand.id === "all" ? true : p.brand === brand.id).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* MOBILE FILTER TOGGLE */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden w-full flex items-center justify-center gap-2 bg-white border border-pearl-dark py-3 rounded-xl font-semibold text-navy shadow-sm"
        >
          <i className="fa-solid fa-sliders"></i> Filtros
        </button>

        {/* SIDEBAR */}
        <aside className={`fixed lg:sticky top-0 lg:top-[120px] left-0 h-full lg:h-auto w-[280px] sm:w-[320px] lg:w-[280px] bg-white lg:bg-transparent lg:shadow-none shadow-2xl z-50 lg:z-0 p-6 lg:p-0 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between lg:hidden mb-6">
            <h3 className="font-heading font-bold text-xl"><i className="fa-solid fa-filter text-gold"></i> Filtros</h3>
            <button onClick={() => setIsSidebarOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-pearl-dark text-navy"><i className="fa-solid fa-xmark"></i></button>
          </div>

          <div className="flex flex-col gap-8 bg-white lg:rounded-3xl lg:border lg:border-pearl-dark lg:p-6 lg:shadow-sm">
            {/* Search */}
            <div>
              <label className="text-xs font-bold text-navy uppercase tracking-wider mb-3 block">Buscar</label>
              <div className="relative">
                <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-light/40"></i>
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar producto..." 
                  className="w-full bg-pearl/30 border border-pearl-dark rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all"
                />
              </div>
            </div>

            {/* Brand Filter in Sidebar (Mobile) */}
            <div>
              <label className="text-xs font-bold text-navy uppercase tracking-wider mb-3 block">Marca</label>
              <div className="flex flex-col gap-2">
                {BRANDS.map(brand => (
                  <button
                    key={brand.id}
                    onClick={() => setActiveBrand(brand.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm border flex items-center gap-2 transition-all ${
                      activeBrand === brand.id
                        ? "bg-navy/5 border-navy/20 font-semibold text-navy"
                        : "bg-white border-pearl-dark text-navy/60 hover:border-gold/40"
                    }`}
                  >
                    {brand.dot && <span className={`w-2 h-2 rounded-full ${brand.dot}`}></span>}
                    {brand.labelFull || brand.label}
                    {activeBrand === brand.id && <i className="fa-solid fa-check ml-auto text-gold text-xs"></i>}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="text-xs font-bold text-navy uppercase tracking-wider mb-3 block">Categoría</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "all", label: "Todos" },
                  { id: "comestible", label: "Comestible", icon: "fa-utensils" },
                  { id: "belleza", label: "Belleza", icon: "fa-spa" },
                  { id: "terapeutica", label: "Terapéutica", icon: "fa-heart-pulse" },
                  { id: "combos", label: "Combos", icon: "fa-gift" },
                ].map(cat => (
                  <button 
                    key={cat.id} 
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-[0.8rem] border flex items-center gap-1.5 transition-all ${activeCategory === cat.id ? "bg-navy border-navy text-pearl font-medium" : "bg-white border-pearl-dark text-navy/70 hover:border-gold hover:text-navy"}`}
                  >
                    {cat.icon && <i className={`fa-solid ${cat.icon} ${activeCategory === cat.id ? "text-gold" : ""}`}></i>}
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-xs font-bold text-navy uppercase tracking-wider mb-3 flex justify-between">
                <span>Precio Máx.</span>
                <span className="text-gold">${priceMax}</span>
              </label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={priceMax} 
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-gold"
              />
            </div>

            {/* Sort */}
            <div>
              <label className="text-xs font-bold text-navy uppercase tracking-wider mb-3 block">Ordenar por</label>
              <select 
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value)}
                className="w-full bg-pearl/30 border border-pearl-dark rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-gold/50 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjI0IiBzdHJva2U9IiM1MzZDN0QiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cG9seWxpbmUgcG9pbnRzPSI2IDkgMTIgMTUgMTggOSIvPjwvc3ZnPg==')] bg-no-repeat bg-[position:right_0.75rem_center] bg-[length:1em_1em] pr-10"
              >
                <option value="relevance">Relevancia</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="name-asc">Nombre A-Z</option>
              </select>
            </div>

            <button onClick={clearFilters} className="text-sm font-semibold text-navy-light underline mt-2 hover:text-navy">
              Limpiar filtros
            </button>
          </div>
        </aside>

        {/* OVERLAY FOR MOBILE SIDEBAR */}
        {isSidebarOpen && (
          <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-navy/60 z-40 lg:hidden backdrop-blur-sm"></div>
        )}

        {/* PRODUCTS GRID */}
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row justify-between items-center bg-white border border-pearl-dark rounded-2xl p-4 mb-6 shadow-sm gap-4">
            <span className="font-medium text-navy text-sm">
              Mostrando <strong>{filteredProducts.length}</strong> producto{filteredProducts.length !== 1 ? 's' : ''}
              {activeBrand !== "all" && <span className="ml-2 text-gold font-semibold">· {activeBrand}</span>}
            </span>
            {(activeBrand !== "all" || activeCategory !== "all" || searchTerm) && (
              <button
                onClick={clearFilters}
                className="text-xs text-navy/50 hover:text-red-500 transition-colors flex items-center gap-1"
              >
                <i className="fa-solid fa-xmark"></i> Quitar filtros
              </button>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white border text-center border-pearl-dark border-dashed rounded-3xl p-16 flex flex-col items-center justify-center">
              <i className="fa-solid fa-box-open text-5xl text-pearl-dark mb-4 drop-shadow-sm"></i>
              <h3 className="font-heading font-bold text-2xl text-navy mb-2">Sin resultados</h3>
              <p className="text-navy-light/70 mb-6 max-w-[300px]">No encontramos productos que coincidan con esos filtros.</p>
              <button 
                onClick={clearFilters}
                className="px-6 py-2.5 rounded-full border-2 border-gold text-navy font-semibold hover:bg-gold hover:text-navy transition-colors"
              >
                Ver todos los productos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onQuickView={() => setSelectedProduct(product)}
                  onAdd={() => addToCart(product, 1)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        onAdd={(product, qty) => {
          addToCart(product, qty);
          setSelectedProduct(null);
        }}
        onOrderWhatsApp={async (product, qty) => {
          const finalPrice = product.discount_percentage ? product.price * (1 - product.discount_percentage / 100) : product.price;
          const total = finalPrice * qty;

          try {
            await supabase.from("ventas").insert([{
              customer_name: "Comprador Rápido",
              items: [{ ...product, quantity: qty }],
              total_amount: total,
              status: "whatsapp_quick"
            }]);
          } catch(e) {
             console.error("No se pudo registrar la venta rápida", e);
          }

          const msg = `*NUEVO PEDIDO RAPIDO*\nHola Lindasal, deseo pedir:\n• ${qty}x ${product.name} = $${total.toFixed(2)}`;
          window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
        }}
      />

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemove={removeFromCart}
        onChangeQty={changeQty}
        onCheckout={handleCheckout}
      />
    </>
  );
}
