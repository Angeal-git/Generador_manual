'use client';

import React, { useState } from 'react';
import { ProjectDimensions } from '@/lib/types';
import styles from './InputForm.module.css';

interface InputFormProps {
    onSubmit: (data: {
        imagenes: File[];
        dimensiones: ProjectDimensions;
        especificaciones: string;
    }) => void;
    isLoading: boolean;
    onImagesChange?: (previews: string[]) => void;
}

export default function InputForm({ onSubmit, isLoading, onImagesChange }: InputFormProps) {
    const [imagenes, setImagenes] = useState<File[]>([]);
    const [imagenesPreview, setImagenesPreview] = useState<string[]>([]);
    const [frente, setFrente] = useState<string>('');
    const [fondo, setFondo] = useState<string>('');
    const [altura, setAltura] = useState<string>('');
    const [especificaciones, setEspecificaciones] = useState<string>('');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            // Filter for images and PDFs only
            const validFiles = files.filter(file =>
                file.type.startsWith('image/') || file.type === 'application/pdf'
            );

            if (validFiles.length !== files.length) {
                alert('Solo se permiten archivos de imagen y PDF.');
            }

            if (validFiles.length > 0) {
                // Add new files to existing ones
                const newImagenes = [...imagenes, ...validFiles];
                setImagenes(newImagenes);

                // Generate previews for new files
                const newPreviews: string[] = [];
                let loadedCount = 0;

                validFiles.forEach(file => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        newPreviews.push(reader.result as string);
                        loadedCount++;

                        // When all new previews are loaded, update state and notify parent
                        if (loadedCount === validFiles.length) {
                            const allPreviews = [...imagenesPreview, ...newPreviews];
                            setImagenesPreview(allPreviews);
                            onImagesChange?.(allPreviews);
                        }
                    };
                    reader.readAsDataURL(file);
                });

                // Reset input value to allow selecting the same file again
                e.target.value = '';
            }
        }
    };

    const handleRemoveImage = (index: number) => {
        const newPreviews = imagenesPreview.filter((_, i) => i !== index);
        setImagenes(prev => prev.filter((_, i) => i !== index));
        setImagenesPreview(newPreviews);
        onImagesChange?.(newPreviews);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (imagenes.length === 0) {
            alert('Por favor sube al menos una imagen del render');
            return;
        }

        if (!frente || !fondo || !altura) {
            alert('Por favor completa todas las dimensiones');
            return;
        }

        if (!especificaciones.trim()) {
            alert('Por favor proporciona las especificaciones del proyecto');
            return;
        }

        onSubmit({
            imagenes,
            dimensiones: {
                frente: parseFloat(frente),
                fondo: parseFloat(fondo),
                altura: parseFloat(altura),
            },
            especificaciones,
        });
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.header}>
                <h2>📋 Información del Proyecto</h2>
                <p className="text-muted">
                    Proporciona los detalles de tu proyecto para generar el manual de producción
                </p>
            </div>

            {/* Image Upload */}
            <div className={styles.formGroup}>
                <label htmlFor="imagen" className={styles.label}>
                    🖼️ Renders del Proyecto {imagenes.length > 0 && `(${imagenes.length})`}
                </label>

                {/* Image Previews */}
                {imagenesPreview.length > 0 && (
                    <div className={styles.previewGrid}>
                        {imagenesPreview.map((preview, index) => (
                            <div key={index} className={styles.previewItem}>
                                <img src={preview} alt={`Preview ${index + 1}`} />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className={styles.removeBtn}
                                    disabled={isLoading}
                                    title="Eliminar imagen"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round" />
                                        <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Upload Button */}
                <div className={styles.uploadArea}>
                    <input
                        type="file"
                        id="imagen"
                        accept="image/*,.pdf"
                        onChange={handleImageChange}
                        className={styles.fileInput}
                        disabled={isLoading}
                        multiple
                    />
                    <label htmlFor="imagen" className={styles.uploadLabel}>
                        <div className={imagenes.length > 0 ? styles.uploadPlaceholderSubtle : styles.uploadPlaceholder}>
                            <svg width={imagenes.length > 0 ? "24" : "48"} height={imagenes.length > 0 ? "24" : "48"} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <polyline points="17 8 12 3 7 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <line x1="12" y1="3" x2="12" y2="15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <p>{imagenes.length > 0 ? 'Agregar más imágenes' : 'Haz clic o arrastra imágenes aquí'}</p>
                            <span className="text-muted">PNG, JPG o PDF • Múltiples archivos permitidos</span>
                        </div>
                    </label>
                </div>
            </div>

            {/* Dimensions */}
            <div className={styles.formGroup}>
                <label className={styles.label}>📏 Dimensiones Generales (cm)</label>
                <div className={styles.dimensionsGrid}>
                    <div>
                        <label htmlFor="frente" className={styles.sublabel}>Frente</label>
                        <input
                            type="number"
                            id="frente"
                            value={frente}
                            onChange={(e) => setFrente(e.target.value)}
                            placeholder="200"
                            step="0.1"
                            min="0"
                            disabled={isLoading}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="fondo" className={styles.sublabel}>Fondo</label>
                        <input
                            type="number"
                            id="fondo"
                            value={fondo}
                            onChange={(e) => setFondo(e.target.value)}
                            placeholder="100"
                            step="0.1"
                            min="0"
                            disabled={isLoading}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="altura" className={styles.sublabel}>Altura</label>
                        <input
                            type="number"
                            id="altura"
                            value={altura}
                            onChange={(e) => setAltura(e.target.value)}
                            placeholder="250"
                            step="0.1"
                            min="0"
                            disabled={isLoading}
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Specifications */}
            <div className={styles.formGroup}>
                <label htmlFor="especificaciones" className={styles.label}>
                    📝 Especificaciones del Proyecto
                </label>
                <textarea
                    id="especificaciones"
                    value={especificaciones}
                    onChange={(e) => setEspecificaciones(e.target.value)}
                    placeholder="Describe los materiales preferidos, acabados, tipo de iluminación, colores, y cualquier otra especificación importante...&#10;&#10;Ejemplo:&#10;- Material: MDF de 15mm&#10;- Acabado: Pintura blanca mate&#10;- Iluminación: LED blanco cálido&#10;- Logo en acrílico de 5mm con corte láser"
                    disabled={isLoading}
                    required
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className={`btn btn-primary ${styles.submitBtn}`}
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <div className="spinner" />
                        Generando manual...
                    </>
                ) : (
                    <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Generar Manual de Producción
                    </>
                )}
            </button>
        </form>
    );
}
