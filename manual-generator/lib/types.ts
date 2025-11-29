// Types for the Production Manual Generator

export interface ProjectDimensions {
    frente: number; // cm
    fondo: number; // cm
    altura: number; // cm
}

export interface Component {
    id: string;
    nombre: string;
    descripcion: string;
    dimensiones: {
        largo?: number;
        ancho?: number;
        alto?: number;
        diametro?: number;
        espesor?: number;
        unidad: 'cm' | 'mm' | 'm';
        forma?: 'rectangulo' | 'circulo' | 'triangulo' | 'L' | 'irregular';
    };
    svgPath?: string; // Path SVG simplificado para formas irregulares (d attribute)
    material: {
        tipo: string;
        especificaciones: string;
        cantidad: number;
        unidadCantidad: string; // e.g., "m²", "piezas", "metros lineales"
    };
    proceso: string[]; // e.g., ["Corte CNC", "Pintura", "Ensamblaje"]
    notas: string;
    requiereArchivo: boolean; // Si necesita archivo SVG/vectorial
    archivoUrl?: string; // URL del SVG generado
}

export interface Consumable {
    id: string;
    nombre: string;
    tipo: 'iluminacion' | 'pintura' | 'adhesivo' | 'tornilleria' | 'otro';
    cantidad: number;
    unidad: string;
    especificaciones: string;
}

export interface ProductionManual {
    proyecto: {
        nombre: string;
        dimensionesGenerales: ProjectDimensions;
        descripcion: string;
    };
    componentes: Component[];
    consumibles: Consumable[];
    secuenciaEnsamblaje?: string[];
    notasGenerales: string[];
    fechaGeneracion: string;
}

export interface FormInputs {
    imagen: File | null;
    dimensiones: ProjectDimensions;
    especificaciones: string;
}

export interface ApiResponse {
    success: boolean;
    manual?: ProductionManual;
    error?: string;
}
