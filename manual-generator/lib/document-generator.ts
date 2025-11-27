// Document generators for PDF and DOCX formats with improved formatting and SVG support

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableCell, TableRow, WidthType, BorderStyle, ImageRun, ShadingType } from 'docx';
import { ProductionManual } from './types';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: any) => jsPDF;
        lastAutoTable?: { finalY: number };
    }
}

// Helper to remove emojis and non-standard characters for PDF
function cleanText(text: string): string {
    // Normalize to NFD to separate accents from letters
    return text.normalize("NFD")
        // Remove accents
        .replace(/[\u0300-\u036f]/g, "")
        // Remove emojis and other non-ASCII characters
        .replace(/[^\x20-\x7E]/g, "")
        .trim();
}

// Helper to shorten long text for titles
function shortenText(text: string, maxLength: number = 30): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

// Helper to convert SVG to PNG data URL
function svgToPng(svgString: string, width: number, height: number): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();

        // Ensure namespace exists for browser rendering
        if (!svgString.includes('xmlns="http://www.w3.org/2000/svg"')) {
            svgString = svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
        }

        // Force width and height in the SVG string to pixels to ensure consistent rendering
        // This regex looks for width and height attributes and replaces them
        // We use the requested width/height to ensure high resolution
        svgString = svgString.replace(/width="([^"]*)"/, `width="${width}px"`);
        svgString = svgString.replace(/height="([^"]*)"/, `height="${height}px"`);

        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Could not get canvas context'));
                return;
            }

            // White background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);

            try {
                ctx.drawImage(img, 0, 0, width, height);
                const dataUrl = canvas.toDataURL('image/png');
                URL.revokeObjectURL(url);
                resolve(dataUrl);
            } catch (err) {
                console.error('Error drawing SVG to canvas:', err);
                URL.revokeObjectURL(url);
                resolve(''); // Fail gracefully
            }
        };

        img.onerror = (err) => {
            URL.revokeObjectURL(url);
            console.error('Error loading SVG image:', err);
            // Try to log the beginning of the SVG to see if it's malformed
            console.error('SVG Start:', svgString.substring(0, 100));
            resolve(''); // Resolve with empty string on error to continue process
        };

        img.src = url;
    });
}

// Helper to draw the sidebar on PDF pages
function drawSidebar(doc: jsPDF, pageHeight: number, projectName: string) {
    const sidebarWidth = 25; // mm
    const primaryColor: [number, number, number] = [234, 88, 12]; // Orange #ea580c

    // Draw sidebar background
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, sidebarWidth, pageHeight, 'F');

    // Add rotated text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');

    // Save context, rotate, draw text, restore context
    // The rotation is around the point (0,0) by default, so we need to translate first
    // We want the text to start near the bottom and go up
    doc.saveGraphicsState();

    // Position for "PLANEACION DEL TRABAJO"
    doc.text('PLANEACION DEL TRABAJO', 18, pageHeight - 40, { angle: 90 });

    // Position for Project Name
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    // doc.text(`| ${cleanText(projectName)}`, 18, pageHeight - 160, { angle: 90 });

    doc.restoreGraphicsState();
}

export async function generatePDF(manual: ProductionManual, svgFiles: { [key: string]: string } = {}): Promise<Blob> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Layout constants
    const sidebarWidth = 25;
    const marginLeft = sidebarWidth + 10;
    const marginRight = 15;
    const contentWidth = pageWidth - marginLeft - marginRight;

    let yPosition = 20;

    // Colors
    const primaryColor: [number, number, number] = [234, 88, 12]; // Orange #ea580c
    const secondaryColor: [number, number, number] = [249, 115, 22]; // Lighter Orange #f97316
    const textColor: [number, number, number] = [30, 41, 59]; // #1e293b
    const lightGray: [number, number, number] = [241, 245, 249]; // #f1f5f9

    // Helper to add page with sidebar
    const addPage = () => {
        doc.addPage();
        drawSidebar(doc, pageHeight, manual.proyecto.nombre);
        // Add page number
        const pageCount = (doc as any).internal.getNumberOfPages();
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`pagina | ${pageCount}`, pageWidth - 25, pageHeight - 10);
    };

    // ===== COVER PAGE =====
    // Draw sidebar on first page
    drawSidebar(doc, pageHeight, manual.proyecto.nombre);

    // Title
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('Manual de', marginLeft, 40);
    doc.text('Produccion', marginLeft, 52);

    // Project name
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'normal');
    const shortProjectName = shortenText(cleanText(manual.proyecto.nombre), 30);
    doc.text(shortProjectName, marginLeft, 70);

    // Date and info box
    yPosition = 90;
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.line(marginLeft, yPosition, pageWidth - marginRight, yPosition);

    yPosition += 15;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Fecha: ${manual.fechaGeneracion}`, marginLeft, yPosition);

    yPosition += 10;
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(cleanText(manual.proyecto.descripcion), contentWidth);
    doc.text(descLines, marginLeft, yPosition);
    yPosition += descLines.length * 6 + 15;

    // Dimensions section
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Dimensiones Generales', marginLeft, yPosition);

    yPosition += 10;
    const dimensionsData = [
        ['Frente', `${manual.proyecto.dimensionesGenerales.frente} cm`],
        ['Fondo', `${manual.proyecto.dimensionesGenerales.fondo} cm`],
        ['Altura', `${manual.proyecto.dimensionesGenerales.altura} cm`],
    ];

    autoTable(doc, {
        startY: yPosition,
        head: [['Dimension', 'Medida']],
        body: dimensionsData,
        theme: 'grid',
        headStyles: {
            fillColor: primaryColor,
            fontSize: 11,
            fontStyle: 'bold',
            halign: 'left',
        },
        styles: {
            fontSize: 10,
            cellPadding: 5,
        },
        margin: { left: marginLeft, right: marginRight },
    });

    // Add page number for cover
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('pagina | 1', pageWidth - 25, pageHeight - 10);

    // ===== COMPONENTS PAGE =====
    addPage();
    yPosition = 20;

    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Lista de Componentes', marginLeft, yPosition);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text(`Total: ${manual.componentes.length} piezas`, marginLeft, yPosition + 10);

    yPosition += 20;

    // Components table
    const componentsData = manual.componentes.map((comp, index) => {
        const dims = `${comp.dimensiones.largo || '-'} x ${comp.dimensiones.ancho || '-'} x ${comp.dimensiones.alto || '-'} ${comp.dimensiones.unidad}`;
        const hasFile = svgFiles[comp.id] ? 'Si' : '-';
        return [
            `${index + 1}`,
            cleanText(comp.nombre),
            dims,
            cleanText(comp.material.tipo),
            `${comp.material.cantidad}`,
            hasFile
        ];
    });

    autoTable(doc, {
        startY: yPosition,
        head: [['#', 'Componente', 'Dimensiones', 'Material', 'Cant.', 'Archivo']],
        body: componentsData,
        theme: 'plain',
        headStyles: {
            fillColor: [255, 255, 255],
            textColor: primaryColor,
            fontSize: 10,
            fontStyle: 'bold',
            lineWidth: 0,
            halign: 'left',
        },
        bodyStyles: {
            lineColor: [200, 200, 200],
            lineWidth: 0.1,
        },
        styles: {
            fontSize: 9,
            cellPadding: 4,
            valign: 'middle',
        },
        columnStyles: {
            0: { cellWidth: 10, fontStyle: 'bold' },
            1: { cellWidth: 45 },
            2: { cellWidth: 35 },
            3: { cellWidth: 35 },
            4: { cellWidth: 15 },
            5: { cellWidth: 15 },
        },
        margin: { left: marginLeft, right: marginRight },
    });

    // Component details
    for (let i = 0; i < manual.componentes.length; i++) {
        const comp = manual.componentes[i];
        const index = i;

        addPage();
        yPosition = 20;

        // Component header
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. ${cleanText(comp.nombre)}`, marginLeft, yPosition);

        yPosition += 10;
        doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setLineWidth(0.5);
        doc.line(marginLeft, yPosition, pageWidth - marginRight, yPosition);
        yPosition += 10;

        doc.setTextColor(textColor[0], textColor[1], textColor[2]);

        // Description
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        const descLines = doc.splitTextToSize(cleanText(comp.descripcion), contentWidth);
        doc.text(descLines, marginLeft, yPosition);
        yPosition += descLines.length * 6 + 10;

        // Details table
        const detailsData = [
            ['Dimensiones', `${comp.dimensiones.largo || '-'} x ${comp.dimensiones.ancho || '-'} x ${comp.dimensiones.alto || '-'} ${comp.dimensiones.unidad}`],
            ['Material', cleanText(comp.material.tipo)],
            ['Especificaciones', cleanText(comp.material.especificaciones)],
            ['Cantidad', `${comp.material.cantidad} ${comp.material.unidadCantidad}`],
            ['Proceso', cleanText(comp.proceso.join(', '))],
        ];

        if (comp.notas) {
            detailsData.push(['Notas', cleanText(comp.notas)]);
        }

        autoTable(doc, {
            startY: yPosition,
            body: detailsData,
            theme: 'plain',
            styles: {
                fontSize: 10,
                cellPadding: 5,
            },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 40, textColor: primaryColor },
                1: { cellWidth: 100 },
            },
            margin: { left: marginLeft, right: marginRight },
        });

        yPosition = (doc as any).lastAutoTable.finalY + 15;

        // SVG preview if available
        if (svgFiles[comp.id]) {
            // Check if we need a new page for the image
            if (yPosition > pageHeight - 100) {
                addPage();
                yPosition = 20;
            }

            // Figure Caption
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.text(`Figura ${index + 1}A`, marginLeft, yPosition);
            yPosition += 5;

            // Border for the image
            const imageSize = 100; // mm
            doc.setDrawColor(100, 100, 100);
            doc.setLineWidth(0.1);
            doc.rect(marginLeft, yPosition, pageWidth - marginLeft - marginRight, imageSize + 10);

            // Convert SVG to PNG and embed
            try {
                const pngDataUrl = await svgToPng(svgFiles[comp.id], 1000, 1000);
                if (pngDataUrl) {
                    // Center image in the box
                    const boxWidth = pageWidth - marginLeft - marginRight;
                    const xOffset = marginLeft + (boxWidth - imageSize) / 2;

                    doc.addImage(pngDataUrl, 'PNG', xOffset, yPosition + 5, imageSize, imageSize);
                }
            } catch (e) {
                console.error('Error embedding image in PDF:', e);
                doc.setFontSize(9);
                doc.setTextColor(255, 0, 0);
                doc.text('(Error al generar vista previa)', marginLeft + 5, yPosition + 10);
            }

            // Add note below image
            yPosition += imageSize + 20;
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            doc.text('NOTA: Las medidas estan expresadas en la unidad indicada.', marginLeft, yPosition);
        }
    }

    // ===== CONSUMABLES PAGE =====
    if (manual.consumibles.length > 0) {
        addPage();
        yPosition = 20;

        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text('Consumibles', marginLeft, yPosition);

        yPosition += 15;

        const consumablesData = manual.consumibles.map((cons, index) => {
            return [
                `${index + 1}`,
                cleanText(cons.nombre),
                `${cons.cantidad} ${cons.unidad}`,
                cleanText(cons.especificaciones)
            ];
        });

        autoTable(doc, {
            startY: yPosition,
            head: [['#', 'Consumible', 'Cantidad', 'Especificaciones']],
            body: consumablesData,
            theme: 'striped',
            headStyles: {
                fillColor: primaryColor,
                fontSize: 10,
                fontStyle: 'bold',
            },
            styles: {
                fontSize: 9,
                cellPadding: 5,
            },
            columnStyles: {
                0: { cellWidth: 10 },
                1: { cellWidth: 50 },
                2: { cellWidth: 30 },
                3: { cellWidth: 60 },
            },
            margin: { left: marginLeft, right: marginRight },
        });
    }

    return doc.output('blob');
}

export async function generateDOCX(manual: ProductionManual, svgFiles: { [key: string]: string } = {}): Promise<Blob> {
    const children: any[] = [];

    // Orange color hex
    const primaryColorHex = "EA580C";

    // ===== COVER PAGE =====
    children.push(
        new Paragraph({
            text: 'Manual de Producción',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            border: {
                bottom: { color: primaryColorHex, space: 1, style: BorderStyle.SINGLE, size: 6 },
            }
        })
    );

    children.push(
        new Paragraph({
            text: shortenText(manual.proyecto.nombre, 30),
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
        })
    );

    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `Fecha: ${manual.fechaGeneracion}`,
                    italics: true,
                }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
        })
    );

    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: manual.proyecto.descripcion,
                }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 },
        })
    );

    // ===== DIMENSIONS =====
    children.push(
        new Paragraph({
            text: 'Dimensiones Generales',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
            border: {
                bottom: { color: primaryColorHex, space: 1, style: BorderStyle.SINGLE, size: 6 },
            }
        })
    );

    const dimensionsTable = new Table({
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: 'Dimensión', bold: true, color: "FFFFFF" })] })],
                        shading: { fill: primaryColorHex, type: ShadingType.CLEAR, color: "auto" },
                    }),
                    new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: 'Medida', bold: true, color: "FFFFFF" })] })],
                        shading: { fill: primaryColorHex, type: ShadingType.CLEAR, color: "auto" },
                    }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph('Frente')] }),
                    new TableCell({ children: [new Paragraph(`${manual.proyecto.dimensionesGenerales.frente} cm`)] }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph('Fondo')] }),
                    new TableCell({ children: [new Paragraph(`${manual.proyecto.dimensionesGenerales.fondo} cm`)] }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph('Altura')] }),
                    new TableCell({ children: [new Paragraph(`${manual.proyecto.dimensionesGenerales.altura} cm`)] }),
                ],
            }),
        ],
        width: { size: 100, type: WidthType.PERCENTAGE },
    });

    children.push(dimensionsTable);

    // ===== COMPONENTS =====
    children.push(
        new Paragraph({
            text: 'Componentes de Fabricación',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 600, after: 200 },
            border: {
                bottom: { color: primaryColorHex, space: 1, style: BorderStyle.SINGLE, size: 6 },
            }
        })
    );

    // Use for...of loop for async operations
    for (const comp of manual.componentes) {
        const index = manual.componentes.indexOf(comp);
        children.push(
            new Paragraph({
                text: `${index + 1}. ${comp.nombre}`,
                heading: HeadingLevel.HEADING_3,
                spacing: { before: 400, after: 200 },
            })
        );

        children.push(
            new Paragraph({
                children: [
                    new TextRun({ text: comp.descripcion, italics: true }),
                ],
                spacing: { after: 200 },
            })
        );

        // Component details table
        const componentTable = new Table({
            rows: [
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Dimensiones', bold: true, color: primaryColorHex })] })] }),
                        new TableCell({ children: [new Paragraph(`${comp.dimensiones.largo || '-'} × ${comp.dimensiones.ancho || '-'} × ${comp.dimensiones.alto || '-'} ${comp.dimensiones.unidad}`)] }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Material', bold: true, color: primaryColorHex })] })] }),
                        new TableCell({ children: [new Paragraph(comp.material.tipo)] }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Especificaciones', bold: true, color: primaryColorHex })] })] }),
                        new TableCell({ children: [new Paragraph(comp.material.especificaciones)] }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Cantidad', bold: true, color: primaryColorHex })] })] }),
                        new TableCell({ children: [new Paragraph(`${comp.material.cantidad} ${comp.material.unidadCantidad}`)] }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Proceso', bold: true, color: primaryColorHex })] })] }),
                        new TableCell({ children: [new Paragraph(comp.proceso.join(', '))] }),
                    ],
                }),
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
        });

        children.push(componentTable);

        if (comp.notas) {
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: 'Notas: ', bold: true }),
                        new TextRun({ text: comp.notas }),
                    ],
                    spacing: { before: 200, after: 200 },
                })
            );
        }

        if (svgFiles[comp.id]) {
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: `Figura ${index + 1}A`, bold: true, color: primaryColorHex }),
                    ],
                    spacing: { before: 200, after: 100 },
                })
            );

            try {
                // Convert SVG to PNG for reliable embedding in DOCX
                const pngDataUrl = await svgToPng(svgFiles[comp.id], 800, 800);

                if (pngDataUrl) {
                    // Remove data:image/png;base64, prefix
                    const base64Data = pngDataUrl.split(',')[1];
                    const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

                    children.push(
                        new Paragraph({
                            children: [
                                new ImageRun({
                                    data: imageBuffer,
                                    transformation: {
                                        width: 400,
                                        height: 400,
                                    },
                                }),
                            ],
                            spacing: { after: 400 },
                            alignment: AlignmentType.CENTER,
                            border: {
                                top: { color: "CCCCCC", space: 1, style: BorderStyle.SINGLE, size: 2 },
                                bottom: { color: "CCCCCC", space: 1, style: BorderStyle.SINGLE, size: 2 },
                                left: { color: "CCCCCC", space: 1, style: BorderStyle.SINGLE, size: 2 },
                                right: { color: "CCCCCC", space: 1, style: BorderStyle.SINGLE, size: 2 },
                            }
                        })
                    );
                }
            } catch (e) {
                console.error('Error adding image to DOCX:', e);
                children.push(
                    new Paragraph({
                        text: '(Error al adjuntar imagen)',
                        spacing: { after: 400 },
                        alignment: AlignmentType.CENTER,
                    })
                );
            }
        }
    }

    // ===== CONSUMABLES =====
    if (manual.consumibles.length > 0) {
        children.push(
            new Paragraph({
                text: 'Consumibles',
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 600, after: 200 },
                border: {
                    bottom: { color: primaryColorHex, space: 1, style: BorderStyle.SINGLE, size: 6 },
                }
            })
        );

        const consumablesTableRows = [
            new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '#', bold: true, color: "FFFFFF" })] })], shading: { fill: primaryColorHex, type: ShadingType.CLEAR, color: "auto" } }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Consumible', bold: true, color: "FFFFFF" })] })], shading: { fill: primaryColorHex, type: ShadingType.CLEAR, color: "auto" } }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Cantidad', bold: true, color: "FFFFFF" })] })], shading: { fill: primaryColorHex, type: ShadingType.CLEAR, color: "auto" } }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Especificaciones', bold: true, color: "FFFFFF" })] })], shading: { fill: primaryColorHex, type: ShadingType.CLEAR, color: "auto" } }),
                ],
            }),
        ];

        manual.consumibles.forEach((cons, index) => {
            const icon = cons.tipo === 'iluminacion' ? '💡' :
                cons.tipo === 'pintura' ? '🎨' :
                    cons.tipo === 'adhesivo' ? '🔗' :
                        cons.tipo === 'tornilleria' ? '🔩' : '📦';

            consumablesTableRows.push(
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph(`${index + 1}`)] }),
                        new TableCell({ children: [new Paragraph(`${icon} ${cons.nombre}`)] }),
                        new TableCell({ children: [new Paragraph(`${cons.cantidad} ${cons.unidad}`)] }),
                        new TableCell({ children: [new Paragraph(cons.especificaciones)] }),
                    ],
                })
            );
        });

        const consumablesTable = new Table({
            rows: consumablesTableRows,
            width: { size: 100, type: WidthType.PERCENTAGE },
        });

        children.push(consumablesTable);
    }

    const doc = new Document({
        sections: [
            {
                properties: {},
                children: children,
            },
        ],
    });

    return await Packer.toBlob(doc);
}

export function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
