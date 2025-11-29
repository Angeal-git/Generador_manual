import { Component } from './types';

// Standard board size in mm (2.44m x 1.22m)
const BOARD_WIDTH = 2440;
const BOARD_HEIGHT = 1220;
const MARGIN = 20; // Margin from edges in mm
const SPACING = 20; // Spacing between pieces in mm

interface Rect {
    id: string;
    width: number;
    height: number;
    x: number;
    y: number;
    rotated: boolean;
}

interface Sheet {
    id: number;
    items: Rect[];
}

export function generateNestingPreview(components: Component[]): Record<string, string> {
    const sheets: Record<string, string> = {};

    // Group components by material type (simple grouping)
    // We only nest "sheet" materials like MDF, Plywood, Acrylic, etc.
    // We'll assume anything with area > 0 and thickness is a sheet material for now, 
    // or rely on keywords in material type.

    const sheetMaterials = components.filter(c => {
        const mat = c.material.tipo.toLowerCase();
        return mat.includes('mdf') || mat.includes('madera') || mat.includes('triplay') ||
            mat.includes('acrilico') || mat.includes('melamina') || mat.includes('plywood');
    });

    if (sheetMaterials.length === 0) return sheets;

    // Group by specific material name to nest same materials together
    const materialGroups: Record<string, Component[]> = {};
    sheetMaterials.forEach(c => {
        const key = c.material.tipo;
        if (!materialGroups[key]) materialGroups[key] = [];
        materialGroups[key].push(c);
    });

    Object.entries(materialGroups).forEach(([materialName, items]) => {
        const packedSheets = packItems(items);

        packedSheets.forEach((sheet, index) => {
            const filename = `layout_${materialName.replace(/[^a-z0-9]/gi, '_')}_hoja_${index + 1}`;
            sheets[filename] = generateSheetSVG(sheet, materialName);
        });
    });

    return sheets;
}

function packItems(components: Component[]): Sheet[] {
    // Convert components to rects with mm dimensions
    let rects: Rect[] = components.map(c => ({
        id: c.id,
        // Convert to mm. Assume dimensions are in cm if not specified, or normalize.
        // The prompt asks for cm, so we multiply by 10.
        width: (c.dimensiones.largo || 0) * 10,
        height: (c.dimensiones.alto || 0) * 10,
        x: 0,
        y: 0,
        rotated: false
    })).filter(r => r.width > 0 && r.height > 0);

    // Sort by height descending (FFDH heuristic)
    rects.sort((a, b) => Math.max(b.width, b.height) - Math.max(a.width, a.height));

    const sheets: Sheet[] = [];

    // Simple First Fit algorithm
    // We try to place each rect into existing sheets. If it fits nowhere, create a new sheet.

    for (const rect of rects) {
        let placed = false;

        for (const sheet of sheets) {
            if (tryPlaceRect(sheet, rect)) {
                placed = true;
                break;
            }
        }

        if (!placed) {
            const newSheet: Sheet = { id: sheets.length + 1, items: [] };
            if (tryPlaceRect(newSheet, rect)) {
                sheets.push(newSheet);
            } else {
                // Item too big for a single sheet? 
                // The prompt should have handled splitting, but if we get here, 
                // we might just place it alone or warn. For now, place it alone even if it overflows visually.
                // Or we can try rotating it.
                // tryPlaceRect already tries rotation.

                // Force place in a new sheet at 0,0
                newSheet.items.push({ ...rect, x: MARGIN, y: MARGIN });
                sheets.push(newSheet);
            }
        }
    }

    return sheets;
}

function tryPlaceRect(sheet: Sheet, rect: Rect): boolean {
    // Try normal orientation
    if (findPosition(sheet, rect.width, rect.height, rect)) return true;

    // Try rotated orientation
    if (findPosition(sheet, rect.height, rect.width, rect, true)) return true;

    return false;
}

function findPosition(sheet: Sheet, w: number, h: number, rect: Rect, rotated: boolean = false): boolean {
    // Check if it fits within board limits
    if (w > BOARD_WIDTH - 2 * MARGIN || h > BOARD_HEIGHT - 2 * MARGIN) return false;

    // Naive approach: try to place at the bottom-right of every existing item, 
    // plus the top-left of the board.
    // This is a simplification of the "Maximal Rectangles" or "Guillotine" approach.
    // For this preview, we'll scan a grid or just try candidate points.

    // Candidate points: (MARGIN, MARGIN) and (item.x + item.w + SPACING, item.y), (item.x, item.y + item.h + SPACING)
    const candidates: { x: number, y: number }[] = [{ x: MARGIN, y: MARGIN }];

    for (const item of sheet.items) {
        candidates.push({ x: item.x + item.width + SPACING, y: item.y });
        candidates.push({ x: item.x, y: item.y + item.height + SPACING });
        candidates.push({ x: item.x + item.width + SPACING, y: item.y + item.height + SPACING });
    }

    // Sort candidates by Y then X to fill top-left first
    candidates.sort((a, b) => (a.y - b.y) || (a.x - b.x));

    for (const pos of candidates) {
        if (pos.x + w <= BOARD_WIDTH - MARGIN && pos.y + h <= BOARD_HEIGHT - MARGIN) {
            // Check collision with all existing items
            let collision = false;
            for (const item of sheet.items) {
                if (rectsOverlap(pos.x, pos.y, w, h, item.x, item.y, item.width, item.height)) {
                    collision = true;
                    break;
                }
            }
            if (!collision) {
                rect.x = pos.x;
                rect.y = pos.y;
                rect.width = w;
                rect.height = h;
                rect.rotated = rotated;
                sheet.items.push(rect);
                return true;
            }
        }
    }

    return false;
}

function rectsOverlap(x1: number, y1: number, w1: number, h1: number, x2: number, y2: number, w2: number, h2: number): boolean {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}

function generateSheetSVG(sheet: Sheet, materialName: string): string {
    const svgWidth = 800;
    const svgHeight = 400; // Aspect ratio 2:1 roughly like 2.44x1.22

    // Scale factor to fit board into SVG
    const scale = Math.min(svgWidth / BOARD_WIDTH, svgHeight / BOARD_HEIGHT);

    let content = '';

    // Draw items
    for (const item of sheet.items) {
        const x = item.x * scale;
        const y = item.y * scale;
        const w = item.width * scale;
        const h = item.height * scale;

        content += `
            <g transform="translate(${x}, ${y})">
                <rect width="${w}" height="${h}" fill="#e0e0e0" stroke="#000" stroke-width="1" />
                <text x="${w / 2}" y="${h / 2}" font-family="Arial" font-size="10" text-anchor="middle" dominant-baseline="middle" fill="#333">
                    ${item.id}
                </text>
                <text x="${w / 2}" y="${h / 2 + 12}" font-family="Arial" font-size="8" text-anchor="middle" dominant-baseline="middle" fill="#666">
                    ${(item.width / 10).toFixed(0)}x${(item.height / 10).toFixed(0)}
                </text>
            </g>
        `;
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
    <!-- Board Background -->
    <rect width="${BOARD_WIDTH * scale}" height="${BOARD_HEIGHT * scale}" fill="#fff" stroke="#000" stroke-width="2" />
    <text x="10" y="20" font-family="Arial" font-size="14" fill="#000">
        Material: ${materialName} - Hoja ${sheet.id} (2.44m x 1.22m)
    </text>
    
    <!-- Items -->
    ${content}
</svg>`;
}
