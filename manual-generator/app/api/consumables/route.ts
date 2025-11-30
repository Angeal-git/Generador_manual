import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/consumables - Listar todos los consumibles
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const tipo = searchParams.get('tipo');

        const consumables = await prisma.consumable.findMany({
            where: tipo ? { tipo: tipo as any } : undefined,
            orderBy: { nombre: 'asc' }
        });

        return NextResponse.json({ success: true, consumables });
    } catch (error: any) {
        console.error('Error fetching consumables:', error);
        return NextResponse.json(
            { success: false, error: 'Error al obtener consumibles' },
            { status: 500 }
        );
    }
}

// POST /api/consumables - Crear nuevo consumible
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { nombre, tipo, unidad, precioPorUnidad, cantidadMinima, especificaciones } = body;

        if (!nombre || !tipo || !unidad || precioPorUnidad === undefined) {
            return NextResponse.json(
                { success: false, error: 'Faltan campos requeridos' },
                { status: 400 }
            );
        }

        const consumable = await prisma.consumable.create({
            data: {
                nombre,
                tipo,
                unidad,
                precioPorUnidad: parseFloat(precioPorUnidad),
                cantidadMinima: cantidadMinima ? parseFloat(cantidadMinima) : null,
                especificaciones: especificaciones || null
            }
        });

        return NextResponse.json({ success: true, consumable }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating consumable:', error);
        return NextResponse.json(
            { success: false, error: 'Error al crear consumible' },
            { status: 500 }
        );
    }
}
