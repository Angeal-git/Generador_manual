'use client';

import React, { useState } from 'react';
import { ProductionManual } from '@/lib/types';
import { generatePDF, generateDOCX, downloadBlob } from '@/lib/document-generator';
import JSZip from 'jszip';
import styles from './DownloadButtons.module.css';

interface DownloadButtonsProps {
    manual: ProductionManual;
    svgFiles: { [key: string]: string };
}

export default function DownloadButtons({ manual, svgFiles }: DownloadButtonsProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    // Helper to create short, clean filenames
    const sanitizeFilename = (name: string, maxLength: number = 20): string => {
        return name
            .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
            .replace(/\s+/g, '_') // Replace spaces with underscores
            .substring(0, maxLength); // Limit length
    };

    const shortName = sanitizeFilename(manual.proyecto.nombre);

    const handleDownloadPDF = async () => {
        setIsGenerating(true);
        try {
            const pdfBlob = await generatePDF(manual, svgFiles);
            downloadBlob(pdfBlob, `${shortName}_Manual.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error al generar PDF');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownloadDOCX = async () => {
        setIsGenerating(true);
        try {
            const docxBlob = await generateDOCX(manual, svgFiles);
            downloadBlob(docxBlob, `${shortName}_Manual.docx`);
        } catch (error) {
            console.error('Error generating DOCX:', error);
            alert('Error al generar DOCX');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownloadAllSVGs = async () => {
        if (Object.keys(svgFiles).length === 0) {
            alert('No hay archivos SVG para descargar');
            return;
        }

        setIsGenerating(true);
        try {
            const zip = new JSZip();
            const svgFolder = zip.folder('archivos_corte');

            // Add each SVG to the zip
            Object.entries(svgFiles).forEach(([id, content]) => {
                const component = manual.componentes.find(c => c.id === id);
                const filename = component
                    ? `${sanitizeFilename(component.nombre, 15)}.svg`
                    : `comp_${id}.svg`;
                svgFolder?.file(filename, content);
            });

            // Generate and download zip
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            downloadBlob(zipBlob, `${shortName}_SVG.zip`);
        } catch (error) {
            console.error('Error generating ZIP:', error);
            alert('Error al generar archivo ZIP');
        } finally {
            setIsGenerating(false);
        }
    };

    const svgCount = Object.keys(svgFiles).length;

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>📥 Descargar Manual</h3>
            <div className={styles.buttonsGrid}>
                <button
                    onClick={handleDownloadPDF}
                    className={`btn btn-primary ${styles.downloadBtn}`}
                    disabled={isGenerating}
                >
                    {isGenerating ? (
                        <div className="spinner" />
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2" />
                            <polyline points="14 2 14 8 20 8" strokeWidth="2" />
                        </svg>
                    )}
                    Descargar PDF
                </button>

                <button
                    onClick={handleDownloadDOCX}
                    className={`btn btn-primary ${styles.downloadBtn}`}
                    disabled={isGenerating}
                >
                    {isGenerating ? (
                        <div className="spinner" />
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2" />
                            <polyline points="14 2 14 8 20 8" strokeWidth="2" />
                            <line x1="9" y1="15" x2="15" y2="15" strokeWidth="2" />
                        </svg>
                    )}
                    Descargar DOCX
                </button>

                {svgCount > 0 && (
                    <button
                        onClick={handleDownloadAllSVGs}
                        className={`btn btn-secondary ${styles.downloadBtn}`}
                        disabled={isGenerating}
                    >
                        {isGenerating ? (
                            <div className="spinner" />
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2" />
                                <polyline points="7 10 12 15 17 10" strokeWidth="2" />
                                <line x1="12" y1="15" x2="12" y2="3" strokeWidth="2" />
                            </svg>
                        )}
                        Descargar SVGs ({svgCount})
                    </button>
                )}
            </div>
        </div>
    );
}
