/**
 * Manejo de persistencia local para modo Offline.
 */

// Caché de fichas de pacientes (Límite 20)
export const updatePatientCache = (patientData: any) => {
    const cache = JSON.parse(localStorage.getItem("offline_patients") || "[]");
    const filtered = cache.filter((p: any) => p.dni !== patientData.dni);
    const updated = [patientData, ...filtered].slice(0, 20);
    localStorage.setItem("offline_patients", JSON.stringify(updated));
};

// Cola de acciones pendientes (Reclamos, Derivaciones)
export const queueOfflineAction = (action: { type: string; payload: any; timestamp: number }) => {
    const queue = JSON.parse(localStorage.getItem("offline_sync_queue") || "[]");
    queue.push(action);
    localStorage.setItem("offline_sync_queue", JSON.stringify(queue));
};

// Obtener conteo de pendientes para la UI
export const getPendingSyncCount = (): number => {
    const queue = JSON.parse(localStorage.getItem("offline_sync_queue") || "[]");
    return queue.length;
};

// Simulación de reintento de sincronización
export const syncOfflineActions = async () => {
    const queue = JSON.parse(localStorage.getItem("offline_sync_queue") || "[]");
    if (queue.length === 0) return;

    console.log(`Sincronizando ${queue.length} acciones...`);
    // Aquí iría la lógica real de API
    localStorage.setItem("offline_sync_queue", "[]");
    return true;
};
