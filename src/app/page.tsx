export default function Home() {
  const modulos = [
    {
      name: "Centros de Salud",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16 text-white">
          <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4M12 9v4M10 11h4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      href: "/semaforo"
    },
    {
      name: "Turnos y Agendas",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16 text-white">
          <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      href: "/turnos"
    },
    {
      name: "Ficha Unificada",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16 text-white">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      href: "/ficha-unificada"
    },
    {
      name: "Bandeja Central",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16 text-white">
          <path d="M22 12h-6l-2 3h-4l-2-3H2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      href: "/pendientes"
    },
    {
      name: "Asistente IA",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16 text-white">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
          <path d="M12 7v1M12 16v1M7 12h1M16 12h1" strokeLinecap="round" />
        </svg>
      ),
      href: "/asistente-ia"
    },
    {
      name: "Transparencia",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16 text-white">
          <circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /><path d="M2 12h20" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      href: "/transparencia"
    },
    {
      name: "Unificación",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16 text-white">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      href: "/unificacion"
    }
  ];

  return (
    <div className="space-y-16">
      {/* Intro section */}
      <div className="text-center md:text-left">
        <h2 className="text-3xl font-black text-[#0067b1] font-outfit uppercase tracking-tighter">
          Servicios Destacados
        </h2>
        <p className="text-zinc-500 font-bold mt-2">Bienvenida Silvia. Seleccione la herramienta de gestión para comenzar.</p>
      </div>

      {/* Grid of Two-Tone Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {modulos.map((modulo) => (
          <a key={modulo.name} href={modulo.href} className="portal-card group">
            <div className="portal-card-top group-hover:bg-[#005694] transition-all duration-300 relative flex items-center justify-center p-12">
              <div className="relative z-10 scale-100 group-hover:scale-110 transition-transform duration-500">
                {modulo.icon}
              </div>
            </div>
            <div className="portal-card-bottom py-8">
              <span className="text-xl font-black text-[#333] tracking-tighter transition-colors group-hover:text-[#0067b1]">
                {modulo.name}
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* Statistics Section (Institutional Style) */}
      <div className="mt-20 p-12 rounded-[32px] bg-zinc-50 border border-zinc-100 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
        <div>
          <p className="text-4xl font-black text-[#0067b1]">8</p>
          <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mt-2">Alertas Críticas</p>
        </div>
        <div className="border-x border-zinc-200">
          <p className="text-4xl font-black text-[#0067b1]">14</p>
          <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mt-2">Seguimientos</p>
        </div>
        <div className="border-r border-zinc-200 md:block hidden">
          <p className="text-4xl font-black text-emerald-600">92%</p>
          <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mt-2">Resolución</p>
        </div>
        <div className="md:block hidden">
          <p className="text-4xl font-black text-[#00a2e1]">45k</p>
          <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mt-2">Pacientes/Mes</p>
        </div>
      </div>
    </div>
  );
}
