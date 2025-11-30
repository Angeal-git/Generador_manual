'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { ProjectDimensions } from '@/lib/types';
import { useImagePreview } from '@/hooks/useImagePreview';
import { validateDimensions, validateSpecifications, validateForm } from '@/lib/validators';
import { XIcon, UploadIcon, LoaderIcon } from '@/components/icons';
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
    // Use custom hook for image management
    const { images, previews, addImages, removeImage, isValidating } = useImagePreview();

    const [frente, setFrente] = useState<string>('');
    const [fondo, setFondo] = useState<string>('');
    const [altura, setAltura] = useState<string>('');
    const [especificaciones, setEspecificaciones] = useState<string>('');

    // Validation errors
    const [errors, setErrors] = useState<{
        images?: string;
        dimensions?: string;
        specifications?: string;
    }>({});

    // Notify parent when previews change
    useEffect(() => {
        onImagesChange?.(previews);
    }, [previews, onImagesChange]);

    const handleImageChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const result = await addImages(files);

        if (result.errors.length > 0) {
            alert(result.errors.join('\n'));
        }

        // Clear image error if images were added successfully
        if (result.success && errors.images) {
            setErrors(prev => ({ ...prev, images: undefined }));
        }

        // Reset input
        e.target.value = '';
    }, [addImages, errors.images]);

    const handleRemoveImage = useCallback((id: string) => {
        removeImage(id);
    }, [removeImage]);

    const handleDimensionChange = useCallback((field: 'frente' | 'fondo' | 'altura', value: string) => {
        // Update the field
        if (field === 'frente') setFrente(value);
        else if (field === 'fondo') setFondo(value);
        else setAltura(value);

        // Clear dimension error when user starts typing
        if (errors.dimensions) {
            setErrors(prev => ({ ...prev, dimensions: undefined }));
        }
    }, [errors.dimensions]);

    const handleSpecificationsChange = useCallback((value: string) => {
        setEspecificaciones(value);

        // Clear specifications error when user starts typing
        if (errors.specifications) {
            setErrors(prev => ({ ...prev, specifications: undefined }));
        }
    }, [errors.specifications]);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();

        const dimensiones: ProjectDimensions = {
            frente: parseFloat(frente),
            fondo: parseFloat(fondo),
            altura: parseFloat(altura),
        };

        // Validate form
        const validation = validateForm({
            imagenes: images.map(img => img.file),
            dimensiones,
            especificaciones,
        });

        if (!validation.isValid) {
            setErrors(validation.errors);

            // Show first error in alert
            const firstError = Object.values(validation.errors)[0];
            if (firstError) {
                alert(firstError);
            }
            return;
        }

        // Clear errors and submit
        setErrors({});
        onSubmit({
            imagenes: images.map(img => img.file),
            dimensiones,
            especificaciones,
        });
    }, [frente, fondo, altura, especificaciones, images, onSubmit]);

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
                    🖼️ Renders del Proyecto {images.length > 0 && `(${images.length})`}
                </label>

                {/* Image Previews */}
                {previews.length > 0 && (
                    <div className={styles.previewGrid}>
                        {images.map((image) => (
                            <div key={image.id} className={styles.previewItem}>
                                <img src={image.preview} alt={`Preview ${image.file.name}`} />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(image.id)}
                                    className={styles.removeBtn}
                                    disabled={isLoading}
                                    title="Eliminar imagen"
                                >
                                    <XIcon width={16} height={16} />
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
                        disabled={isLoading || isValidating}
                        multiple
                    />
                    <label htmlFor="imagen" className={styles.uploadLabel}>
                        <div className={images.length > 0 ? styles.uploadPlaceholderSubtle : styles.uploadPlaceholder}>
                            <UploadIcon width={images.length > 0 ? 24 : 48} height={images.length > 0 ? 24 : 48} />
                            <p>{images.length > 0 ? 'Agregar más imágenes' : 'Haz clic o arrastra imágenes aquí'}</p>
                            <span className="text-muted">PNG, JPG o PDF • Múltiples archivos permitidos</span>
                        </div>
                    </label>
                </div>
                {errors.images && <p className={styles.error}>{errors.images}</p>}
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
                            onChange={(e) => handleDimensionChange('frente', e.target.value)}
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
                            onChange={(e) => handleDimensionChange('fondo', e.target.value)}
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
                            onChange={(e) => handleDimensionChange('altura', e.target.value)}
                            placeholder="250"
                            step="0.1"
                            min="0"
                            disabled={isLoading}
                            required
                        />
                    </div>
                </div>
                {errors.dimensions && <p className={styles.error}>{errors.dimensions}</p>}
            </div>

            {/* Specifications */}
            <div className={styles.formGroup}>
                <label htmlFor="especificaciones" className={styles.label}>
                    📝 Especificaciones del Proyecto
                </label>
                <textarea
                    id="especificaciones"
                    value={especificaciones}
                    onChange={(e) => handleSpecificationsChange(e.target.value)}
                    placeholder="Describe los materiales preferidos, acabados, tipo de iluminación, colores, y cualquier otra especificación importante...&#10;&#10;Ejemplo:&#10;- Material: MDF de 15mm&#10;- Acabado: Pintura blanca mate&#10;- Iluminación: LED blanco cálido&#10;- Logo en acrílico de 5mm con corte láser"
                    disabled={isLoading}
                    required
                />
                {errors.specifications && <p className={styles.error}>{errors.specifications}</p>}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className={`btn btn-primary ${styles.submitBtn}`}
                disabled={isLoading || isValidating}
            >
                {isLoading ? (
                    <>
                        <LoaderIcon width={20} height={20} className="spinner" />
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
        </form >
    );
}
