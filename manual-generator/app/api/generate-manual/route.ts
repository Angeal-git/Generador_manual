// API Route: Generate Production Manual
// POST /api/generate-manual

import { NextRequest, NextResponse } from 'next/server';
import { analyzeRenderWithGemini } from '@/lib/gemini';
import { generateSVG } from '@/lib/svg-generator';
import { fileToBase64, getMimeType, generateId, formatDate } from '@/lib/utils';
import { ProductionManual, Component } from '@/lib/types';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        // Extract form data
        const imageCount = parseInt(formData.get('imageCount') as string || '0');
        const imageFiles: File[] = [];

        // Extract all images
        for (let i = 0; i < imageCount; i++) {
            const imageFile = formData.get(`imagen_${i}`) as File;
            if (imageFile) {
                imageFiles.push(imageFile);
            }
        }

        const frente = parseFloat(formData.get('frente') as string);
        const fondo = parseFloat(formData.get('fondo') as string);
        const altura = parseFloat(formData.get('altura') as string);
        const especificaciones = formData.get('especificaciones') as string;

        // Validate inputs
        if (imageFiles.length === 0) {
            return NextResponse.json(
                { success: false, error: 'No se proporcionaron imágenes' },
                { status: 400 }
            );
        }

        if (!frente || !fondo || !altura) {
            return NextResponse.json(
                { success: false, error: 'Dimensiones incompletas' },
                { status: 400 }
            );
        }

        if (!especificaciones || especificaciones.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: 'Especificaciones requeridas' },
                { status: 400 }
            );
        }

        // Convert images to base64
        const imagesData = await Promise.all(
            imageFiles.map(async (file) => ({
                base64: await fileToBase64(file),
                mimeType: getMimeType(file),
            }))
        );

        console.log(`Processing request with Gemini (${imageFiles.length} images)...`);

        // Call Gemini AI
        const aiResponse = await analyzeRenderWithGemini(
            imagesData,
            { frente, fondo, altura },
            especificaciones
        );

        console.log('Gemini response received');

        // Add IDs to components if not present
        if (aiResponse.componentes) {
            aiResponse.componentes = aiResponse.componentes.map((comp: any) => ({
                ...comp,
                id: comp.id || generateId(),
            }));
        }

        // Add IDs to consumables if not present
        if (aiResponse.consumibles) {
            aiResponse.consumibles = aiResponse.consumibles.map((cons: any) => ({
                ...cons,
                id: cons.id || generateId(),
            }));
        }

        // Sanitize components to ensure strict type compliance
        if (aiResponse.componentes && Array.isArray(aiResponse.componentes)) {
            aiResponse.componentes = aiResponse.componentes.map((comp: any) => {
                // Helper to safely convert to string
                const safeString = (val: any) => {
                    if (typeof val === 'string') return val;
                    if (typeof val === 'number') return String(val);
                    if (typeof val === 'object' && val !== null) return Object.values(val).join(' - ');
                    return '';
                };

                return {
                    ...comp,
                    nombre: safeString(comp.nombre),
                    descripcion: safeString(comp.descripcion),
                    dimensiones: {
                        ...comp.dimensiones,
                        forma: safeString(comp.dimensiones?.forma) || 'rectangulo',
                    },
                    svgPath: safeString(comp.svgPath),
                    foldPath: safeString(comp.foldPath),
                    material: {
                        ...comp.material,
                        tipo: safeString(comp.material?.tipo),
                        especificaciones: safeString(comp.material?.especificaciones),
                        unidadCantidad: safeString(comp.material?.unidadCantidad),
                    },
                    proceso: Array.isArray(comp.proceso) ? comp.proceso.map(safeString) :
                        (typeof comp.proceso === 'string' ? [comp.proceso] : []),
                    notas: safeString(comp.notas),
                };
            });
        }

        // Sanitize consumibles to ensure strict type compliance
        if (aiResponse.consumibles && Array.isArray(aiResponse.consumibles)) {
            aiResponse.consumibles = aiResponse.consumibles.map((cons: any) => {
                // Helper to safely convert to string
                const safeString = (val: any) => {
                    if (typeof val === 'string') return val;
                    if (typeof val === 'number') return String(val);
                    if (typeof val === 'object' && val !== null) return Object.values(val).join(' - ');
                    return '';
                };

                return {
                    ...cons,
                    nombre: safeString(cons.nombre),
                    especificaciones: safeString(cons.especificaciones),
                    unidad: safeString(cons.unidad),
                    tipo: safeString(cons.tipo),
                    cantidad: typeof cons.cantidad === 'number' ? cons.cantidad : parseFloat(String(cons.cantidad)) || 0,
                };
            });
        }

        // Build complete manual
        const manual: ProductionManual = {
            proyecto: {
                nombre: aiResponse.proyecto?.nombre || 'Proyecto sin nombre',
                dimensionesGenerales: { frente, fondo, altura },
                descripcion: aiResponse.proyecto?.descripcion || especificaciones,
            },
            componentes: Array.isArray(aiResponse.componentes) ? aiResponse.componentes : [],
            consumibles: Array.isArray(aiResponse.consumibles) ? aiResponse.consumibles : [],
            optimizacionMateriales: Array.isArray(aiResponse.optimizacionMateriales) ? aiResponse.optimizacionMateriales : [],
            secuenciaEnsamblaje: Array.isArray(aiResponse.secuenciaEnsamblaje) ? aiResponse.secuenciaEnsamblaje : [],
            notasGenerales: Array.isArray(aiResponse.notasGenerales) ? aiResponse.notasGenerales : [],
            fechaGeneracion: formatDate(new Date()),
        };

        // Additional sanitization for nested arrays
        manual.componentes = manual.componentes.map((comp: any) => ({
            ...comp,
            proceso: Array.isArray(comp.proceso) ? comp.proceso :
                (typeof comp.proceso === 'string' ? [comp.proceso] : []),
        }));

        // Generate SVG files for components that require them
        const svgFiles: { [key: string]: string } = {};

        manual.componentes.forEach((comp: Component) => {
            // Force SVG generation for specific keywords if not already requested
            const keywords = ['cnc', 'laser', 'corte', 'logo', 'letrero', 'panel', 'mdf', 'acrilico', 'estructura', 'base', 'cubierta'];
            const textToSearch = `${comp.nombre} ${comp.material.tipo} ${comp.proceso.join(' ')}`.toLowerCase();

            if (keywords.some(k => textToSearch.includes(k))) {
                comp.requiereArchivo = true;
            }

            if (comp.requiereArchivo) {
                const svg = generateSVG(comp);
                svgFiles[comp.id] = svg;
                comp.archivoUrl = `/api/svg/${comp.id}`; // Virtual URL for frontend
            }
        });

        // Generate Nesting Previews
        try {
            const { generateNestingPreview } = await import('@/lib/nesting');
            const nestingFiles = generateNestingPreview(manual.componentes);

            // Merge nesting files into svgFiles
            Object.assign(svgFiles, nestingFiles);

            // Add nesting info to optimization section if needed, or just let the frontend discover them via a list?
            // For now, we'll just ensure they are available.
            // We could add a new field to manual.optimizacionMateriales to link to these files.

            if (manual.optimizacionMateriales) {
                manual.optimizacionMateriales.forEach(opt => {
                    // Find sheets matching this material
                    const matName = opt.material.replace(/[^a-z0-9]/gi, '_');
                    const relatedSheets = Object.keys(nestingFiles).filter(k => k.includes(matName));
                    if (relatedSheets.length > 0) {
                        opt.suggestions.push(`Ver diagramas de corte: ${relatedSheets.join(', ')}`);
                    }
                });
            }

        } catch (nestingError) {
            console.error('Error generating nesting preview:', nestingError);
            // Continue without nesting if it fails
        }

        // ===== CALCULAR COSTOS DE MATERIALES =====
        let costsBreakdown = null;
        try {
            const { calculateCostsFromManual, generateCostSummary } = await import('@/lib/materialExtractor');

            console.log('Calculando costos de materiales...');
            const { costs, suggestions } = calculateCostsFromManual(manual);

            if (costs && costs.materiales.length > 0) {
                console.log(`Costos calculados para ${costs.materiales.length} materiales`);

                if (suggestions.length > 0) {
                    console.log(`Sugerencias de materiales: ${suggestions.length}`);
                    suggestions.forEach(sug => {
                        console.log(`  - ${sug.original} → ${sug.suggested} (${sug.reason})`);
                    });
                }

                // Generar resumen de costos con sugerencias
                const costSummary = generateCostSummary(costs.materiales, costs.total, suggestions);

                // Agregar resumen a las notas generales
                if (!manual.notasGenerales) {
                    manual.notasGenerales = [];
                }
                manual.notasGenerales.push(costSummary);

                costsBreakdown = costs;
                console.log(`Costo total calculado: $${costs.total.toFixed(2)} MXN`);
            } else {
                console.warn('No se pudieron calcular costos - materiales no encontrados en catálogo');
            }
        } catch (costError) {
            console.error('Error al calcular costos:', costError);
            // Continuar sin costos si falla
        }

        // Store SVGs temporarily (in production, use a proper storage solution)
        // For now, we'll send them in the response
        const response = {
            success: true,
            manual,
            svgFiles, // Include SVG content in response
            costs: costsBreakdown, // Include cost breakdown
        };

        return NextResponse.json(response);

    } catch (error: any) {
        console.error('Error generating manual:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Error al generar el manual. Por favor intenta de nuevo.'
            },
            { status: 500 }
        );
    }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;
