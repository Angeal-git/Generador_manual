'use client';

import styles from './CostBreakdown.module.css';
import { CostBreakdown as CostBreakdownType, formatCurrency } from '@/lib/costCalculator';

interface CostBreakdownProps {
    costs: CostBreakdownType;
}

export default function CostBreakdown({ costs }: CostBreakdownProps) {
    return (
        <div className={styles.costBreakdown}>
            <div className={styles.header}>
                <h3>💰 Desglose de Costos de Materiales</h3>
                <div className={styles.totalBadge}>
                    Total: {formatCurrency(costs.total)}
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Material</th>
                            <th>Cantidad Requerida</th>
                            <th>Unidades a Comprar</th>
                            <th>Precio Unitario</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {costs.materiales.map((material, index) => (
                            <tr key={index}>
                                <td className={styles.materialName}>{material.nombre}</td>
                                <td>
                                    {material.cantidadRequerida.toFixed(2)} {material.unidadMedida}
                                </td>
                                <td className={styles.units}>
                                    {material.unidadesNecesarias} {material.unidadVenta}
                                    {material.unidadesNecesarias > 1 ? 's' : ''}
                                </td>
                                <td>{formatCurrency(material.precioPorUnidad)}</td>
                                <td className={styles.subtotal}>
                                    {formatCurrency(material.costoTotal)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className={styles.totalRow}>
                            <td colSpan={4}>
                                <strong>TOTAL</strong>
                            </td>
                            <td className={styles.totalAmount}>
                                <strong>{formatCurrency(costs.total)}</strong>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div className={styles.note}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <line x1="12" y1="16" x2="12" y2="12" strokeWidth="2" strokeLinecap="round" />
                    <line x1="12" y1="8" x2="12.01" y2="8" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span>
                    Los precios son estimados y pueden variar según el proveedor.
                    Las cantidades se redondean hacia arriba para asegurar material suficiente.
                </span>
            </div>
        </div>
    );
}
