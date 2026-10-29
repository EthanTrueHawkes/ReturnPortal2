export type Item = {
    id: string;
    name: string;
    color: string;
    price: number;
    image: string;
    days: number;
    crop?: string;
};
export const items: Item[] = [
    { id: 'baggy', name: "'94 Baggy Wide Leg Women's Jeans", color: 'Light Indigo', price: 79.5, image: 'f531a.png', days: 4 },
    { id: 'highrise', name: 'High-Rise Baggy Jeans', color: 'Dark Wash', price: 79.5, image: '5924f.png', days: 21, crop: 'dark' },
    { id: 'carve', name: 'Carve Women’s Jeans', color: 'Light Wash', price: 125.98, image: 'b68e3.png', days: 21, crop: 'carve' },
    { id: 'middy', name: 'Middy Wide Leg Pant', color: 'Medium Wash', price: 74.99, image: 'cb3de.png', days: 0 },
];
export const reasons = ['Item doesn’t fit as expected', 'Item doesn’t match description', 'Item arrived damaged / defective', 'Wrong item received', 'Item arrived late', 'Changed my mind', 'Other'];
export const fitReasons = ['It was too short', 'It was too long', 'It was too big', 'It was too small', 'Other'];
export const money = (value: number) => `$${value.toFixed(2)}`;
export const cents = (value: number) => Math.round(value * 100) / 100;
export type Product = {
    id: string;
    name: string;
    price: number;
    image: string;
    color: string;
    category: 'More Pants' | 'Popular Picks';
    crop: [
        number,
        number,
        number,
        number
    ];
};
export const products: Product[] = [
    { id: 'barrel', name: 'Baggy Dad Barrel Jeans', price: 60, image: '49a1e.png', color: 'Easy days - Medium wash', category: 'More Pants', crop: [146.97, 148.75, -23.78, -48.78] },
    { id: 'teardrop', name: 'Teardrop Wide Leg Jeans', price: 88.43, image: 'c542f.png', color: 'Dark Wash', category: 'More Pants', crop: [141.42, 153.44, -20.71, -53.5] },
    { id: 'loose', name: 'Loose Boot Women’s Jeans', price: 58.43, image: '171f0.png', color: 'Light Wash', category: 'More Pants', crop: [138.86, 150.43, -19.43, -50.64] },
    { id: 'vintage', name: 'Vintage Short-sleeve Tee', price: 35, image: '29a7f.png', color: 'White', category: 'Popular Picks', crop: [134.06, 145.24, -17.03, -11.26] },
    { id: 'kate', name: 'Kate Mini Dress', price: 90, image: 'f1223.png', color: 'Natural', category: 'Popular Picks', crop: [112.14, 121.48, -6.07, -12.51] },
    { id: 'pauline', name: 'Pauline Pointelle Short...', price: 80, image: 'ea80f.png', color: 'White', category: 'Popular Picks', crop: [127.06, 137.65, -17.71, -26.92] },
];
export type Location = {
    id: string;
    name: string;
    logo: string;
    box: boolean;
    label: boolean;
    fee: number;
    pickup: boolean;
    distance?: string;
    slot?: string;
};
export const locations: Location[] = [
    { id: 'usps', name: 'USPS Pickup', logo: '76c9c.png', box: true, label: false, fee: 5, pickup: true },
    { id: 'ups-pickup', name: 'UPS Pickup', logo: '853cd.png', box: true, label: true, fee: 0, pickup: true },
    { id: 'levis', name: 'Levi’s In Store Return', logo: '0bd7a.png', box: false, label: false, fee: 0, pickup: false, distance: '2.1 Miles away' },
    { id: 'ups-store', name: 'The UPS Store', logo: '853cd.png', box: false, label: false, fee: 0, pickup: false, distance: '1.6 Miles' },
    { id: 'fedex', name: 'FedEx', logo: '6706e.png', box: true, label: false, fee: 0, pickup: false, distance: '1.9 Miles away' },
];
