'use client';

import React from 'react';
import { Component } from '@/lib/types';
import { downloadSVG } from '@/lib/svg-generator';
import styles from './ComponentCard.module.css';

interface ComponentCardProps {
    component: Component;
    index: number;
    svgContent?: string;
}

export default function ComponentCard({ component, index, svgContent }: ComponentCardProps) {
    const [showPreview, setShowPreview] = React.useState(false);

    const handleDownloadSVG = () => {
        if (svgContent) {
            downloadSVG(svgContent, `${component.nombre.replace(/\s+/g, '_')}.svg`);
        }
    };

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.number}>{index + 1}</div>
                <h3>{component.nombre}</h3>
            </div>

            <p className={styles.description}>{component.descripcion}</p>

            <div className={styles.details}>
                {/* Dimensions */}
                <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>📐 Dimensiones:</span>
                    <span className={styles.detailValue}>
                        {component.dimensiones.largo && `${component.dimensiones.largo} ${component.dimensiones.unidad}`}
                        {component.dimensiones.ancho && ` × ${component.dimensiones.ancho} ${component.dimensiones.unidad}`}
                        {component.dimensiones.alto && ` × ${component.dimensiones.alto} ${component.dimensiones.unidad}`}
                        {component.dimensiones.diametro && `Ø ${component.dimensiones.diametro} ${component.dimensiones.unidad}`}
                        {component.dimensiones.espesor && ` (${component.dimensiones.espesor} ${component.dimensiones.unidad} espesor)`}
                    </span>
                </div>

                {/* Material */}
                <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>🧱 Material:</span>
                    <span className={styles.detailValue}>{component.material.tipo}</span>
                </div>

                <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>📊 Cantidad:</span>
                    <span className={styles.detailValue}>
                        {component.material.cantidad} {component.material.unidadCantidad}
                    </span>
                </div>

                {/* Process */}
                <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>⚙️ Proceso:</span>
                    <div className={styles.processTags}>
                        {component.proceso.map((proc, idx) => (
                            <span key={idx} className={styles.processTag}>
                                {proc}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Notes */}
                {component.notas && (
                    <div className={styles.notes}>
                        <span className={styles.detailLabel}>📝 Notas:</span>
                        <p>{component.notas}</p>
                    </div>
                )}

                {/* SVG Section */}
                {component.requiereArchivo && (
                    <div className={styles.svgSection}>
                        <div className={styles.svgHeader}>
                            <div className={styles.svgBadge}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2" />
                                    <polyline points="14 2 14 8 20 8" strokeWidth="2" />
                                </svg>
                                Archivo de corte
                            </div>
                        </div>

                        {svgContent && (
                            <>
                                <div className={styles.actions}>
                                    <button
                                        onClick={() => setShowPreview(!showPreview)}
                                        className={`btn ${styles.previewBtn}`}
                                    >
                                        {showPreview ? 'Ocultar vista previa' : 'Ver vista previa'}
                                    </button>

                                    <button
                                        onClick={handleDownloadSVG}
                                        className={`btn btn-secondary ${styles.downloadBtn}`}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2" strokeLinecap="round" />
                                            <polyline points="7 10 12 15 17 10" strokeWidth="2" strokeLinecap="round" />
                                            <line x1="12" y1="15" x2="12" y2="3" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        Descargar SVG
                                    </button>
                                </div>

                                {showPreview && (
                                    <div
                                        className={styles.previewContainer}
                                        dangerouslySetInnerHTML={{ __html: svgContent }}
                                    />
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
