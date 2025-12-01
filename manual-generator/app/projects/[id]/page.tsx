'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ManualViewer from '@/components/ManualViewer';
import styles from './page.module.css';

interface ProjectDetailsProps {
    params: {
        id: string;
    };
}

export default function ProjectDetailsPage({ params }: ProjectDetailsProps) {
    const router = useRouter();
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProject();
    }, [params.id]);

    const fetchProject = async () => {
        try {
            const response = await fetch(`/api/projects/${params.id}`);
            const data = await response.json();

            if (data.success) {
                setProject(data.project);
            } else {
                setError('Proyecto no encontrado');
            }
        } catch (err) {
            setError('Error al cargar el proyecto');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm(`¿Eliminar el proyecto "${project.nombre}"?`)) return;

        try {
            const response = await fetch(`/api/projects/${params.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                router.push('/projects');
            } else {
                alert('Error al eliminar proyecto');
            }
        } catch (err) {
            alert('Error de conexión');
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Cargando proyecto...</div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    {error || 'Proyecto no encontrado'}
                    <button
                        className={styles.backButton}
                        onClick={() => router.push('/projects')}
                    >
                        ← Volver a Proyectos
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button
                    className={styles.backButton}
                    onClick={() => router.push('/projects')}
                >
                    ← Volver a Proyectos
                </button>
                <button
                    className={styles.deleteButton}
                    onClick={handleDelete}
                >
                    🗑️ Eliminar Proyecto
                </button>
            </header>

            {/* Imágenes guardadas (si existen) */}
            {Array.isArray(project.imageUrls) && project.imageUrls.length > 0 && (
                <div className={styles.imagesPreviewSection}>
                    <h3 className={styles.imagesSectionTitle}>📸 Imágenes del Proyecto</h3>
                    <div className={styles.imagesGrid}>
                        {project.imageUrls.map((src: string, idx: number) => (
                            <div key={idx} className={styles.imagePreviewItem}>
                                <img src={src} alt={`Imagen ${idx + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className={styles.content}>
                <ManualViewer
                    manual={project.manualData}
                    svgFiles={project.svgFiles || {}}
                    costs={project.costsData || null} // Pasar datos de costos guardados
                />
            </div>
        </div>
    );
}
