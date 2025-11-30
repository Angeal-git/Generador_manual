import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/materials - Listar todos los materiales
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const tipo = searchParams.get('tipo');

        const materials = await prisma.material.findMany({
            where: tipo ? { tipo } : undefined,
            orderBy: { nombre: 'asc' }
        });

        return NextResponse.json({ success: true, materials });
    } catch (error: any) {
        console.error('Error fetching materials:', error);
        return NextResponse.json(
            { success: false, error: 'Error al obtener materiales' },
            { status: 500 }
        );
    }
}

// POST /api/materials - Crear nuevo material
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { nombre, tipo, unidad, precioPorUnidad, proveedor, especificaciones, enStock } = body;

        if (!nombre || !tipo || !unidad || precioPorUnidad === undefined) {
            return NextResponse.json(
                { success: false, error: 'Faltan campos requeridos' },
                { status: 400 }
            );
        }

        const material = await prisma.material.create({
            data: {
                nombre,
                tipo,
                unidad,
                precioPorUnidad: parseFloat(precioPorUnidad),
                proveedor: proveedor || null,
                especificaciones: especificaciones || null,
                enStock: enStock !== undefined ? enStock : true
            }
        });

        return NextResponse.json({ success: true, material }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating material:', error);
        return NextResponse.json(
            { success: false, error: 'Error al crear material' },
            { status: 500 }
        );
    }
}
