'use client';

import { app } from "@/lib/firebase";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/navigation"; // Importa desde 'next/navigation'
import { useState } from "react";

export default function CreateProduct() {
    const router = useRouter();
    const db = getFirestore(app);
    const [product, setProduct] = useState({
        prenda: "",
        fechaventa: null,
        color: "",
        tipoprenda: "",
        precio: 0,
        referencia: "",
        vendido: false,
    });

    const onChange = (e: any) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleCreate = async () => {
        const col = collection(db, "productos");
        try {
            await addDoc(col, {
                prenda: product.prenda,
                fechaventa: null,
                color: product.color,
                tipoprenda: product.tipoprenda,
                precio: Number(product.precio),
                referencia: product.referencia,
                vendido: false,
            });
            router.push("/product/admin"); // Redirige de nuevo a la lista de productos
        } catch (error) {
            console.error("Error creating product:", error);
        }
    };

    return (
        <>
            <div className="container mx-auto mt-8 w-full">
                <div className="card bg-base-100 w-96 shadow-xl">
                    <div className="card-body">
                        <div className="flex justify-between items-center pb-4 border-b border-dashed border-gray-900 mb-4">
                            <h1 className="text-3xl font-semibold">Create Product</h1>
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
                            <button
                                className="bg-green-600 hover:bg-opacity-80 text-white rounded-lg px-4 py-2 duration-200 w-full"
                                type="button"
                                onClick={handleCreate}
                            >
                                Create Product
                            </button>
                        </form>
                    </div>
                </div>

            </div>
            <Head>
                <title>Create Product</title>
            </Head>
        </>
    );
}
