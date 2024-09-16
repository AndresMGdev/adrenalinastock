// src/app/admin/page.tsx
'use client';

import { app } from "@/lib/firebase";
import { fetchProductsData } from "@/services/product";
import { Product } from "@/types/product";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  const getProducts = async () => {
    try {
      const productsList = await fetchProductsData();  // Usa el servicio
      setProducts(productsList);
      console.log(productsList)
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      <div className="container mx-auto mt-8 w-full flex flex-col items-center">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center pb-4 border-b border-dashed border-gray-900 mb-4">
              <h1 className="text-3xl font-semibold">Productos</h1>
              <Link
                className="bg-green-600 hover:bg-opacity-80 text-white rounded-lg px-4 py-2 duration-200"
                href="admin/create-product"
              >
                Crear Producto
              </Link>
            </div>
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">REF</th>
                  <th className="px-4 py-2 text-left">Prenda</th>
                  <th className="px-4 py-2 text-left">Color</th>
                  <th className="px-4 py-2 text-left">Vendida</th>
                  <th className="px-4 py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-200">
                    <td className="px-4 py-2">{product.referencia}</td>
                    <td className="px-4 py-2">{product.prenda}</td>
                    <td className="px-4 py-2">{product.color}</td>
                    <td className="px-4 py-2">{product.vendido ? 'Si' : 'No'}</td>
                    <td className="px-4 py-2 text-right">
                      <Link className="text-blue-700 underline hover:no-underline" href={`admin/edit/${product.id}`}>
                        Editar
                      </Link>
                      <Link className="ml-4 text-red-500 underline hover:no-underline" href={`admin/delete/${product.id}`}>
                        Eliminar
                      </Link>
                    </td>
                  </tr>
                ))}
                {products.length < 1 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-2 text-center">
                      No data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Head>
        <title>Producto</title>
      </Head>
    </>
  );
}
