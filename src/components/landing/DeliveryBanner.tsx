const items = [
  { icon: "fa-motorcycle", text: "Picker · Entrega a domicilio" },
  { icon: "fa-truck", text: "Envíos a todo el Ecuador" },
  { icon: "fa-store", text: "La Española · La Vienesa · DelPortal" },
  { icon: "fa-location-dot", text: "Urdesa Central, Bálsamo #913" },
  { icon: "fa-leaf", text: "100% Orgánico · Sin aditivos" },
  { icon: "fa-heart", text: "Hecho con manos ecuatorianas" },
];

export default function DeliveryBanner() {
  const loop = [...items, ...items];

  return (
    <div
      className="relative bg-pearl border-y border-navy/10 py-5 overflow-hidden"
      role="region"
      aria-label="Servicio y entrega"
    >
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-pearl to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-pearl to-transparent z-10 pointer-events-none" />

      <div className="flex items-center gap-12 animate-marquee whitespace-nowrap will-change-transform">
        {loop.map((item, i) => (
          <div key={i} className="flex items-center gap-3 text-navy/80 shrink-0" aria-hidden={i >= items.length}>
            <i className={`fa-solid ${item.icon} text-gold text-sm`} />
            <span className="font-body text-[0.78rem] tracking-[0.2em] uppercase font-medium">
              {item.text}
            </span>
            <span className="text-gold/50 text-xs ml-12" aria-hidden="true">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
