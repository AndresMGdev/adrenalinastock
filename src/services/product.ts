// src/services/product.ts
import { getFirestore, collection, doc, updateDoc, getDocs, getDoc, where, orderBy, query, Timestamp, deleteDoc, addDoc } from "firebase/firestore";
import { app } from "@/lib/firebase"; // Asegúrate de exportar la instancia de Firebase app
import { ProductAdmin } from '@/types/productadmin';
import { Product } from "@/types/product";

const db = getFirestore(app);

interface Sale {
    fecha: Timestamp;
    precio: number;
    referencia: string;
    cantidad: number;
}

export const fetchProductsData = async (): Promise<Product[]> => {
    try {
        const productsCollection = collection(db, "productos");
        const productsSnapshot = await getDocs(productsCollection);
        const productsList = productsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Product[]; // Asegúrate de que `Product` refleje la estructura de tu documento

        return productsList;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error("Failed to fetch products");
    }
};


export const fetchProductData = async (id: string): Promise<Product | null> => {
    try {
        const productRef = doc(db, "productos", id);
        const productSnapshot = await getDoc(productRef);
        if (productSnapshot.exists()) {
            return { id: productSnapshot.id, ...productSnapshot.data() } as Product;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching product:", error);
        throw new Error("Failed to fetch product");
    }
};

export const addProduct = async (newProduct: ProductAdmin): Promise<void> => {
    try {
        const productsCollection = collection(db, 'productos');
        await addDoc(productsCollection, newProduct);
    } catch (error) {
        console.error('Error adding product:', error);
        throw new Error('Failed to add product');
    }
};

export const updateProduct = async (product: ProductAdmin): Promise<void> => {
    try {
        const productRef = doc(db, 'productos', product.id!); // Use product.id here
        await updateDoc(productRef, product);
    } catch (error) {
        console.error('Error updating product:', error);
        throw new Error('Failed to update product');
    }
};

export const deleteProduct = async (id: string): Promise<void> => {
    try {
        const productRef = doc(db, 'productos', id);
        await deleteDoc(productRef);
    } catch (error) {
        console.error('Error deleting product:', error);
        throw new Error('Failed to delete product');
    }
};

export const updateProductData = async (id: string, data: Partial<Product>) => {
    const productRef = doc(db, 'productos', id);
    return await updateDoc(productRef, data);
  };

export const fetchMonthlySalesData = async (): Promise<Map<string, { total: number, count: number }>> => {
    try {
        const salesCollection = collection(db, "productos");
        // Filtro para obtener solo productos vendidos
        const q = query(salesCollection, where("vendido", "==", true));
        const salesSnapshot = await getDocs(q);
        const sales = salesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];

        // Crear un mapa para acumular ventas por mes
        const monthlySales = new Map<string, { total: number, count: number }>();

        sales.forEach(product => {
            if (product.fechaventa) {
                const date = new Date(product.fechaventa);
                const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`; // Año-Mes (YYYY-MM)
                
                if (!monthlySales.has(yearMonth)) {
                    monthlySales.set(yearMonth, { total: 0, count: 0 });
                }

                const currentMonthData = monthlySales.get(yearMonth)!;
                monthlySales.set(yearMonth, {
                    total: currentMonthData.total + product.precio,
                    count: currentMonthData.count + 1
                });
            }
        });

        return monthlySales;
    } catch (error) {
        console.error("Error fetching monthly sales data:", error);
        throw new Error("Failed to fetch monthly sales data");
    }
};