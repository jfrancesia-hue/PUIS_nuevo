export default function ModoSimple() {
    return (
        <div className="min-h-[calc(100vh-160px)] flex flex-col justify-center animate-fade-in">
            {/* Header for Simple Mode */}
            <div className="text-center mb-12">
                <h1 className="text-5xl font-black text-zinc-900 dark:text-zinc-50 font-outfit uppercase tracking-tighter">
                    Modo <span className="text-accent underline decoration-8 decoration-accent/20">Operador</span>
                </h1>
                <p className="text-xl text-zinc-500 font-bold mt-4">¿Qué necesitas hacer ahora?</p>
            </div>

            {/* Ultra-Large Buttons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto w-full">
                {/* Search DNI */}
                <button className="group relative flex flex-col items-center justify-center p-12 bg-white dark:bg-zinc-900 border-4 border-zinc-200 dark:border-zinc-800 rounded-[40px] hover:border-accent hover:bg-accent hover:text-white transition-all duration-300 shadow-2xl active:scale-95">
                    <div className="text-7xl mb-6 group-hover:scale-125 transition-transform duration-300">🔍</div>
                    <h2 className="text-3xl font-black uppercase tracking-tight">Buscar DNI</h2>
                    <p className="mt-2 text-sm font-bold opacity-60 uppercase tracking-widest">Encontrar Paciente</p>
                    <div className="absolute top-4 right-4 bg-zinc-100 dark:bg-zinc-800 text-[10px] font-black px-2 py-1 rounded-lg group-hover:bg-white/20">F1</div>
                </button>

                {/* Agenda Hoy */}
                <button className="group relative flex flex-col items-center justify-center p-12 bg-white dark:bg-zinc-900 border-4 border-zinc-200 dark:border-zinc-800 rounded-[40px] hover:border-emerald-500 hover:bg-emerald-500 hover:text-white transition-all duration-300 shadow-2xl active:scale-95">
                    <div className="text-7xl mb-6 group-hover:scale-125 transition-transform duration-300">📅</div>
                    <h2 className="text-3xl font-black uppercase tracking-tight">Agenda Hoy</h2>
                    <p className="mt-2 text-sm font-bold opacity-60 uppercase tracking-widest">Ver mis Turnos</p>
                    <div className="absolute top-4 right-4 bg-zinc-100 dark:bg-zinc-800 text-[10px] font-black px-2 py-1 rounded-lg group-hover:bg-white/20">F2</div>
                </button>

                {/* Pendientes */}
                <button className="group relative flex flex-col items-center justify-center p-12 bg-white dark:bg-zinc-900 border-4 border-zinc-200 dark:border-zinc-800 rounded-[40px] hover:border-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-2xl active:scale-95">
                    <div className="text-7xl mb-6 group-hover:scale-125 transition-transform duration-300">📥</div>
                    <h2 className="text-3xl font-black uppercase tracking-tight">Pendientes</h2>
                    <p className="mt-2 text-sm font-bold opacity-60 uppercase tracking-widest">Tareas Críticas</p>
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-red-600 border-4 border-white dark:border-zinc-950 text-white rounded-full flex items-center justify-center font-bold text-xl animate-bounce shadow-lg">5</div>
                    <div className="absolute top-4 right-4 bg-zinc-100 dark:bg-zinc-800 text-[10px] font-black px-2 py-1 rounded-lg group-hover:bg-white/20">F3</div>
                </button>
            </div>

            {/* Footer Instructions */}
            <div className="mt-16 text-center">
                <div className="inline-flex items-center gap-6 px-8 py-4 bg-zinc-100 dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700">
                    <p className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">Sugerencia:</p>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Presiona las teclas <kbd className="px-2 py-1 bg-white dark:bg-zinc-900 border rounded shadow-sm text-xs font-black">F1</kbd>, <kbd className="px-2 py-1 bg-white dark:bg-zinc-900 border rounded shadow-sm text-xs font-black">F2</kbd> o <kbd className="px-2 py-1 bg-white dark:bg-zinc-900 border rounded shadow-sm text-xs font-black">F3</kbd> para acceso rápido.</p>
                </div>
            </div>
        </div>
    );
}
