// Centralized constants for the application

// ===== COLORS =====
export const COLORS = {
    // Primary colors
    primary: '#ea580c',        // Orange
    primaryRGB: [234, 88, 12] as [number, number, number],
    primaryHex: 'EA580C',

    secondary: '#f97316',      // Lighter Orange
    secondaryRGB: [249, 115, 22] as [number, number, number],

    // Text colors
    text: {
        primary: '#1e293b',
        primaryRGB: [30, 41, 59] as [number, number, number],
        secondary: '#64748b',
        muted: '#94a3b8',
    },

    // Background colors
    bg: {
        primary: '#0f172a',
        secondary: '#1e293b',
        tertiary: '#334155',
    },

    // Utility colors
    lightGray: '#f1f5f9',
    lightGrayRGB: [241, 245, 249] as [number, number, number],
    lightGrayHex: 'F1F5F9',

    border: '#334155',
    white: '#ffffff',
    whiteRGB: [255, 255, 255] as [number, number, number],
} as const;

// ===== DOCUMENT LAYOUT =====
export const PDF_LAYOUT = {
    sidebar: {
        width: 25, // mm
        text: 'PLANEACION DEL TRABAJO',
    },
    margins: {
        left: 35,  // sidebarWidth + 10
        right: 15,
        top: 20,
        bottom: 15,
    },
    fonts: {
        title: 32,
        heading1: 22,
        heading2: 18,
        heading3: 16,
        body: 11,
        small: 9,
        tiny: 8,
    },
    lineWidth: {
        thin: 0.2,
        normal: 0.5,
        thick: 1,
    },
} as const;

export const DOCX_LAYOUT = {
    fonts: {
        title: 48,    // half-points
        heading1: 32,
        heading2: 28,
        heading3: 24,
        body: 22,
        small: 20,
    },
    spacing: {
        small: 100,
        medium: 200,
        large: 400,
        xlarge: 600,
    },
} as const;

// ===== SVG GENERATION =====
export const SVG_CONFIG = {
    canvas: {
        width: 800,
        height: 500,
    },
    scale: {
        targetFillPercentage: 0.9, // 90% of canvas
    },
    styles: {
        strokeWidth: 2,
        fontSize: 14,
        dimensionLineOffset: 30,
    },
    colors: {
        stroke: '#1e293b',
        fill: '#f1f5f9',
        dimension: '#ea580c',
        text: '#334155',
    },
} as const;

// ===== IMAGE PROCESSING =====
export const IMAGE_CONFIG = {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    acceptedFormats: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    acceptedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.pdf'],
    preview: {
        maxWidth: 400,
        maxHeight: 400,
    },
    conversion: {
        pngWidth: 1000,
        pngHeight: 1000,
        quality: 0.95,
    },
} as const;

// ===== VALIDATION =====
export const VALIDATION = {
    dimensions: {
        min: 1,      // cm
        max: 10000,  // cm
    },
    projectName: {
        minLength: 3,
        maxLength: 100,
    },
    description: {
        minLength: 10,
        maxLength: 500,
    },
    specifications: {
        maxLength: 1000,
    },
} as const;

// ===== UI TEXT =====
export const UI_TEXT = {
    errors: {
        imageSize: 'El archivo es demasiado grande. Tamaño máximo: 10MB',
        imageFormat: 'Formato no soportado. Use JPG, PNG, WEBP o PDF',
        dimensionMin: 'Las dimensiones deben ser mayores a 1 cm',
        dimensionMax: 'Las dimensiones no pueden exceder 10000 cm',
        projectNameShort: 'El nombre del proyecto debe tener al menos 3 caracteres',
        projectNameLong: 'El nombre del proyecto no puede exceder 100 caracteres',
        descriptionShort: 'La descripción debe tener al menos 10 caracteres',
        descriptionLong: 'La descripción no puede exceder 500 caracteres',
        noImages: 'Debe cargar al menos una imagen',
        apiError: 'Error al generar el manual. Por favor, intente nuevamente.',
    },
    loading: {
        analyzing: 'Analizando imágenes...',
        generating: 'Generando manual...',
        processing: 'Procesando componentes...',
        creating: 'Creando documentos...',
    },
    success: {
        generated: 'Manual generado exitosamente',
        downloaded: 'Archivo descargado',
    },
} as const;

// ===== ANIMATION DURATIONS =====
export const ANIMATION = {
    fast: 150,
    normal: 300,
    slow: 500,
} as const;
