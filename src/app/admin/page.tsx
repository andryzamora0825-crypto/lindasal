import React from "react";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1">Resumen general de tu negocio en tiempo real.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI Cards */}
        {[
          { label: "Ventas del Mes", value: "$4,250.00", icon: "fa-dollar-sign", color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Pedidos Hoy", value: "12", icon: "fa-shopping-cart", color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Productos en Inventario", value: "348", icon: "fa-box-open", color: "text-amber-500", bg: "bg-amber-50" },
          { label: "Posteos Generados (AI)", value: "24", icon: "fa-hashtag", color: "text-teal-500", bg: "bg-teal-50" },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
              <i className={`fa-solid ${kpi.icon} text-2xl`}></i>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{kpi.label}</p>
              <p className="text-2xl font-bold text-slate-800">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex-1 flex flex-col items-center justify-center text-center mt-4">
        <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mb-6">
          <i className="fa-solid fa-chart-line text-4xl text-slate-300"></i>
        </div>
        <h3 className="text-xl font-bold text-slate-700 mb-2">Bienvenido al nuevo panel de administración</h3>
        <p className="text-slate-500 max-w-[500px]">
          Desde aquí podrás gestionar tus productos, revisar el inventario, administrar ventas y utilizar el nuevo módulo de Inteligencia Artificial para tus redes sociales.
        </p>
      </div>
    </div>
  );
}
