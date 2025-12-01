import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/materials/[id] - Obtener material específico
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const material = await prisma.material.findUnique({
            where: { id: params.id }
        });

        if (!material) {
            return NextResponse.json(
                { success: false, error: 'Material no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, material });
    } catch (error: any) {
        console.error('Error fetching material:', error);
        return NextResponse.json(
            { success: false, error: 'Error al obtener material' },
            { status: 500 }
        );
    }
}

// PUT /api/materials/[id] - Actualizar material
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const {
            nombre,
            tipo,
            unidad,
            precioPorUnidad,
            unidadVenta,
            cantidadPorUnidadVenta,
            precioPorUnidadVenta,
            ancho,
            alto,
            stockCantidad,
            proveedor,
            especificaciones,
            enStock
        } = body;

        const material = await prisma.material.update({
            where: { id: params.id },
            data: {
                ...(nombre && { nombre }),
                ...(tipo && { tipo }),
                ...(unidad && { unidad }),
                ...(precioPorUnidad !== undefined && { precioPorUnidad: parseFloat(precioPorUnidad) }),
                ...(unidadVenta !== undefined && { unidadVenta }),
                ...(cantidadPorUnidadVenta !== undefined && { cantidadPorUnidadVenta }),
                ...(precioPorUnidadVenta !== undefined && { precioPorUnidadVenta }),
                ...(ancho !== undefined && { ancho }),
                ...(alto !== undefined && { alto }),
                ...(stockCantidad !== undefined && { stockCantidad }),
                ...(proveedor !== undefined && { proveedor }),
                ...(especificaciones !== undefined && { especificaciones }),
                ...(enStock !== undefined && { enStock })
            }
        });

        return NextResponse.json({ success: true, material });
    } catch (error: any) {
        console.error('Error updating material:', error);
        return NextResponse.json(
            { success: false, error: 'Error al actualizar material' },
            { status: 500 }
        );
    }
}

// DELETE /api/materials/[id] - Eliminar material
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.material.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting material:', error);
        return NextResponse.json(
            { success: false, error: 'Error al eliminar material' },
            { status: 500 }
        );
    }
}
