"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Product, CartItem } from "@/types/store";
import { supabase } from "@/lib/supabase";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import CartDrawer from "./CartDrawer";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, SlidersHorizontal, X, ChevronDown, PackageX } from "lucide-react";

const WHATSAPP_NUMBER = "593964008919";

const BRANDS: { id: string; label: string; full?: string }[] = [
  { id: "all", label: "Todas" },
  { id: "LINDASAL", label: "Lindasal" },
  { id: "AGUADEMAR QUINTON", label: "Aguademar", full: "Aguademar Quinton" },
  { id: "NAVELLA", label: "Navella" },
];

const CATEGORIES: { id: string; label: string }[] = [
  { id: "all", label: "Todas las categorias" },
  { id: "comestible", label: "Comestible" },
  { id: "belleza", label: "Belleza" },
  { id: "terapeutica", label: "Terapeutica" },
  { id: "combos", label: "Combos" },
];

const SORTS: { id: string; label: string }[] = [
  { id: "relevance", label: "Relevancia" },
  { id: "price-asc", label: "Precio: menor a mayor" },
  { id: "price-desc", label: "Precio: mayor a menor" },
  { id: "name-asc", label: "Nombre A-Z" },
];

export default function StoreClient() {
  // Solo productos reales de la base de datos (gestionados desde el admin panel)
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const { data, error } = await supabase.from("productos").select("*");
        if (error) throw error;
        setProducts((data || []).filter((p) => p.is_active !== false));
      } catch (err) {
        console.error("Error loading products from Supabase", err);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    }
    loadProducts();
  }, []);

  const [activeBrand, setActiveBrand] = useState<string>("all");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeSort, setActiveSort] = useState<string>("relevance");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("aguademar_cart");
      if (saved) setCart(JSON.parse(saved));
    } catch (err) {}
  }, []);

  useEffect(() => {
    localStorage.setItem("aguademar_cart", JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerSearch) ||
          p.category.toLowerCase().includes(lowerSearch) ||
          p.description?.toLowerCase().includes(lowerSearch) ||
          p.brand?.toLowerCase().includes(lowerSearch)
      );
    }

    if (activeBrand !== "all") {
      result = result.filter((p) => p.brand === activeBrand);
    }

    if (activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory);
    }

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
  }, [products, searchTerm, activeBrand, activeCategory, activeSort]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string | number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const changeQty = (id: string | number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: newQty > 0 ? newQty : 0 };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setActiveBrand("all");
    setActiveCategory("all");
    setActiveSort("relevance");
  };

  const handleCheckout = async (customerName: string) => {
    if (cart.length === 0) return;

    let total = 0;
    cart.forEach((item) => {
      const finalPrice = item.discount_percentage
        ? item.price * (1 - item.discount_percentage / 100)
        : item.price;
      total += finalPrice * item.quantity;
    });

    try {
      await supabase.from("ventas").insert([
        {
          customer_name: customerName || "Anónimo",
          items: cart,
          total_amount: total,
          status: "whatsapp_cart",
        },
      ]);
    } catch (err) {
      console.error("No se pudo registrar la venta en la base de datos", err);
    }

    let message = `*🌊 NUEVO PEDIDO — LINDASAL*\n_Sal Marina 100% Orgánica de Ecuador_\n\n`;
    if (customerName) message += `👤 *Cliente:* ${customerName}\n\n`;
    message += `🛒 *Productos solicitados:*\n─────────────────────\n`;

    cart.forEach((item) => {
      const finalPrice = item.discount_percentage
        ? item.price * (1 - item.discount_percentage / 100)
        : item.price;
      const sub = finalPrice * item.quantity;
      message += `• *${item.name}*\n  ${item.quantity} uni × $${finalPrice.toFixed(2)} = *$${sub.toFixed(2)}*\n`;
    });

    message += `─────────────────────\n💰 *TOTAL: $${total.toFixed(2)}*\n_(El total no incluye costos de envío)_\n\nPor favor, confírmeme disponibilidad, opciones de pago y tiempo de entrega. ¡Gracias! 🙏`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
    setCart([]);
    setIsCartOpen(false);
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const filtersActive = activeBrand !== "all" || activeCategory !== "all" || searchTerm.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 w-14 h-14 sm:w-16 sm:h-16 bg-navy text-pearl rounded-full shadow-floating flex items-center justify-center hover:bg-gold hover:text-navy transition-colors duration-500"
        aria-label={`Ver carrito, ${totalItems} articulos`}
      >
        <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.75} />
        {totalItems > 0 && (
          <motion.span
            key={totalItems}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            className="absolute -top-1 -right-1 bg-gold text-navy min-w-[22px] h-[22px] px-1.5 rounded-full text-[0.7rem] font-bold flex items-center justify-center border-2 border-bone"
          >
            {totalItems}
          </motion.span>
        )}
      </motion.button>

      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
          <h2 className="font-display text-2xl sm:text-3xl text-navy">
            Productos <span className="italic gradient-text-warm">disponibles</span>
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 lg:flex-initial lg:w-72">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40 w-4 h-4"
                strokeWidth={1.75}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar producto..."
                aria-label="Buscar productos"
                className="w-full bg-white border border-pearl-dark rounded-full py-3 pl-11 pr-4 text-sm placeholder:text-navy/40 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/40 transition-all"
              />
            </div>

            <div className="relative">
              <select
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value)}
                aria-label="Ordenar productos"
                className="appearance-none bg-white border border-pearl-dark rounded-full py-3 pl-5 pr-11 text-sm font-medium text-navy focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/40 transition-all cursor-pointer"
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/40 w-4 h-4 pointer-events-none"
                strokeWidth={1.75}
              />
            </div>

            <button
              onClick={() => setIsFiltersOpen((v) => !v)}
              aria-expanded={isFiltersOpen}
              className="lg:hidden inline-flex items-center gap-2 bg-navy text-pearl rounded-full py-3 px-5 text-sm font-medium hover:bg-navy-light transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" strokeWidth={1.75} />
              Filtros
            </button>
          </div>
        </div>

        <div className={`${isFiltersOpen ? "flex" : "hidden"} lg:flex flex-wrap items-center gap-2`}>
          <span className="text-eyebrow text-navy/45 mr-2 hidden sm:inline">Marca</span>
          {BRANDS.map((brand) => {
            const isActive = activeBrand === brand.id;
            const count = products.filter((p) => (brand.id === "all" ? true : p.brand === brand.id)).length;
            return (
              <button
                key={brand.id}
                onClick={() => setActiveBrand(brand.id)}
                aria-pressed={isActive}
                className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-navy text-pearl border border-navy"
                    : "bg-white text-navy/70 border border-pearl-dark hover:border-gold/50 hover:text-navy"
                }`}
              >
                {brand.label}
                <span
                  className={`text-[0.65rem] font-semibold ${isActive ? "text-gold" : "text-navy/40"}`}
                >
                  {count}
                </span>
              </button>
            );
          })}

          <span className="text-eyebrow text-navy/45 mx-2 hidden sm:inline ml-4">Categoria</span>
          {CATEGORIES.filter((c) => c.id !== "all").map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(isActive ? "all" : cat.id)}
                aria-pressed={isActive}
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-gold text-navy border border-gold"
                    : "bg-white text-navy/70 border border-pearl-dark hover:border-gold/50 hover:text-navy"
                }`}
              >
                {cat.label}
              </button>
            );
          })}

          {filtersActive && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-navy/60 hover:text-navy transition-colors duration-300 ml-auto"
            >
              <X className="w-3.5 h-3.5" strokeWidth={2} />
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      <div className="flex items-baseline justify-between mb-6 pb-4 border-b border-pearl-dark/60">
        <p className="text-sm text-navy/60">
          <span className="font-heading text-xl text-navy mr-2">{filteredProducts.length}</span>
          producto{filteredProducts.length !== 1 ? "s" : ""}
          {activeBrand !== "all" && (
            <span className="text-gold-dark italic ml-2">en {activeBrand}</span>
          )}
        </p>
      </div>

      {loadingProducts ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7" aria-label="Cargando productos">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl overflow-hidden border border-pearl-dark/40 bg-white animate-pulse"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="aspect-[4/5] bg-gradient-to-br from-pearl/70 via-bone to-pearl/50" />
              <div className="p-6 flex flex-col gap-3">
                <div className="h-2.5 w-1/3 rounded-full bg-pearl" />
                <div className="h-5 w-3/4 rounded-full bg-pearl-dark/40" />
                <div className="flex items-end justify-between mt-2">
                  <div className="h-7 w-20 rounded-full bg-gold/20" />
                  <div className="h-12 w-12 rounded-full bg-pearl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="surface-glass text-center rounded-3xl p-16 sm:p-24 flex flex-col items-center justify-center"
        >
          <div className="w-20 h-20 rounded-full bg-pearl flex items-center justify-center mb-6">
            <PackageX className="w-8 h-8 text-navy/30" strokeWidth={1.25} />
          </div>
          <h3 className="font-display text-3xl text-navy mb-3">Sin resultados</h3>
          <p className="text-navy/55 mb-8 max-w-[340px] text-sm leading-relaxed">
            No encontramos productos que coincidan con esos filtros. Prueba a quitar alguno o explora toda la coleccion.
          </p>
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-2 bg-navy text-pearl px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-gold hover:text-navy transition-colors duration-500"
          >
            Ver todos los productos
          </button>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, idx) => {
              const isFeatured = activeSort === "relevance" && product.is_featured && idx === 0;
              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: Math.min(idx * 0.04, 0.3) }}
                  className={isFeatured ? "sm:col-span-2" : ""}
                >
                  <ProductCard
                    product={product}
                    onQuickView={() => setSelectedProduct(product)}
                    onAdd={() => addToCart(product, 1)}
                    featured={isFeatured}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAdd={(product, qty) => {
          addToCart(product, qty);
          setSelectedProduct(null);
        }}
        onOrderWhatsApp={async (product, qty) => {
          const finalPrice = product.discount_percentage
            ? product.price * (1 - product.discount_percentage / 100)
            : product.price;
          const total = finalPrice * qty;

          try {
            await supabase.from("ventas").insert([
              {
                customer_name: "Comprador Rápido",
                items: [{ ...product, quantity: qty }],
                total_amount: total,
                status: "whatsapp_quick",
              },
            ]);
          } catch (e) {
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
    </motion.div>
  );
}
