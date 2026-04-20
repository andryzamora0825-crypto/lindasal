export default function DeliveryBanner() {
  return (
    <div
      className="bg-gradient-to-br from-gold-dark via-gold to-teal-dark py-6 px-[5%] flex justify-center gap-12 flex-wrap"
      role="banner"
      aria-label="Información de entrega"
    >
      <div className="flex items-center gap-3 text-navy font-semibold text-sm font-body">
        <i className="fa-solid fa-motorcycle text-xl" aria-hidden="true"></i>
        Picker — Entrega a domicilio
      </div>
      <div className="flex items-center gap-3 text-navy font-semibold text-sm font-body">
        <i className="fa-solid fa-truck text-xl" aria-hidden="true"></i>
        Envíos a todo el país
      </div>
      <div className="flex items-center gap-3 text-navy font-semibold text-sm font-body">
        <i className="fa-solid fa-store text-xl" aria-hidden="true"></i>
        La Española · La Vienesa · DelPortal
      </div>
      <div className="flex items-center gap-3 text-navy font-semibold text-sm font-body">
        <i className="fa-solid fa-location-dot text-xl" aria-hidden="true"></i>
        Urdesa Central, Bálsamo #913
      </div>
    </div>
  );
}
