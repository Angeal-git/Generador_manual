import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/projects/[id] - Cargar proyecto específico
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const project = await prisma.project.findUnique({
            where: { id: params.id },
            include: {
                componentes: {
                    include: {
                        material: true
                    }
                },
                consumibles: {
                    include: {
                        consumable: true
                    }
                }
            }
        });

        if (!project) {
            return NextResponse.json(
                { success: false, error: 'Proyecto no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, project });
    } catch (error: any) {
        console.error('Error fetching project:', error);
        return NextResponse.json(
            { success: false, error: 'Error al obtener proyecto' },
            { status: 500 }
        );
    }
}

// PUT /api/projects/[id] - Actualizar proyecto
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const {
            nombre,
            descripcion,
            manualData,
            svgFiles,
            costoMateriales,
            costoConsumibles,
            costoManoDeObra,
            costoTotal
        } = body;

        const project = await prisma.project.update({
            where: { id: params.id },
            data: {
                ...(nombre && { nombre }),
                ...(descripcion !== undefined && { descripcion }),
                ...(manualData && { manualData }),
                ...(svgFiles !== undefined && { svgFiles }),
                ...(costoMateriales !== undefined && { costoMateriales }),
                ...(costoConsumibles !== undefined && { costoConsumibles }),
                ...(costoManoDeObra !== undefined && { costoManoDeObra }),
                ...(costoTotal !== undefined && { costoTotal })
            }
        });

        return NextResponse.json({ success: true, project });
    } catch (error: any) {
        console.error('Error updating project:', error);
        return NextResponse.json(
            { success: false, error: 'Error al actualizar proyecto' },
            { status: 500 }
        );
    }
}

// DELETE /api/projects/[id] - Eliminar proyecto
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.project.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting project:', error);
        return NextResponse.json(
            { success: false, error: 'Error al eliminar proyecto' },
            { status: 500 }
        );
    }
}
