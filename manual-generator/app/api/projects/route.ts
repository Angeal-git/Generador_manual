import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/projects - Listar proyectos guardados
export async function GET(request: NextRequest) {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                nombre: true,
                descripcion: true,
                dimensionesFrente: true,
                dimensionesFondo: true,
                dimensionesAltura: true,
                costoTotal: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return NextResponse.json({ success: true, projects });
    } catch (error: any) {
        console.error('Error fetching projects:', error);
        return NextResponse.json(
            { success: false, error: 'Error al obtener proyectos' },
            { status: 500 }
        );
    }
}

// POST /api/projects - Guardar nuevo proyecto
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            nombre,
            descripcion,
            dimensiones,
            especificaciones,
            manualData,
            svgFiles,
            imageUrls,
            costoMateriales,
            costoConsumibles,
            costoManoDeObra,
            costoTotal,
            costsData // Nuevo campo
        } = body;

        if (!nombre || !dimensiones || !manualData) {
            return NextResponse.json(
                { success: false, error: 'Faltan campos requeridos' },
                { status: 400 }
            );
        }

        const project = await prisma.project.create({
            data: {
                nombre,
                descripcion: descripcion || null,
                dimensionesFrente: dimensiones.frente,
                dimensionesFondo: dimensiones.fondo,
                dimensionesAltura: dimensiones.altura,
                especificaciones: especificaciones || null,
                manualData,
                svgFiles: svgFiles || null,
                imageUrls: imageUrls || [],
                costoMateriales: costoMateriales || 0,
                costoConsumibles: costoConsumibles || 0,
                costoManoDeObra: costoManoDeObra || 0,
                costoTotal: costoTotal || 0,
                costsData: costsData || null
            }
        });

        return NextResponse.json({ success: true, project }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating project:', error);
        return NextResponse.json(
            { success: false, error: 'Error al guardar proyecto' },
            { status: 500 }
        );
    }
}
