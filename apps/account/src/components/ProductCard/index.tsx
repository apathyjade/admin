import React from 'react';
import { Product } from '../../shared/types';

interface Props {
  product: Product;
}

export const ProductCard = ({ product }: Props) => (
  <div className="product-card" style={{ border: '1px solid #eee', padding: '10px', margin: '10px' }}>
    <h3>{product?.name || '--'}</h3>
    <p>¥{product?.price || '--'}</p>
  </div>
);

// 默认导出供 MF 使用
export default ProductCard;