'use client';

import { useEffect, useState } from 'react';
import { fetchProductData, updateProductData } from '@/services/product';
import { Product } from '@/types/product';

const ProductPage = ({ params }: { params: { id: string } }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const productData = await fetchProductData(params.id);
        if (productData) {
          setProduct(productData);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to fetch product data');
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [params.id]);

  const handleConfirm = async () => {
    try {
      const fecha = Date()
      if (product) {
        await updateProductData(product.id, { vendido: !product.vendido,  fechaventa: fecha });
        setProduct({ ...product, vendido: !product.vendido, fechaventa: fecha });
      }
    } catch (err) {
      setError('Failed to update product status');
    }
  };


  if (loading) return (
    <li className='list-none m-4'>
      <div className="flex flex-col gap-4 p-6">
        <div className="skeleton h-4 w-28"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-28"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
      </div>
    </li>
  );

  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  if (!product) return <div className="text-center py-4">Producto not found</div>;

  return (
    <>
      <div className={`card m-4 ${product.vendido ? 'bg-red-600' : 'bg-base-100'} shadow-xl`}>
        <div className="card-body items-center">
          <h2 className="lg:card-title text-bold">{product.prenda}</h2>
          <div className="flex-col">
            <p className="mb-2"><strong>Tipo de Prenda:</strong> {product.tipoprenda}</p>
            <p className="mb-2"><strong>Precio: </strong>${product.precio.toFixed(2)}</p>
            <p className="mb-2"><strong>Referencia:</strong> {product.referencia}</p>
            <p className="mb-2"><strong>Color:</strong> {product.color}</p>
            <p className="mb-2"><strong>Vendido:</strong> {product.vendido ? 'Yes' : 'No'}</p>
          </div>
          <div className="card-actions justify-end">
          {product.vendido ? <p>Prenda Vendida!</p> : 
            <button onClick={handleConfirm} className="btn btn-primary">Vender Prenda</button>}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
