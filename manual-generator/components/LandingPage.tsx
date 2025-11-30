'use client';

import Link from 'next/link';
import styles from './LandingPage.module.css';

export default function LandingPage() {
    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className={styles.landing}>
            {/* Navigation Header */}
            <header className={styles.header}>
                <div className="container">
                    <nav className={styles.nav}>
                        <img src="/logo.png" alt="StandGenius" className={styles.navLogo} />
                        <div className={styles.navLinks}>
                            <button onClick={() => scrollToSection('caracteristicas')} className={styles.navLink}>
                                Características
                            </button>
                            <button onClick={() => scrollToSection('como-funciona')} className={styles.navLink}>
                                Cómo Funciona
                            </button>
                            <button onClick={() => scrollToSection('materiales')} className={styles.navLink}>
                                Materiales
                            </button>
                            <Link href="/generate" className="btn btn-primary">
                                Comenzar
                            </Link>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className={styles.hero}>
                <div className="container">
                    <div className={styles.heroContent}>
                        <div className={styles.badge}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 17l10 5 10-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 12l10 5 10-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Powered by AI</span>
                        </div>
                        <h1 className={styles.heroTitle}>
                            Generación Automática de<br />
                            Manuales de Producción
                        </h1>
                        <p className={styles.heroSubtitle}>
                            Transforma tus diseños de stands y exhibiciones en manuales de fabricación
                            detallados con materiales, dimensiones y archivos de corte en segundos.
                        </p>
                        <div className={styles.heroCta}>
                            <Link href="/generate" className="btn btn-primary">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <polyline points="14 2 14 8 20 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Generar Manual
                            </Link>

                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="caracteristicas" className={styles.features}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <h2>Características Principales</h2>
                        <p>Todo lo que necesitas para crear manuales de producción profesionales</p>
                    </div>
                    <div className={styles.featuresGrid}>
                        <div className={`${styles.featureCard} ${styles.fadeIn}`}>
                            <div className={styles.featureIcon}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <polyline points="17 8 12 3 7 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <line x1="12" y1="3" x2="12" y2="15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h3>Sube tu Render</h3>
                            <p>Carga imágenes o PDFs de tus diseños junto con las dimensiones generales del proyecto.</p>
                        </div>

                        <div className={`${styles.featureCard} ${styles.fadeIn}`} style={{ animationDelay: '0.1s' }}>
                            <div className={styles.featureIcon}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h3>Análisis Inteligente</h3>
                            <p>La IA analiza tu diseño, identifica componentes y calcula dimensiones proporcionales automáticamente.</p>
                        </div>

                        <div className={`${styles.featureCard} ${styles.fadeIn}`} style={{ animationDelay: '0.2s' }}>
                            <div className={styles.featureIcon}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <polyline points="14 2 14 8 20 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <line x1="16" y1="13" x2="8" y2="13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <line x1="16" y1="17" x2="8" y2="17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h3>Manual Completo</h3>
                            <p>Recibe un desglose detallado de materiales, dimensiones, consumibles y archivos vectoriales para corte.</p>
                        </div>

                        <div className={`${styles.featureCard} ${styles.fadeIn}`} style={{ animationDelay: '0.3s' }}>
                            <div className={styles.featureIcon}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <ellipse cx="12" cy="5" rx="9" ry="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h3>Base de Materiales</h3>
                            <p>Gestiona tu catálogo de materiales para que la IA los considere en las recomendaciones.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="como-funciona" className={styles.howItWorks}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <h2>Cómo Funciona</h2>
                        <p>Tres simples pasos para obtener tu manual de producción</p>
                    </div>
                    <div className={styles.stepsContainer}>
                        <div className={`${styles.step} ${styles.fadeIn}`}>
                            <div className={styles.stepNumber}>1</div>
                            <div className={styles.stepContent}>
                                <h3>Entrada de Datos</h3>
                                <p>Sube el render de tu diseño, ingresa las medidas totales del proyecto en centímetros (Frente, Fondo, Altura) y especifica materiales y acabados preferidos.</p>
                            </div>
                        </div>

                        <div className={`${styles.step} ${styles.fadeIn}`} style={{ animationDelay: '0.15s' }}>
                            <div className={styles.stepNumber}>2</div>
                            <div className={styles.stepContent}>
                                <h3>Procesamiento IA</h3>
                                <p>Nuestra IA analiza el render, identifica componentes estructurales, calcula proporciones y aplica las especificaciones solicitadas.</p>
                            </div>
                        </div>

                        <div className={`${styles.step} ${styles.fadeIn}`} style={{ animationDelay: '0.3s' }}>
                            <div className={styles.stepNumber}>3</div>
                            <div className={styles.stepContent}>
                                <h3>Manual de Producción</h3>
                                <p>Obtén un manual detallado con cada componente listado, materiales calculados, consumibles necesarios y archivos SVG para corte CNC.</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.ctaSection}>
                        <Link href="/generate" className="btn btn-primary">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M5 12h14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Comenzar Ahora
                        </Link>
                    </div>
                </div>
            </section>

            {/* Materials Section Placeholder */}
            <section id="materiales" className={styles.materialsSection}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <h2>Base de Materiales</h2>
                        <p>Gestiona tu catálogo de materiales para obtener recomendaciones precisas</p>
                    </div>
                    <div className={styles.materialsPlaceholder}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <line x1="12" y1="8" x2="12" y2="16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <line x1="8" y1="12" x2="16" y2="12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p>Próximamente: Gestión de catálogo de materiales</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
