"use client";

import { useState, useEffect } from "react";
import {
    Bot,
    User,
    Send,
    Sparkles,
    Brain,
    Stethoscope,
    History,
    Activity,
    LineChart,
    ChevronRight,
    Heart
} from "lucide-react";

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function AsistenteIA() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hola. Soy el Asistente Clínico del Ministerio. ¿En qué puedo ayudarle hoy?' }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [view, setView] = useState('chat') // 'chat' | 'predictions'

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return

        const userMsg: Message = { role: 'user', content: input }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setLoading(true)

        try {
            const res = await fetch('/api/asistente/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input })
            })
            const data = await res.json()
            if (data.ok) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
            }
        } catch (error) {
            console.error('Chat error:', error)
        } finally {
            setLoading(false)
        }
    }

    const predictions = [
        { title: 'Riesgo Cardiovascular', value: 'Bajo', trend: 'estable', icon: <Heart className="w-5 h-5 text-red-500" /> },
        { title: 'Probabilidad Internación', value: '15%', trend: 'descenso', icon: <Stethoscope className="w-5 h-5 text-blue-500" /> },
        { title: 'Cumplimiento Terapéutico', value: '92%', trend: 'ascenso', icon: <Activity className="w-5 h-5 text-emerald-500" /> }
    ]

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 font-outfit h-[calc(100vh-120px)] flex flex-col">
            {/* Nav Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100/50 rounded-2xl self-start mb-2 border border-slate-200/60 shadow-inner">
                <button
                    onClick={() => setView('chat')}
                    className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${view === 'chat'
                        ? 'bg-white text-brand-navy shadow-md'
                        : 'text-slate-400 hover:text-brand-navy'}`}
                >
                    <Bot className="w-3.5 h-3.5" />
                    Asistente Clínico
                </button>
                <button
                    onClick={() => setView('predictions')}
                    className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${view === 'predictions'
                        ? 'bg-white text-brand-navy shadow-md'
                        : 'text-slate-400 hover:text-brand-navy'}`}
                >
                    <Brain className="w-3.5 h-3.5" />
                    Análisis Predictivo
                </button>
            </div>

            {view === 'chat' ? (
                <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                    <div className="flex-1 admin-card bg-white border-slate-200 overflow-y-auto p-8 space-y-8 scrollbar-thin">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
                            >
                                <div className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${msg.role === 'user'
                                        ? 'bg-slate-50 border-slate-200 text-brand-navy'
                                        : 'bg-brand-navy border-brand-navy/10 text-white shadow-lg shadow-brand-navy/20'
                                        }`}>
                                        {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                    </div>
                                    <div className={`p-5 rounded-3xl text-sm font-bold shadow-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-slate-50 border border-slate-200 text-brand-navy rounded-tr-none'
                                        : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start animate-pulse">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center">
                                        <Bot className="w-5 h-5 text-slate-300" />
                                    </div>
                                    <div className="bg-slate-50 h-12 w-32 rounded-3xl rounded-tl-none border border-slate-100" />
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSendMessage} className="relative admin-card p-3 bg-white border-slate-200 shadow-xl shadow-slate-100">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Consultar sobre protocolos, patologías o historial..."
                            className="w-full pl-6 pr-40 py-5 bg-slate-50 border-2 border-slate-100 rounded-[24px] text-sm font-black text-brand-navy placeholder:text-slate-300 focus:border-brand-navy/20 focus:ring-8 focus:ring-brand-navy/5 outline-none transition-all"
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mr-2 group-focus-within:opacity-100 opacity-0 transition-opacity italic">Presione ENTER para enviar</span>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-brand-navy text-white p-3.5 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-navy/20"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto pr-2">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="admin-card bg-white border-slate-200 p-8 space-y-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-black text-brand-navy uppercase tracking-tight">Dashboard Clínico</h2>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">IA Engine v4.2 - Última actualización: hace 5 min</p>
                                </div>
                                <Sparkles className="w-6 h-6 text-brand-accent animate-pulse" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {predictions.map((pred, i) => (
                                    <div key={i} className="p-6 bg-slate-50 rounded-[28px] border border-slate-100 flex flex-col items-center text-center gap-3 group hover:bg-white hover:border-brand-navy/20 transition-all duration-300">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-brand-navy group-hover:scale-110 transition-transform">
                                            {pred.icon}
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{pred.title}</p>
                                            <p className="text-xl font-black text-brand-navy uppercase tracking-tight">{pred.value}</p>
                                        </div>
                                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${pred.trend === 'ascenso' ? 'bg-emerald-100 text-emerald-600' :
                                            pred.trend === 'descenso' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-600'
                                            }`}>
                                            {pred.trend}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                    <LineChart className="w-3 h-3" />
                                    Tendencias de Salud Poblacional
                                </h3>
                                <div className="h-64 bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-100 flex items-center justify-center relative group">
                                    <Activity className="w-12 h-12 text-slate-200 absolute group-hover:scale-150 group-hover:opacity-0 transition-all duration-700" />
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-brand-navy transition-colors">Visualización de Datos Médicos en tiempo real</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="admin-card bg-brand-navy text-white p-8 space-y-6">
                            <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-3">
                                <Brain className="w-6 h-6 text-brand-accent" />
                                Insights Recomendados
                            </h3>
                            <div className="space-y-4">
                                {[
                                    'Incremento del 12% en derivaciones dermatológicas',
                                    'Patrón de reincidencia en pacientes crónicos identificado',
                                    'Oportunidad de optimización en triaje de guardia'
                                ].map((insight, i) => (
                                    <div key={i} className="flex gap-4 items-start group">
                                        <div className="w-2 h-2 rounded-full bg-brand-accent mt-2 group-hover:scale-150 transition-transform" />
                                        <p className="text-[11px] font-bold opacity-80 leading-relaxed group-hover:opacity-100 transition-opacity italic">{insight}</p>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                                Exportar Reporte AI
                            </button>
                        </div>

                        <div className="admin-card bg-white border-slate-200 p-8">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <History className="w-3.5 h-3.5" />
                                Últimas Consultas
                            </h3>
                            <div className="space-y-4">
                                {['Análisis de riesgo cardíaco', 'Protocolo dengue 2026', 'Resumen casos Guardia Central'].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-brand-navy/20 cursor-pointer group transition-all">
                                        <span className="text-[10px] font-black text-brand-navy uppercase tracking-tight">{item}</span>
                                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-navy transition-all" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
