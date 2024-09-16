'use client';

import { fetchProductsData } from "@/services/product";
import { Product } from "@/types/product";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/Skeleton";

const ProductsPage = () => {
    const [products, setProducts] = useState<Product[] | null>(null);
    const [filteredProducts, setFilteredProducts] = useState<Product[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        tipoPrenda: '',
        precioMin: '',
        precioMax: '',
        color: '',
        vendido: ''
    });

    useEffect(() => {
        const getProducts = async () => {
            try {
                const productsData = await fetchProductsData();
                setProducts(productsData);
                setFilteredProducts(productsData); // Inicialmente, mostrar todos los productos
            } catch (err) {
                setError('Failed to fetch product data');
            } finally {
                setLoading(false);
            }
        };

        getProducts();
    }, []);

    useEffect(() => {
        if (products) {
            const applyFilters = () => {
                let filtered = products;

                if (filters.tipoPrenda) {
                    filtered = filtered.filter(product => product.tipoprenda.toLowerCase().includes(filters.tipoPrenda.toLowerCase()));
                }

                if (filters.precioMin) {
                    filtered = filtered.filter(product => product.precio >= parseFloat(filters.precioMin));
                }

                if (filters.precioMax) {
                    filtered = filtered.filter(product => product.precio <= parseFloat(filters.precioMax));
                }

                if (filters.color) {
                    filtered = filtered.filter(product => product.color.toLowerCase().includes(filters.color.toLowerCase()));
                }

                if (filters.vendido) {
                    filtered = filtered.filter(product => product.vendido === (filters.vendido === 'true'));
                }

                setFilteredProducts(filtered);
            };

            applyFilters();
        }
    }, [filters, products]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    if (loading) {
        return (
            <div className="hero-content flex-col">
                <h1 className="text-center py-4">Productos</h1>
                <Skeleton />
            </div>
        );
    }

    if (error) {
        return <div className="text-center py-4 text-red-500">{error}</div>;
    }

    if (!filteredProducts) {
        return <div className="text-center py-4">Productos not found</div>;
    }

    return (
        <div className="hero-content flex-col p-4">
            <h1 className="text-center text-2xl font-bold py-4">Productos</h1>
            <details className="collapse bg-base-200 mb-4">
                <summary className="collapse-title text-xl font-medium">Filtro</summary>
                <div className="collapse-content p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tipo de Prenda:
                                <input
                                    type="text"
                                    name="tipoPrenda"
                                    value={filters.tipoPrenda}
                                    onChange={handleFilterChange}
                                    placeholder="Tipo"
                                    className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm"
                                />
                            </label>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Color:
                                <input
                                    type="text"
                                    name="color"
                                    value={filters.color}
                                    onChange={handleFilterChange}
                                    placeholder="Colors"
                                    className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm"
                                />
                            </label>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Precio Min.:
                                <input
                                    type="number"
                                    name="precioMin"
                                    value={filters.precioMin}
                                    onChange={handleFilterChange}
                                    placeholder="Min Price"
                                    className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm"
                                />
                            </label>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Precio Max.:
                                <input
                                    type="number"
                                    name="precioMax"
                                    value={filters.precioMax}
                                    onChange={handleFilterChange}
                                    placeholder="Max Price"
                                    className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm"
                                />
                            </label>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Vendido:
                                <select
                                    name="vendido"
                                    value={filters.vendido}
                                    onChange={handleFilterChange}
                                    className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm"
                                >
                                    <option value="">Todos</option>
                                    <option value="true">Si</option>
                                    <option value="false">No</option>
                                </select>
                            </label>
                        </div>
                    </div>
                </div>
            </details>
            <ol className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                    <li key={product.id} className={`card ${product.vendido ? 'bg-red-600' : 'bg-base-100'} shadow-xl rounded-lg overflow-hidden`}>
                        <Link href={`/product/${product.id}`} className="block p-6 no-underline">
                            <h2 className="text-xl font-bold mb-2">{product.prenda}</h2>
                            <p className="text-sm mb-1"><strong>Tipo:</strong> {product.tipoprenda}</p>
                            <p className="text-sm mb-1"><strong>Precio:</strong> ${product.precio.toFixed(2)}</p>
                            <p className="text-sm mb-1"><strong>Referencia:</strong> {product.referencia}</p>
                            <p className="text-sm mb-1"><strong>Color:</strong> {product.color}</p>
                            <p className="text-sm mb-1"><strong>Vendido:</strong> {product.vendido ? 'Si' : 'No'}</p>
                        </Link>
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default ProductsPage;
