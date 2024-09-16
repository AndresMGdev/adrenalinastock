// src/types/product.ts

export type Product = {
    id: string;          // Identificador único del producto
    tipoprenda: string;  // Tipo de prenda (ej. "blusa", "sueter")
    precio: number;      // Precio del producto
    prenda: string;      // Nombre o descripción del producto (ej. "blusa de rosa")
    referencia: string;  // Referencia del producto (ej. "AS-23005")
    color: string;   // Array de colores (ej. ["amarillo", "azul", "rojo"])
    vendido: boolean;    // Estado de venta (true o false)
    fechaventa?: string;
};
