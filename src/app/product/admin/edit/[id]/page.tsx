'use client';

import { app } from "@/lib/firebase";
import { doc, getDoc, setDoc, getFirestore } from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/navigation"; // Importamos desde 'next/navigation'
import { useEffect, useState } from "react";

export default function EditProduct({ params }: { params: { id: string } }) {
    const router = useRouter();

    const db = getFirestore(app);
    const [product, setProduct] = useState({
        id: "",
        prenda: "",
        color: "",
        tipoprenda: "",
        precio: 0,
        referencia: "",
        vendido: false,
    });

    const onChange = (e: any) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const fetchProduct = async () => {
            if (!params.id) return;

            try {
                const ref = doc(db, "productos", params.id);
                const snapshot = await getDoc(ref);
                if (snapshot.exists()) {
                    const productData = snapshot.data();

                    // Aseguramos que todas las propiedades estén presentes con valores predeterminados
                    setProduct({
                        id: snapshot.id,
                        prenda: productData.prenda || "",
                        color: productData.color || "",
                        tipoprenda: productData.tipoprenda || "",
                        precio: productData.precio || 0,
                        referencia: productData.referencia || "",
                        vendido: productData.vendido || false,
                    });
                } else {
                    console.error("No product found");
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };

        if (params.id) {
            fetchProduct();
        }
    }, [params.id, db]);

    const handleUpdate = async () => {
        if (!params.id) return;

        const ref = doc(db, "productos", params.id);
        var fecha;
        if (product.vendido == false) {
            fecha = null
        } else {
            fecha = Date();
        }
        try {
            await setDoc(ref, {
                prenda: product.prenda,
                fechaventa: fecha,
                color: product.color,
                tipoprenda: product.tipoprenda,
                precio: Number(product.precio),
                referencia: product.referencia,
                vendido: product.vendido,
            });
            router.push("/product/admin"); // Redirige de nuevo a la lista de productos
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    return (
        <>
            <div className="container mx-auto mt-8 w-full flex flex-col items-center">
                <div className="card bg-base-100 w-96 shadow-xl">
                    <div className="card-body">
                        <div className="flex justify-between items-center pb-4 border-b border-dashed border-gray-900 mb-4">
                            <h1 className="text-3xl font-semibold">Editar Producto</h1>
                        </div>
                        <form>
                            <div className="mb-4">
                                <label>Prenda</label>
                                <input
                                    className="mt-1 px-4 py-2 border border-gray-300 rounded-md block w-full"
                                    type="text"
                                    name="prenda"
                                    value={product?.prenda}
                                    onChange={onChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label>Tipo de prenda</label>
                                <input
                                    className="mt-1 px-4 py-2 border border-gray-300 rounded-md block w-full"
                                    type="text"
                                    name="tipoprenda"
                                    value={product?.tipoprenda}
                                    onChange={onChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label>Color</label>
                                <input
                                    className="mt-1 px-4 py-2 border border-gray-300 rounded-md block w-full"
                                    type="text"
                                    name="color"
                                    value={product?.color}
                                    onChange={onChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label>Precio</label>
                                <input
                                    className="mt-1 px-4 py-2 border border-gray-300 rounded-md block w-full"
                                    type="number"
                                    name="precio"
                                    value={product?.precio}
                                    onChange={onChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label>Referencia</label>
                                <input
                                    className="mt-1 px-4 py-2 border border-gray-300 rounded-md block w-full"
                                    type="text"
                                    name="referencia"
                                    value={product?.referencia}
                                    onChange={onChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label>Vendido</label>
                                <input
                                    className="mt-1 px-4 py-2"
                                    type="checkbox"
                                    name="vendido"
                                    checked={product?.vendido}
                                    onChange={(e) => setProduct({ ...product, vendido: e.target.checked })}
                                />
                            </div>
                            <button
                                className="bg-green-600 hover:bg-opacity-80 text-white rounded-lg px-4 py-2 duration-200 w-full"
                                type="button"
                                onClick={handleUpdate}
                            >
                                Actualizar Producto
                            </button>
                        </form>
                    </div>
                </div>

            </div>
            <Head>
                <title>Editar Producto</title>
            </Head>
        </>
    );
}
