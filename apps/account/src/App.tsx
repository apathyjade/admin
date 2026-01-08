import React from 'react';
import ProductCard from './components/ProductCard';

const mockProduct = { id: 1, name: 'Rsbuild T-Shirt', price: 99 };

export default function ProductsApp() {
  return (
    <div>
      <h2>Products Remote App</h2>
      <ProductCard product={mockProduct} />
    </div>
  );
}