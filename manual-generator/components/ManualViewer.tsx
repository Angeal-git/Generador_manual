'use client';

import React from 'react';
import { ProductionManual } from '@/lib/types';
import ComponentCard from './ComponentCard';
import DownloadButtons from './DownloadButtons';
import styles from './ManualViewer.module.css';

interface ManualViewerProps {
    manual: ProductionManual;
    svgFiles: { [key: string]: string };
}

export default function ManualViewer({ manual, svgFiles }: ManualViewerProps) {
    return (
        <div className={styles.viewer}>
            {/* Header */}
            <div className={styles.header}>
                <h1>✅ Manual de Producción Generado</h1>
                <p className="text-muted">
                    Manual completo con especificaciones técnicas y archivos de fabricación
                </p>
            </div>

            {/* Download Buttons */}
            <DownloadButtons manual={manual} svgFiles={svgFiles} />

            {/* Project Info */}
            <div className={`${styles.section} ${styles.projectInfo}`}>
                <h2>📦 {manual.proyecto.nombre}</h2>
                <p>{manual.proyecto.descripcion}</p>

                <div className={styles.dimensions}>
                    <div className={styles.dimensionCard}>
                        <span className={styles.dimensionLabel}>Frente</span>
                        <span className={styles.dimensionValue}>
                            {manual.proyecto.dimensionesGenerales.frente} cm
                        </span>
                    </div>
                    <div className={styles.dimensionCard}>
                        <span className={styles.dimensionLabel}>Fondo</span>
                        <span className={styles.dimensionValue}>
                            {manual.proyecto.dimensionesGenerales.fondo} cm
                        </span>
                    </div>
                    <div className={styles.dimensionCard}>
                        <span className={styles.dimensionLabel}>Altura</span>
                        <span className={styles.dimensionValue}>
                            {manual.proyecto.dimensionesGenerales.altura} cm
                        </span>
                    </div>
                </div>

                <div className={styles.metadata}>
                    <span>📅 {manual.fechaGeneracion}</span>
                </div>
            </div>

            {/* Components */}
            <div className={styles.section}>
                <h2>🔧 Componentes de Fabricación</h2>
                <p className="text-muted mb-lg">
                    {manual.componentes.length} componente(s) identificado(s)
                </p>

                <div className={styles.componentsGrid}>
                    {manual.componentes.map((componente, index) => (
                        <ComponentCard
                            key={componente.id}
                            component={componente}
                            index={index}
                            svgContent={svgFiles[componente.id]}
                        />
                    ))}
                </div>
            </div>

            {/* Consumables */}
            {manual.consumibles.length > 0 && (
                <div className={styles.section}>
                    <h2>🛠️ Consumibles</h2>
                    <p className="text-muted mb-lg">
                        Materiales adicionales necesarios para el proyecto
                    </p>

                    <div className={styles.consumablesGrid}>
                        {manual.consumibles.map((consumible) => (
                            <div key={consumible.id} className={styles.consumableCard}>
                                <div className={styles.consumableHeader}>
                                    <span className={styles.consumableIcon}>
                                        {consumible.tipo === 'iluminacion' && '💡'}
                                        {consumible.tipo === 'pintura' && '🎨'}
                                        {consumible.tipo === 'adhesivo' && '🔗'}
                                        {consumible.tipo === 'tornilleria' && '🔩'}
                                        {consumible.tipo === 'otro' && '📦'}
                                    </span>
                                    <h3>{consumible.nombre}</h3>
                                </div>
                                <div className={styles.consumableDetails}>
                                    <div className={styles.consumableQuantity}>
                                        <strong>{consumible.cantidad}</strong> {consumible.unidad}
                                    </div>
                                    <p className="text-muted">{consumible.especificaciones}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Assembly Sequence */}
            {manual.secuenciaEnsamblaje && manual.secuenciaEnsamblaje.length > 0 && (
                <div className={styles.section}>
                    <h2>🔨 Secuencia de Ensamblaje</h2>
                    <p className="text-muted mb-lg">
                        Pasos sugeridos para el ensamblaje del proyecto
                    </p>

                    <div className={styles.assemblyList}>
                        {manual.secuenciaEnsamblaje.map((paso, index) => (
                            <div key={index} className={styles.assemblyStep}>
                                <div className={styles.stepNumber}>{index + 1}</div>
                                <p>{paso}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* General Notes */}
            {manual.notasGenerales && manual.notasGenerales.length > 0 && (
                <div className={styles.section}>
                    <h2>📌 Notas Generales</h2>
                    <ul className={styles.notesList}>
                        {manual.notasGenerales.map((nota, index) => (
                            <li key={index}>{nota}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
