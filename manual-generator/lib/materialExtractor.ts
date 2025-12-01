import { MATERIALS_INFO } from './materialsCatalog';
import { Component as CostComponent, calculateProjectCost, CostBreakdown } from './costCalculator';

interface MaterialSuggestion {
    original: string;
    suggested: string;
    reason: string;
}

/**
 * Extrae materiales directamente de los componentes del manual
 * SIN usar IA adicional - solo mapea los materiales existentes
 */
export function extractMaterialsFromComponents(
    components: any[],
    consumables: any[] = []
): { materials: CostComponent[], suggestions: MaterialSuggestion[] } {
    const materialsMap = new Map<string, number>();
    const suggestions: MaterialSuggestion[] = [];

    // Procesar componentes
    components.forEach(comp => {
        if (!comp.material) return;

        const materialType = comp.material.tipo || '';
        const cantidad = comp.material.cantidad || 0;

        // Buscar el material más cercano en el catálogo
        const result = findClosestMaterial(materialType);

        if (result.found) {
            const existing = materialsMap.get(result.material!) || 0;
            materialsMap.set(result.material!, existing + cantidad);
        } else if (result.suggestion) {
            // Agregar sugerencia
            suggestions.push({
                original: materialType,
                suggested: result.suggestion,
                reason: result.reason || 'Material similar disponible en catálogo'
            });
            // Usar el material sugerido
            const existing = materialsMap.get(result.suggestion) || 0;
            materialsMap.set(result.suggestion, existing + cantidad);
        }
    });

    // Procesar consumibles
    consumables.forEach(cons => {
        if (!cons.nombre) return;

        const cantidad = cons.cantidad || 0;
        const result = findClosestMaterial(cons.nombre);

        if (result.found) {
            const existing = materialsMap.get(result.material!) || 0;
            materialsMap.set(result.material!, existing + cantidad);
        } else if (result.suggestion) {
            suggestions.push({
                original: cons.nombre,
                suggested: result.suggestion,
                reason: result.reason || 'Consumible similar disponible en catálogo'
            });
            const existing = materialsMap.get(result.suggestion) || 0;
            materialsMap.set(result.suggestion, existing + cantidad);
        }
    });

    // Convertir el mapa a array de componentes
    const materials = Array.from(materialsMap.entries()).map(([material, cantidad]) => ({
        material,
        cantidad
    }));

    return { materials, suggestions };
}

/**
 * Encuentra el material más cercano en el catálogo
 */
function findClosestMaterial(materialType: string): {
    found: boolean,
    material?: string,
    suggestion?: string,
    reason?: string
} {
    const normalized = materialType.toLowerCase().trim();

    // Buscar coincidencia exacta primero
    for (const catalogMaterial of Object.keys(MATERIALS_INFO)) {
        if (catalogMaterial.toLowerCase() === normalized) {
            return { found: true, material: catalogMaterial };
        }
    }

    // Buscar coincidencia parcial
    for (const catalogMaterial of Object.keys(MATERIALS_INFO)) {
        const catalogNormalized = catalogMaterial.toLowerCase();

        if (normalized.includes(catalogNormalized) || catalogNormalized.includes(normalized)) {
            return { found: true, material: catalogMaterial };
        }
    }

    // Mapeo manual para casos comunes con sugerencias
    const mappings: { [key: string]: { material: string, reason: string } } = {
        'mdf': { material: 'MDF 15mm', reason: 'Espesor estándar más común' },
        'madera': { material: 'MDF 15mm', reason: 'Material base recomendado' },
        'triplay': { material: 'Triplay 12mm', reason: 'Espesor estándar' },
        'melamina': { material: 'Melamina Blanca 18mm', reason: 'Color y espesor más común' },
        'aluminio': { material: 'Aluminio Perfil 1"', reason: 'Perfil estándar' },
        'acero': { material: 'Tubo Cuadrado 1"', reason: 'Medida estándar' },
        'acrilico': { material: 'Acrílico Transparente 3mm', reason: 'Espesor más usado para displays' },
        'acrílico': { material: 'Acrílico Transparente 3mm', reason: 'Espesor más usado para displays' },
        'vidrio': { material: 'Cristal Templado 6mm', reason: 'Espesor de seguridad' },
        'led': { material: 'Tira LED RGB 5m', reason: 'Rollo estándar' },
        'pintura': { material: 'Pintura Vinílica Blanca', reason: 'Base más común' },
        'barniz': { material: 'Barniz Poliuretano', reason: 'Acabado profesional' },
        'pegamento': { material: 'Pegamento Blanco 1L', reason: 'Uso general' },
        'tornillo': { material: 'Tornillo Madera 1" (100 pzas)', reason: 'Medida estándar para MDF' },
        'bisagra': { material: 'Bisagra Piano 1.5m', reason: 'Longitud estándar' },
        'varilla': { material: 'Acrílico Transparente 3mm', reason: 'Puede cortarse de lámina' },
        'tira': { material: 'Tira LED RGB 5m', reason: 'Iluminación estándar' }
    };

    // Buscar en el mapeo
    for (const [key, value] of Object.entries(mappings)) {
        if (normalized.includes(key)) {
            return {
                found: false,
                suggestion: value.material,
                reason: value.reason
            };
        }
    }

    console.warn(`Material no encontrado en catálogo: ${materialType}`);
    return { found: false };
}

/**
 * Calcula costos del proyecto SIN usar IA
 */
export function calculateCostsFromManual(manual: any): {
    costs: CostBreakdown | null,
    suggestions: MaterialSuggestion[]
} {
    try {
        if (!manual.componentes || manual.componentes.length === 0) {
            return { costs: null, suggestions: [] };
        }

        const { materials, suggestions } = extractMaterialsFromComponents(
            manual.componentes,
            manual.consumibles || []
        );

        if (materials.length === 0) {
            console.warn('No se pudieron mapear materiales del manual al catálogo');
            return { costs: null, suggestions };
        }

        const costs = calculateProjectCost(materials);
        return { costs, suggestions };
    } catch (error) {
        console.error('Error al calcular costos:', error);
        return { costs: null, suggestions: [] };
    }
}

/**
 * Genera resumen de costos en texto
 */
export function generateCostSummary(
    materiales: Array<{
        nombre: string;
        cantidadRequerida: number;
        unidadesNecesarias: number;
        unidadVenta: string;
        costoTotal: number;
    }>,
    total: number,
    suggestions: MaterialSuggestion[] = []
): string {
    let summary = '\n## 💰 COSTOS DE PRODUCCIÓN\n\n';

    // Agregar sugerencias si existen
    if (suggestions.length > 0) {
        summary += '### ⚠️ Sugerencias de Materiales:\n\n';
        suggestions.forEach(sug => {
            summary += `- **${sug.original}** → Sugerido: **${sug.suggested}** (${sug.reason})\n`;
        });
        summary += '\n';
    }

    summary += '### Materiales Necesarios:\n\n';

    materiales.forEach(mat => {
        summary += `- **${mat.nombre}**: ${mat.cantidadRequerida.toFixed(2)} (${mat.unidadesNecesarias} ${mat.unidadVenta}${mat.unidadesNecesarias > 1 ? 's' : ''}) - $${mat.costoTotal.toFixed(2)} MXN\n`;
    });

    summary += `\n### **COSTO TOTAL: $${total.toFixed(2)} MXN**\n`;
    summary += '\n*Nota: Los precios son estimados y pueden variar según el proveedor.*\n';

    return summary;
}
