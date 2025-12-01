import { MATERIALS_INFO, MaterialInfo } from './materialsCatalog';

// Interfaces para el cálculo de costos
export interface MaterialCost {
    nombre: string;
    cantidadRequerida: number;
    unidadMedida: string;
    unidadesNecesarias: number;
    unidadVenta: string;
    precioPorUnidad: number;
    costoTotal: number;
}

export interface CostBreakdown {
    materiales: MaterialCost[];
    total: number;
}

export interface Component {
    material: string;
    cantidad: number;
}

/**
 * Calcula cuántas unidades de venta se necesitan comprar
 * Redondea hacia arriba para asegurar que se tenga suficiente material
 */
export function calculateUnitsNeeded(
    cantidadRequerida: number,
    cantidadPorUnidad: number
): number {
    return Math.ceil(cantidadRequerida / cantidadPorUnidad);
}

/**
 * Calcula el costo de un material específico
 */
export function calculateMaterialCost(
    materialName: string,
    cantidadRequerida: number
): MaterialCost {
    const info = MATERIALS_INFO[materialName];

    if (!info) {
        throw new Error(`Material no encontrado en el catálogo: ${materialName}`);
    }

    const unidadesNecesarias = calculateUnitsNeeded(
        cantidadRequerida,
        info.cantidadPorUnidad
    );

    return {
        nombre: materialName,
        cantidadRequerida,
        unidadMedida: info.unidadMedida,
        unidadesNecesarias,
        unidadVenta: info.unidadVenta,
        precioPorUnidad: info.precioPorUnidad,
        costoTotal: unidadesNecesarias * info.precioPorUnidad
    };
}

/**
 * Calcula el costo total de un proyecto basado en sus componentes
 */
export function calculateProjectCost(components: Component[]): CostBreakdown {
    const materialCosts = components.map(comp =>
        calculateMaterialCost(comp.material, comp.cantidad)
    );

    const total = materialCosts.reduce((sum, cost) =>
        sum + cost.costoTotal, 0
    );

    return {
        materiales: materialCosts,
        total
    };
}

/**
 * Formatea un número como moneda MXN
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(amount);
}

/**
 * Obtiene información de un material del catálogo
 */
export function getMaterialInfo(materialName: string): MaterialInfo | undefined {
    return MATERIALS_INFO[materialName];
}
