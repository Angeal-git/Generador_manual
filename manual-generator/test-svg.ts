import { generateSVG } from './lib/svg-generator';
import { Component } from './lib/types';
import * as fs from 'fs';
import * as path from 'path';

// Mock Component
const mockComponent: Component = {
    id: 'test-comp-001',
    nombre: 'Panel Frontal',
    descripcion: 'Panel principal de acrílico con cortes para botones',
    dimensiones: {
        largo: 25,
        ancho: 15,
        alto: 0.5,
        unidad: 'cm'
    },
    material: {
        tipo: 'Acrílico Transparente',
        especificaciones: '3mm de espesor',
        cantidad: 1,
        unidadCantidad: 'pieza'
    },
    proceso: ['Corte Laser'],
    notas: 'Manejar con cuidado',
    requiereArchivo: true
};

try {
    console.log('Generating SVG for:', mockComponent.nombre);
    const svgContent = generateSVG(mockComponent);

    const outputPath = path.join(process.cwd(), 'test_output.svg');
    fs.writeFileSync(outputPath, svgContent);

    console.log('SVG generated successfully at:', outputPath);
    console.log('Content preview:');
    console.log(svgContent.substring(0, 200) + '...');
} catch (error) {
    console.error('Error generating SVG:', error);
}
