'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { MATERIALS_CATALOG, getMaterialType } from '@/lib/materialsCatalog';

interface Material {
    id: string;
    nombre: string;
    tipo: string;
    unidad: string;
    precioPorUnidad: number;
    proveedor?: string;
    especificaciones?: string;
    enStock: boolean;
}

export default function MaterialsPage() {
    const router = useRouter();
    const [materials, setMaterials] = useState<Material[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
    const [formData, setFormData] = useState({
        nombre: '',
        tipo: 'Madera',
        unidad: 'm²',
        precioPorUnidad: '',
        proveedor: '',
        especificaciones: '',
        enStock: true
    });

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        try {
            const response = await fetch('/api/materials');
            const data = await response.json();
            if (data.success) {
                setMaterials(data.materials);
            }
        } catch (error) {
            console.error('Error fetching materials:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingMaterial
                ? `/api/materials/${editingMaterial.id}`
                : '/api/materials';

            const method = editingMaterial ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    precioPorUnidad: parseFloat(formData.precioPorUnidad)
                })
            });

            const data = await response.json();

            if (data.success) {
                await fetchMaterials();
                handleCloseModal();
            }
        } catch (error) {
            console.error('Error saving material:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este material?')) return;

        try {
            const response = await fetch(`/api/materials/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await fetchMaterials();
            }
        } catch (error) {
            console.error('Error deleting material:', error);
        }
    };

    const handleEdit = (material: Material) => {
        setEditingMaterial(material);
        setFormData({
            nombre: material.nombre,
            tipo: material.tipo,
            unidad: material.unidad,
            precioPorUnidad: material.precioPorUnidad.toString(),
            proveedor: material.proveedor || '',
            especificaciones: material.especificaciones || '',
            enStock: material.enStock
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingMaterial(null);
        setFormData({
            nombre: '',
            tipo: '',
            unidad: 'm²',
            precioPorUnidad: '',
            proveedor: '',
            especificaciones: '',
            enStock: true
        });
    };

    const handleMaterialSelect = (materialName: string) => {
        if (materialName) {
            const tipo = getMaterialType(materialName);
            setFormData({
                ...formData,
                nombre: materialName,
                tipo: tipo
            });
        }
    };

    const getBadgeClass = (tipo: string) => {
        const tipoLower = tipo.toLowerCase();
        if (tipoLower.includes('madera')) return styles.badgeMadera;
        if (tipoLower.includes('metal')) return styles.badgeMetal;
        if (tipoLower.includes('iluminacion') || tipoLower.includes('luz')) return styles.badgeIluminacion;
        if (tipoLower.includes('acabado') || tipoLower.includes('pintura')) return styles.badgeAcabados;
        if (tipoLower.includes('vidrio') || tipoLower.includes('cristal')) return styles.badgeVidrio;
        return styles.badgeOtro;
    };

    return (
        <main className={styles.materialsPage}>
            <div className="container">
                <div className={styles.backButton}>
                    <button onClick={() => router.push('/')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M19 12H5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Volver
                    </button>
                </div>

                <div className={styles.header}>
                    <h1>Base de Datos de Materiales</h1>
                    <p>Gestiona los materiales disponibles para que la IA los considere en las sugerencias de fabricación.</p>
                </div>

                <div className={styles.materialsCard}>
                    <div className={styles.cardHeader}>
                        <div>
                            <div className={styles.cardTitle}>Materiales Disponibles</div>
                            <div className={styles.cardSubtitle}>
                                {materials.length} {materials.length === 1 ? 'material' : 'materiales'} en la base de datos
                            </div>
                        </div>
                        <button className={styles.addButton} onClick={() => setShowModal(true)}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <line x1="12" y1="5" x2="12" y2="19" strokeWidth="2" strokeLinecap="round" />
                                <line x1="5" y1="12" x2="19" y2="12" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            Agregar Material
                        </button>
                    </div>

                    {isLoading ? (
                        <div className={styles.loading}>
                            <div className="spinner" style={{ width: '40px', height: '40px' }} />
                            <p>Cargando materiales...</p>
                        </div>
                    ) : materials.length === 0 ? (
                        <div className={styles.emptyState}>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
                                <line x1="12" y1="8" x2="12" y2="16" strokeWidth="2" strokeLinecap="round" />
                                <line x1="8" y1="12" x2="16" y2="12" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <h3>No hay materiales registrados</h3>
                            <p>Agrega tu primer material para comenzar</p>
                        </div>
                    ) : (
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Material</th>
                                        <th>Categoría</th>
                                        <th>Precio</th>
                                        <th>Proveedor</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {materials.map((material) => (
                                        <tr key={material.id}>
                                            <td>
                                                <div className={styles.materialName}>{material.nombre}</div>
                                                {material.especificaciones && (
                                                    <div className={styles.materialSpecs}>{material.especificaciones}</div>
                                                )}
                                            </td>
                                            <td>
                                                <span className={`${styles.badge} ${getBadgeClass(material.tipo)}`}>
                                                    {material.tipo}
                                                </span>
                                            </td>
                                            <td>${material.precioPorUnidad.toFixed(2)} / {material.unidad}</td>
                                            <td>{material.proveedor || '-'}</td>
                                            <td>
                                                <div className={styles.actions}>
                                                    <button
                                                        className={styles.iconButton}
                                                        onClick={() => handleEdit(material)}
                                                        title="Editar"
                                                    >
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        className={`${styles.iconButton} ${styles.delete}`}
                                                        onClick={() => handleDelete(material.id)}
                                                        title="Eliminar"
                                                    >
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                            <polyline points="3 6 5 6 21 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className={styles.modalOverlay} onClick={handleCloseModal}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>{editingMaterial ? 'Editar Material' : 'Nuevo Material'}</h2>
                        </div>
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label>Material *</label>
                                <select
                                    value={formData.nombre}
                                    onChange={(e) => handleMaterialSelect(e.target.value)}
                                    required
                                    className={styles.materialSelect}
                                >
                                    <option value="">-- Selecciona un material --</option>
                                    {Object.entries(MATERIALS_CATALOG).map(([categoria, materiales]) => (
                                        <optgroup key={categoria} label={categoria}>
                                            {materiales.map((material) => (
                                                <option key={material} value={material}>
                                                    {material}
                                                </option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Tipo * (Auto-asignado)</label>
                                <input
                                    type="text"
                                    value={formData.tipo}
                                    readOnly
                                    className={styles.readOnlyInput}
                                    placeholder="Se asigna automáticamente"
                                />
                                <small className={styles.helpText}>
                                    El tipo se asigna automáticamente según el material seleccionado
                                </small>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Unidad *</label>
                                <select
                                    value={formData.unidad}
                                    onChange={(e) => setFormData({ ...formData, unidad: e.target.value })}
                                    required
                                >
                                    <option value="m²">m² (metro cuadrado)</option>
                                    <option value="ml">ml (metro lineal)</option>
                                    <option value="pieza">pieza</option>
                                    <option value="kg">kg (kilogramo)</option>
                                    <option value="litro">litro</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Precio por Unidad *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.precioPorUnidad}
                                    onChange={(e) => setFormData({ ...formData, precioPorUnidad: e.target.value })}
                                    required
                                    placeholder="0.00"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Proveedor</label>
                                <input
                                    type="text"
                                    value={formData.proveedor}
                                    onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
                                    placeholder="ej. Maderas del Norte"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Especificaciones</label>
                                <textarea
                                    value={formData.especificaciones}
                                    onChange={(e) => setFormData({ ...formData, especificaciones: e.target.value })}
                                    placeholder="Detalles adicionales del material..."
                                    rows={3}
                                />
                            </div>

                            <div className={styles.formActions}>
                                <button type="button" className={styles.cancelButton} onClick={handleCloseModal}>
                                    Cancelar
                                </button>
                                <button type="submit" className={styles.submitButton}>
                                    {editingMaterial ? 'Actualizar' : 'Crear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
