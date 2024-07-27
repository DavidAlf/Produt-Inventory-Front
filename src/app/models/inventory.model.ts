import { Product } from "./product.model";

export interface Inventory {
    id: number;
    quantity: number,
    date: string,
    product: Product
}