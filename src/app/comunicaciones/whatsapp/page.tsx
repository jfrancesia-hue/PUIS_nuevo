export default function WhatsAppPanel() {
    const templates = [
        {
            id: 1,
            label: "Confirmación de Turno",
            message: "Hola [PACIENTE], te confirmamos tu turno para el día [FECHA] a las [HORA] en [CENTRO]. Por favor, presentarse 15 min antes con DNI.",
            icon: "📅"
        },
        {
            id: 2,
            label: "Falta Documentación",
            message: "Hola [PACIENTE], para completar tu trámite [TRAMITE] necesitamos que envíes una foto de [DOCUMENTO]. Gracias.",
            icon: "📄"
        },
        {
            id: 3,
            label: "Reclamo en Proceso",
            message: "Estimado/a [PACIENTE], le informamos que su reclamo #[ID_RECLAMO] ya se encuentra en proceso de resolución por el equipo de [AREA].",
            icon: "📢"
        },
        {
            id: 4,
            label: "Presentarse en Centro",
            message: "Hola [PACIENTE], se requiere su presencia en el centro [CENTRO] de manera urgente para [MOTIVO].",
            icon: "🏥"
        }
    ];

    const patientData = {
        name: "Ana García",
        phone: "3834556677",
        date: "31 Ene",
        time: "09:30",
        center: "Hospital San Juan",
        area: "Cardiología"
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <section className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500 flex items-center justify-center text-3xl shadow-lg border-4 border-white dark:border-zinc-900">
                    💬
                </div>
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 font-outfit">
                        Panel de Comunicación <span className="text-emerald-500">WhatsApp</span>
                    </h1>
                    <p className="text-zinc-500 font-medium">Envío masivo de notificaciones mediante plantillas inteligentes.</p>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Template List */}
                <div className="lg:col-span-1 space-y-4">
                    <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] px-2">Seleccionar Plantilla</h3>
                    <div className="space-y-2">
                        {templates.map((t) => (
                            <button key={t.id} className={`w-full text-left p-4 rounded-2xl border bg-white dark:bg-zinc-900/50 hover:border-emerald-500 hover:bg-emerald-500/5 transition-all group ${t.id === 1 ? 'border-emerald-500 bg-emerald-500/5' : ''}`}>
                                <div className="flex items-center gap-3">
                                    <span className="text-xl group-hover:scale-110 transition-transform">{t.icon}</span>
                                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50">{t.label}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Editor & Preview */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="p-8 rounded-[32px] border bg-white dark:bg-zinc-900/50 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest">Vista Previa Real</span>
                        </div>

                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6">Mensaje Autocompletado</h3>

                        <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border-2 border-dashed border-zinc-200 dark:border-zinc-700 min-h-[160px]">
                            <p className="text-lg font-medium leading-relaxed text-zinc-800 dark:text-zinc-200">
                                Hola <span className="text-emerald-600 dark:text-emerald-400 font-bold underline decoration-2 underline-offset-4">{patientData.name}</span>, te confirmamos tu turno para el día <span className="text-emerald-600 dark:text-emerald-400 font-bold underline decoration-2 underline-offset-4">{patientData.date}</span> a las <span className="text-emerald-600 dark:text-emerald-400 font-bold underline decoration-2 underline-offset-4">{patientData.time}</span> en <span className="text-emerald-600 dark:text-emerald-400 font-bold underline decoration-2 underline-offset-4">{patientData.center}</span>. Por favor, presentarse 15 min antes con DNI.
                            </p>
                        </div>

                        <div className="mt-8 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-zinc-500 font-bold">Destinatario:</p>
                                <p className="text-sm font-black text-zinc-900 dark:text-zinc-50">+{patientData.phone}</p>
                            </div>
                            <a
                                href={`https://wa.me/${patientData.phone}?text=Confirmación de turno para Ana Garcia`}
                                target="_blank"
                                className="flex items-center gap-2 bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-tighter text-sm hover:bg-emerald-600 hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                            >
                                <span>🚀 ENVIAR A WHATSAPP</span>
                            </a>
                        </div>
                    </div>

                    {/* Quick Tips */}
                    <div className="p-6 rounded-2xl bg-zinc-900 text-white flex items-center gap-6">
                        <div className="text-3xl opacity-50">💡</div>
                        <div>
                            <p className="text-sm font-bold opacity-90 leading-tight">No necesitas copiar y pegar contenido.</p>
                            <p className="text-xs opacity-60 mt-1">Al presionar enviar, se abrirá WhatsApp Web o la App con el mensaje listo para ser enviado al número del paciente.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
