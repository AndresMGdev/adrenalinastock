// src/app/sales/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { fetchProductsData } from '@/services/product';
import { Skeleton } from '@/components/Skeleton';

type Sale = {
    prenda: string;
    referencia: string;
    precio: number;
    fechaventa: Date;
};

type MonthlySales = {
    month: string;
    sales: Sale[];
    total: number;
};

const SalesPage = () => {
    const [monthlySales, setMonthlySales] = useState<MonthlySales[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getMonthlySales = async () => {
            try {
                const products = await fetchProductsData();
                const salesMap = new Map<string, MonthlySales>();

                products.forEach(product => {
                    if (product.vendido && product.fechaventa) {
                        let saleDate: Date;

                        // Verificar si `fechaventa` es un objeto con la propiedad `seconds`
                        if (typeof product.fechaventa === 'object' && 'seconds' in product.fechaventa) {
                            const timestamp = product.fechaventa as { seconds: number; nanoseconds: number };
                            saleDate = new Date(timestamp.seconds * 1000);
                        } else {
                            // Asumir que es una cadena u otro formato directamente convertible
                            saleDate = new Date(product.fechaventa as string);
                        }

                        const monthKey = saleDate.toLocaleString('default', { month: 'long', year: 'numeric' });

                        const sale: Sale = {
                            prenda: product.prenda,
                            referencia: product.referencia,
                            precio: product.precio,
                            fechaventa: saleDate,
                        };

                        if (!salesMap.has(monthKey)) {
                            salesMap.set(monthKey, { month: monthKey, sales: [sale], total: product.precio });
                        } else {
                            const monthlyData = salesMap.get(monthKey)!;
                            monthlyData.sales.push(sale);
                            monthlyData.total += product.precio;
                        }
                    }
                });

                setMonthlySales(Array.from(salesMap.values()));
            } catch (err) {
                setError('Failed to fetch sales data');
            } finally {
                setLoading(false);
            }
        };

        getMonthlySales();
    }, []);

    if (loading) {
        return (
            <div className="hero-content flex-col">
                <h1 className="text-center py-4">Meses y Ventas</h1>
                <Skeleton />
            </div>
        );
    }

    if (error) {
        return <div className="text-center py-4 text-red-500">{error}</div>;
    }

    return (
        <div className="hero-content flex-col">
            <h1 className="text-center py-4">Meses y Ventas</h1>
            <div className="w-full max-w-4xl mx-auto">
                {monthlySales.length > 0 ? (
                    monthlySales.map(({ month, sales, total }) => (
                        <div key={month} className="mb-8 border rounded-lg shadow-lg p-4 bg-white">
                            <h2 className="text-2xl font-bold mb-4">{month}</h2>
                            <table className="table-auto w-full mb-4">
                                <thead>
                                    <tr>
                                        <th className="text-left">Producto</th>
                                        <th className="text-left">Referencia</th>
                                        <th className="text-right">Precio</th>
                                        <th className="text-right">Fecha de Venta</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sales.map((sale, index) => (
                                        <tr key={index}>
                                            <td>{sale.prenda}</td>
                                            <td>{sale.referencia}</td>
                                            <td className="text-right">${sale.precio.toFixed(2)}</td>
                                            <td className="text-right">{sale.fechaventa.toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="text-right font-bold text-lg">
                                Total Ventas: ${total.toFixed(2)}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-4">No se encontraron ventas</div>
                )}
            </div>
        </div>
    );
};

export default SalesPage;
