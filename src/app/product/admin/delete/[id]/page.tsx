'use client';

import { app } from "@/lib/firebase";
import { doc, deleteDoc, getFirestore, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Head from "next/head";

export default function DeleteProduct({ params }: { params: { id: string } }) {
    const router = useRouter();
    const db = getFirestore(app);

    const [productName, setProductName] = useState("");

    useEffect(() => {
        const fetchProductName = async () => {
            if (!params.id) return;

            try {
                const ref = doc(db, "productos", params.id);
                const snapshot = await getDoc(ref);
                if (snapshot.exists()) {
                    setProductName(snapshot.data().prenda);
                } else {
                    console.error("No product found");
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };

        fetchProductName();
    }, [params.id, db]);

    const handleDelete = async () => {
        if (!params.id) return;

        try {
            await deleteDoc(doc(db, "productos", params.id));
            router.push("/product/admin"); // Redirige de nuevo a la lista de productos
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    return (
        <>
            <div className="container mx-auto mt-8 w-full">
                <div className="card bg-base-100 w-96 shadow-xl">
                    <div className="card-body">
                        <div className="flex justify-between items-center pb-4 border-b border-dashed border-gray-900 mb-4">
                            <h1 className="text-3xl font-semibold">Eliminar Producto</h1>
                        </div>
                        <div className="mb-4">
                            <p>Seguroque quiere eliminar el siguiente <strong>{productName}</strong>? Esta accón no es reversible.</p>
                        </div>
                        <div className="flex justify-between">
                            <button
                                className="bg-red-600 hover:bg-opacity-80 text-white rounded-lg px-4 py-2 duration-200"
                                onClick={handleDelete}
                            >
                                Eliminar
                            </button>
                            <button
                                className="bg-gray-600 hover:bg-opacity-80 text-white rounded-lg px-4 py-2 duration-200"
                                onClick={() => router.push("/product/admin")}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>

            </div>
            <Head>
                <title>Eliminar Producto</title>
            </Head>
        </>
    );
}
