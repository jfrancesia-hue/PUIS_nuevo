"use client";

import { useState, useEffect, useRef } from "react";

export default function AsistenteIA() {
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hola, soy el Asistente Fiscal IA del Ministerio de Salud. ¿En qué puedo ayudarte con la gestión hoy?", time: "12:40" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const alerts = [
        {
            id: 1,
            type: "Riesgo Epidemiológico",
            center: "Hospital Niños Eva Perón",
            reason: "↑ 25% Consultas Respiratorias + Baja temperatura prevista (-2°C)",
            prediction: "Brote Bronquiolitis inminente: Necesidad de 15 camas adicionales en 72hs.",
            status: "critical"
        },
        {
            id: 2,
            type: "Falla Logística Central",
            center: "Depósito Provincial Insumos",
            reason: "Demora en arribo de camión frío (Vacunas) por corte en Ruta 38.",
            prediction: "Riesgo de pérdida de cadena de frío en 6hs si no hay back-up.",
            status: "critical"
        }
    ];

    const queries = [
        "¿Cuál es el centro con mayor mora en derivaciones?",
        "¿Qué zona presenta el mayor índice de ausentismo médico?",
        "Predecir requerimientos de oxígeno para el próximo fin de semana.",
        "Identificar cuellos de botella en la entrega de turnos por especialidad."
    ];

    const handleSend = (text: string) => {
        if (!text.trim()) return;
        const newMsg = { role: "user", content: text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setMessages([...messages, newMsg]);
        setInput("");
        setIsTyping(true);

        setTimeout(() => {
            const responses: Record<string, string> = {
                "oxigeno": "Según la tendencia de ocupación en el Hospital San Juan y Niños, se prevé un consumo de 450m3 extra para este fin de semana. Sugiero validar stock en planta central.",
                "derivaciones": "El Hospital de Belén presenta la mayor mora (promedio 4.5hs). El 60% son derivaciones a Capital por falta de anestesista de guardia.",
                "defecto": "Analizando la base de datos de SIGESA Pro... He detectado un patrón de optimización en el Área Programática 2. ¿Deseas ver el informe detallado?"
            };

            const responseKey = Object.keys(responses).find(k => text.toLowerCase().includes(k)) || "defecto";
            const botMsg = { role: "assistant", content: responses[responseKey], time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-fade-in py-10 font-outfit">
            {/* AI Assistant Institutional Header */}
            <section className="flex flex-col lg:flex-row items-center gap-10 p-12 rounded-[56px] bg-gradient-to-br from-[#002b49] via-[#00477a] to-[#0067b1] text-white shadow-3xl relative overflow-hidden border-8 border-white/10">
                <div className="relative z-10 space-y-6 flex-1">
                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/10 border-2 border-white/20 text-white text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
                        Inteligencia Administrativa • Nodo Catamarca
                    </div>
                    <h1 className="text-6xl font-black tracking-tighter leading-tight italic">
                        ASISTENTE <span className="text-[#f9b000]">FISCAL IA</span>
                    </h1>
                    <p className="text-sky-100/80 font-bold text-xl leading-relaxed max-w-2xl">
                        Motor de predicción sanitaria: Análisis neuro-operativo para anticipar flujos de red y optimizar la respuesta ministerial de Catamarca.
                    </p>
                </div>
                <div className="w-48 h-48 rounded-[48px] bg-white/5 flex items-center justify-center shadow-2xl border-4 border-white/10 relative z-10 animate-float overflow-hidden group">
                    <div className="absolute inset-0 bg-sky-400 opacity-20 blur-2xl group-hover:opacity-40 transition-opacity"></div>
                    <span className="text-7xl relative z-10">🤖</span>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-sky-400/10 rounded-full blur-[120px]" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] -mr-48 -mt-48" />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Chat Interface */}
                <div className="lg:col-span-2 flex flex-col h-[700px] p-10 rounded-[64px] bg-white border-4 border-zinc-50 shadow-2xl">
                    <div className="flex items-center justify-between mb-8 border-b-2 border-dashed border-zinc-50 pb-6">
                        <h3 className="text-xl font-black text-zinc-900 tracking-tighter flex items-center gap-4 uppercase">
                            <span className="w-3 h-8 bg-[#0067b1] rounded-full"></span> Consola de Consulta
                        </h3>
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">Cifrado AES-256 Activo</span>
                    </div>

                    <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 px-2 mb-8 custom-scrollbar">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in-top`}>
                                <div className={`max-w-[80%] p-6 rounded-[32px] shadow-lg ${m.role === 'user' ? 'bg-[#002b49] text-white rounded-tr-none' : 'bg-zinc-50 border-2 border-zinc-50 text-zinc-900 rounded-tl-none'}`}>
                                    <p className="text-sm font-bold leading-relaxed">{m.content}</p>
                                    <p className={`text-[8px] font-black mt-3 uppercase tracking-widest ${m.role === 'user' ? 'text-white/40' : 'text-zinc-400'}`}>{m.time}</p>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start animate-pulse">
                                <div className="p-6 rounded-[32px] bg-zinc-50 border-2 border-zinc-50 flex gap-2">
                                    <div className="w-2 h-2 bg-zinc-400 rounded-full"></div>
                                    <div className="w-2 h-2 bg-zinc-400 rounded-full"></div>
                                    <div className="w-2 h-2 bg-zinc-400 rounded-full"></div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="flex flex-wrap gap-3">
                            {queries.map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSend(q)}
                                    className="px-6 py-3 rounded-2xl border-2 border-zinc-50 bg-zinc-50 hover:bg-white hover:border-[#0067b1] hover:shadow-xl transition-all text-[9px] font-black text-zinc-400 hover:text-[#0067b1] uppercase tracking-widest"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                        <div className="relative group">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
                                placeholder="Escribe aquí tu consulta de gestión..."
                                className="w-full pl-10 pr-20 py-6 rounded-[32px] bg-zinc-50 border-4 border-transparent focus:bg-white focus:border-[#0067b1] outline-none font-bold transition-all text-zinc-900 shadow-inner"
                            />
                            <button
                                onClick={() => handleSend(input)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 px-8 py-3.5 rounded-[22px] bg-[#0067b1] text-white font-black text-xs uppercase tracking-widest shadow-xl hover:bg-[#002b49] transition-all"
                            >
                                Enviar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Side Panels */}
                <div className="space-y-8">
                    {/* Insights */}
                    <div className="p-10 rounded-[56px] border-4 border-[#0067b1]/10 bg-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#0067b1]/5 rounded-full -mt-10 -mr-10 group-hover:scale-150 transition-transform" />
                        <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.3em] mb-8">Estrategia Semanal</h3>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-2xl border border-emerald-100">📈</div>
                                <div>
                                    <p className="text-xs font-black text-zinc-900 uppercase tracking-widest">Optimización</p>
                                    <p className="text-xs font-bold text-zinc-500 italic mt-1 leading-relaxed">Reforzar CAPS Zona Norte los días Martes para triaje preventivo.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center text-2xl border border-sky-100">🛰️</div>
                                <div>
                                    <p className="text-xs font-black text-zinc-900 uppercase tracking-widest">Digitalización</p>
                                    <p className="text-xs font-bold text-zinc-500 italic mt-1 leading-relaxed">Avance 92% en firma digital para auditoría SAMIC.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Radar de Riesgo */}
                    <div className="p-10 rounded-[56px] bg-[#002b49] text-white shadow-2xl space-y-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-sky-400">🚨 Radar Predictivo</h3>
                        <div className="space-y-6">
                            {alerts.map((alert) => (
                                <div key={alert.id} className="p-6 rounded-[32px] bg-white/5 border-2 border-white/10 space-y-4 hover:bg-white/10 transition-all cursor-pointer">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[8px] font-black uppercase bg-red-600 px-3 py-1 rounded-full">ALERTA CRÍTICA</span>
                                        <span className="text-[9px] font-black text-white/40">AHORA</span>
                                    </div>
                                    <h4 className="font-black text-lg tracking-tight leading-none">{alert.center}</h4>
                                    <div className="p-4 rounded-2xl bg-[#f9b000] text-[#002b49] font-black text-[10px] leading-relaxed uppercase tracking-widest">
                                        "{alert.prediction}"
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full py-5 rounded-[24px] border-2 border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-[#002b49] transition-all">Reporte Completo IA</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
