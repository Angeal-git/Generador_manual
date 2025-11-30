'use client';

import { useState } from 'react';
import InputForm from '@/components/InputForm';
import ManualViewer from '@/components/ManualViewer';
import LandingPage from '@/components/LandingPage';
import { ProductionManual, ProjectDimensions } from '@/lib/types';
import styles from './page.module.css';

export default function Home() {
    const [showLanding, setShowLanding] = useState(true);
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
            // Create FormData
            const formData = new FormData();

            // Append all images
            data.imagenes.forEach((imagen, index) => {
                formData.append(`imagen_${index}`, imagen);
            });
            formData.append('imageCount', data.imagenes.length.toString());

            formData.append('frente', data.dimensiones.frente.toString());
            formData.append('fondo', data.dimensiones.fondo.toString());
            formData.append('altura', data.dimensiones.altura.toString());
            formData.append('especificaciones', data.especificaciones);

            // Call API
            const response = await fetch('/api/generate-manual', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Error al generar el manual');
            }

            // Set manual and SVG files
            setManual(result.manual);
            setSvgFiles(result.svgFiles || {});

            // Scroll to results
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

    const handleStartGeneration = () => {
        setShowLanding(false);
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    };

    const handleBackToLanding = () => {
        setShowLanding(true);
        setManual(null);
        setSvgFiles({});
        setError('');
        setImagePreviews([]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <main className={styles.main}>
            {showLanding ? (
                <LandingPage onStart={handleStartGeneration} />
            ) : (
                <div className={`${styles.formView} fade-in`}>
                    <div className="container">
                        {/* Back Button */}
                        <div className={styles.backButton}>
                            <button onClick={handleBackToLanding} className="btn btn-secondary">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M19 12H5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Volver
                            </button>
                        </div>

                        {/* Hero Section */}
                        <div className={styles.hero}>
                            <img src="/logo.png" alt="StandGenius" className={styles.logo} />
                            <p className={styles.subtitle}>
                                Sube el render de tu proyecto y obtén un manual de producción completo con IA
                            </p>
                            <div className={styles.features}>
                                <div className={styles.feature}>
                                    <span className={styles.featureIcon}>🤖</span>
                                    <span>Análisis con IA</span>
                                </div>
                                <div className={styles.feature}>
                                    <span className={styles.featureIcon}>📐</span>
                                    <span>Dimensiones precisas</span>
                                </div>
                                <div className={styles.feature}>
                                    <span className={styles.featureIcon}>📄</span>
                                    <span>Archivos de corte</span>
                                </div>
                                <div className={styles.feature}>
                                    <span className={styles.featureIcon}>💾</span>
                                    <span>Descarga PDF/DOCX</span>
                                </div>
                            </div>
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
                </div>
            )}
        </main>
    );
}
