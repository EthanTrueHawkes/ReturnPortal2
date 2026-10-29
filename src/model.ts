import type { Item, Product } from './data';
export type Screen = '1' | '2' | '3' | '3.1' | '3.2' | '4' | '5-front' | '5-back' | '4.2' | '6' | '6.1' | '6alt' | '7' | '8' | 'thanks';
export type Offer = 'size' | 'shop' | 'keep';
export type Outcome = 'refund' | 'size' | 'shop' | 'keep';
export type Draft = {
    item: Item;
    reason: string;
    fit: string;
    offerSeen: Offer | null;
    outcome: Outcome;
    waist: number;
    inseam: number;
    color: number;
    front: boolean;
    back: boolean;
    replacement?: {
        product: Product;
        waist: number;
        inseam: number;
        color: number;
    };
};
export const newDraft = (item: Item): Draft => ({ item, reason: '', fit: '', offerSeen: null, outcome: 'refund', waist: 26, inseam: 30, color: item.color === 'Dark Wash' ? 1 : 0, front: false, back: false });
export const sizeColor = (item: Item, color: number) => color === 0 ? (item.color === 'Dark Wash' ? 'Light Indigo' : item.color) : color === 1 ? 'Dark Wash' : 'Medium Wash';
export const productColor = (product: Product, color: number) => color === 0 ? product.color : color === 1 ? 'Dark Wash' : color === 2 ? 'Medium Wash' : color === 3 ? 'Light Wash' : 'Light Indigo';
