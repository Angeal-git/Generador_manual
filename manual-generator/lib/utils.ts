// Utility functions for the Production Manual Generator

export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}

export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export async function fileToBase64(file: File): Promise<string> {
    // Convert File to ArrayBuffer, then to Buffer, then to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    return base64;
}

export function getMimeType(file: File): string {
    const extension = file.name.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'webp': 'image/webp',
        'pdf': 'application/pdf',
    };
    return mimeTypes[extension || ''] || file.type || 'image/jpeg';
}

export function formatDimension(value: number, unit: string = 'cm'): string {
    return `${value.toFixed(2)} ${unit}`;
}

export function calculateArea(largo: number, ancho: number): number {
    return (largo * ancho) / 10000; // Convert cm² to m²
}

export function calculateVolume(largo: number, ancho: number, alto: number): number {
    return (largo * ancho * alto) / 1000000; // Convert cm³ to m³
}
