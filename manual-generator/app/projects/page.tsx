'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

interface ProjectSummary {
    id: string;
    nombre: string;
    descripcion: string | null;
    dimensionesFrente: number;
    dimensionesFondo: number;
    dimensionesAltura: number;
    costoTotal: number;
    createdAt: string;
}

export default function ProjectsPage() {
    const router = useRouter();
    const [projects, setProjects] = useState<ProjectSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch('/api/projects');
            const data = await response.json();

            if (data.success) {
                setProjects(data.projects);
            } else {
                setError('Error al cargar proyectos');
            }
        } catch (err) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, nombre: string) => {
        if (!confirm(`¿Eliminar el proyecto "${nombre}"?`)) return;

        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setProjects(projects.filter(p => p.id !== id));
            } else {
                alert('Error al eliminar proyecto');
            }
        } catch (err) {
            alert('Error de conexión');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount);
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Cargando proyectos...</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1>Proyectos Guardados</h1>
                    <button
                        className={styles.backButton}
                        onClick={() => router.push('/')}
                    >
                        ← Volver al Inicio
                    </button>
                </div>
            </header>

            {error && (
                <div className={styles.error}>{error}</div>
            )}

            {projects.length === 0 ? (
                <div className={styles.empty}>
                    <div className={styles.emptyIcon}>📁</div>
                    <h2>No hay proyectos guardados</h2>
                    <p>Los manuales que generes y guardes aparecerán aquí</p>
                    <button
                        className={styles.generateButton}
                        onClick={() => router.push('/generate')}
                    >
                        Generar Manual
                    </button>
                </div>
            ) : (
                <div className={styles.grid}>
                    {projects.map((project) => (
                        <div key={project.id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h3>{project.nombre}</h3>
                                <button
                                    className={styles.deleteButton}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(project.id, project.nombre);
                                    }}
                                    title="Eliminar proyecto"
                                >
                                    🗑️
                                </button>
                            </div>

                            {project.descripcion && (
                                <p className={styles.description}>
                                    {project.descripcion}
                                </p>
                            )}

                            <div className={styles.metadata}>
                                <div className={styles.metadataItem}>
                                    <span className={styles.label}>Dimensiones:</span>
                                    <span className={styles.value}>
                                        {project.dimensionesFrente} × {project.dimensionesFondo} × {project.dimensionesAltura} cm
                                    </span>
                                </div>

                                <div className={styles.metadataItem}>
                                    <span className={styles.label}>Costo Total:</span>
                                    <span className={styles.cost}>
                                        {formatCurrency(project.costoTotal)}
                                    </span>
                                </div>

                                <div className={styles.metadataItem}>
                                    <span className={styles.label}>Creado:</span>
                                    <span className={styles.value}>
                                        {formatDate(project.createdAt)}
                                    </span>
                                </div>
                            </div>

                            <button
                                className={styles.viewButton}
                                onClick={() => router.push(`/projects/${project.id}`)}
                            >
                                Ver Detalles →
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
