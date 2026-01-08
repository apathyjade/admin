
export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface CartItem {
  productId: number;
  quantity: number;
}