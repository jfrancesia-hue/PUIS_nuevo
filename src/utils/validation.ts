/**
 * Normaliza un DNI agregando puntos cada 3 dígitos.
 * Ejemplo: 12345678 -> 12.345.678
 */
export const normalizeDNI = (val: string): string => {
    const digits = val.replace(/\D/g, "");
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

/**
 * Valida si un DNI tiene un formato válido (entre 7 y 8 dígitos antes de puntos).
 */
export const isValidDNI = (val: string): boolean => {
    const digits = val.replace(/\D/g, "");
    return digits.length >= 7 && digits.length <= 8;
};

/**
 * Normaliza una fecha en formato DD/MM/AAAA.
 */
export const normalizeDate = (val: string): string => {
    let digits = val.replace(/\D/g, "");
    if (digits.length > 8) digits = digits.substring(0, 8);

    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.substring(0, 2)}/${digits.substring(2)}`;
    return `${digits.substring(0, 2)}/${digits.substring(2, 4)}/${digits.substring(4)}`;
};

/**
 * Detecta si un registro es duplicado basado en una lista de existentes.
 */
export const checkDuplicate = (val: string, existing: string[]): boolean => {
    const cleanVal = val.replace(/\D/g, "");
    return existing.some(ext => ext.replace(/\D/g, "") === cleanVal);
};
