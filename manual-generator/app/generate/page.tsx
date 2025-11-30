'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import InputForm from '@/components/InputForm';
import { ProductionManual, ProjectDimensions } from '@/lib/types';
import styles from './page.module.css';

// Lazy load ManualViewer since it's only needed after generation
const ManualViewer = dynamic(() => import('@/components/ManualViewer'), {
    loading: () => (
        <div className="loading" style={{ padding: '2rem', textAlign: 'center' }}>
            <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto' }} />
            <p style={{ marginTop: '1rem' }}>Cargando visor...</p>
        </div>
    ),
    ssr: false
});

export default function GeneratePage() {
    const [manual, setManual] = useState<ProductionManual | null>(null);
    const [svgFiles, setSvgFiles] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const handleSubmit = async (data: {
        imagenes: File[];
        dimensiones: ProjectDimensions;
        especificaciones: string;
    }) => {
        setIsLoading(true);
        setError('');
        setManual(null);

        try {
            const formData = new FormData();
            data.imagenes.forEach((imagen, index) => {
                formData.append(`imagen_${index}`, imagen);
            });
            formData.append('imageCount', data.imagenes.length.toString());
            formData.append('frente', data.dimensiones.frente.toString());
            formData.append('fondo', data.dimensiones.fondo.toString());
            formData.append('altura', data.dimensiones.altura.toString());
            formData.append('especificaciones', data.especificaciones);

            const response = await fetch('/api/generate-manual', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Error al generar el manual');
            }

            setManual(result.manual);
            setSvgFiles(result.svgFiles || {});

            setTimeout(() => {
                document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);

        } catch (err: any) {
            console.error('Error:', err);
            setError(err.message || 'Ocurrió un error al generar el manual. Por favor intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setManual(null);
        setSvgFiles({});
        setError('');
        setImagePreviews([]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <main className={styles.main}>
            <div className={`container ${styles.formView}`}>
                <div className={styles.backButton}>
                    <Link href="/" className="btn btn-secondary">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M19 12H5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Volver al Inicio
                    </Link>
                </div>

                <div className={styles.hero}>
                    <img src="/logo.png" alt="StandGenius" className={styles.logo} />
                    <p className={styles.subtitle}>
                        Sube tu render y obtén un manual de producción detallado con IA
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="error fade-in">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {/* Uploaded Images Preview */}
                {Array.isArray(imagePreviews) && imagePreviews.length > 0 && (
                    <div className={styles.imagesPreviewSection}>
                        <h3 className={styles.imagesSectionTitle}>📸 Imágenes del Proyecto</h3>
                        <div className={styles.imagesGrid}>
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className={styles.imagePreviewItem}>
                                    <img src={preview} alt={`Render ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input Form */}
                {!manual && (
                    <div className={styles.formSection}>
                        <InputForm
                            onSubmit={handleSubmit}
                            isLoading={isLoading}
                            onImagesChange={setImagePreviews}
                        />
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className={`${styles.loadingSection} fade-in`}>
                        <div className="loading">
                            <div className="spinner" style={{ width: '40px', height: '40px' }} />
                            <div>
                                <h3>Generando manual de producción...</h3>
                                <p className="text-muted">
                                    La IA está analizando tu render y calculando especificaciones. Esto puede tomar un tiempo.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Results */}
                {manual && !isLoading && (
                    <div id="results" className={styles.resultsSection}>
                        <ManualViewer manual={manual} svgFiles={svgFiles} />

                        <div className={styles.resetSection}>
                            <button onClick={handleReset} className="btn btn-secondary">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <polyline points="1 4 1 10 7 10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Generar otro manual
                            </button>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <footer className={styles.footer}>
                    <p>
                        StandGenius • Powered by{' '}
                        <strong>Gemini 2.5 Pro</strong>
                    </p>
                </footer>
            </div>
        </main>
    );
}
