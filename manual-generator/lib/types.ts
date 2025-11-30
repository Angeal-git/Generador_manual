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
    foldPath?: string; // Path SVG para líneas de pliegue (d attribute)
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

export interface MaterialOptimization {
    material: string; // e.g., "MDF 15mm"
    boardSize: string; // e.g., "244x122 cm"
    components: string[]; // Component IDs using this material
    efficiency: number; // Percentage of material used (0-100)
    suggestions: string[]; // Cutting layout suggestions
}

export interface AssemblyStep {
    step: number;
    description: string;
    components: string[]; // Component IDs involved
    estimatedTime: string; // e.g., "30 minutos"
    tools: string[]; // Required tools
    warnings: string[]; // Safety warnings
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
    optimizacionMateriales?: MaterialOptimization[];
    secuenciaEnsamblaje?: AssemblyStep[];
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

// Database-related types
export interface CostBreakdown {
    materiales: MaterialCost[];
    consumibles: ConsumableCost[];
    manoDeObra: LaborCost;
    total: number;
}

export interface MaterialCost {
    materialId: string;
    nombre: string;
    cantidad: number;
    unidad: string;
    precioUnitario: number;
    subtotal: number;
}

export interface ConsumableCost {
    consumableId: string;
    nombre: string;
    cantidad: number;
    unidad: string;
    precioUnitario: number;
    subtotal: number;
}

export interface LaborCost {
    horasEstimadas: number;
    costoPorHora: number;
    subtotal: number;
}

export interface SavedProject {
    id: string;
    nombre: string;
    descripcion?: string;
    dimensiones: ProjectDimensions;
    costoTotal: number;
    createdAt: string;
    updatedAt: string;
}
