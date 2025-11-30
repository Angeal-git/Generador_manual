import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/consumables/[id]
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const consumable = await prisma.consumable.findUnique({
            where: { id: params.id }
        });

        if (!consumable) {
            return NextResponse.json(
                { success: false, error: 'Consumible no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, consumable });
    } catch (error: any) {
        console.error('Error fetching consumable:', error);
        return NextResponse.json(
            { success: false, error: 'Error al obtener consumible' },
            { status: 500 }
        );
    }
}

// PUT /api/consumables/[id]
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { nombre, tipo, unidad, precioPorUnidad, cantidadMinima, especificaciones } = body;

        const consumable = await prisma.consumable.update({
            where: { id: params.id },
            data: {
                ...(nombre && { nombre }),
                ...(tipo && { tipo }),
                ...(unidad && { unidad }),
                ...(precioPorUnidad !== undefined && { precioPorUnidad: parseFloat(precioPorUnidad) }),
                ...(cantidadMinima !== undefined && { cantidadMinima: cantidadMinima ? parseFloat(cantidadMinima) : null }),
                ...(especificaciones !== undefined && { especificaciones })
            }
        });

        return NextResponse.json({ success: true, consumable });
    } catch (error: any) {
        console.error('Error updating consumable:', error);
        return NextResponse.json(
            { success: false, error: 'Error al actualizar consumible' },
            { status: 500 }
        );
    }
}

// DELETE /api/consumables/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.consumable.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting consumable:', error);
        return NextResponse.json(
            { success: false, error: 'Error al eliminar consumible' },
            { status: 500 }
        );
    }
}
