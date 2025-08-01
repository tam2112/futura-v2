import { create } from 'zustand';
import {
    getNewArrivals,
    getPopularIPhones,
    getPopularLaptops,
    getTrendingIPads,
    getDealProducts,
    getRandomProductsByBrand,
    getProductCount,
} from '@/lib/actions/product.action';
import {
    getProductsPerAttribute,
    getDiscountedProductsDistribution,
    getProductCreationOverTime,
} from '@/lib/actions/chart.action';

type Product = {
    id: string;
    name: string;
    slug: string;
    price: number;
    priceWithDiscount?: number | null;
    images: { url: string }[];
    category: { name: string; slug: string; id: string };
    brand?: { name: string; id: string } | null;
    promotions?: { percentageNumber: number }[];
};

type ProductStore = {
    newArrivals: Product[];
    popularIPhones: Product[];
    popularLaptops: Product[];
    trendingIPads: Product[];
    dealProducts: Product[];
    sonyProducts: Product[];
    acerProducts: Product[];
    lenovoProducts: Product[];
    dellProducts: Product[];
    productsPerBrand: { name: string; count: number }[];
    productsPerColor: { name: string; count: number }[];
    productsPerStorage: { name: string; count: number }[];
    productsPerConnectivity: { name: string; count: number }[];
    productsPerSimSlot: { name: string; count: number }[];
    productsPerBatteryHealth: { name: string; count: number }[];
    productsPerRam: { name: string; count: number }[];
    productsPerCpu: { name: string; count: number }[];
    productsPerScreenSize: { name: string; count: number }[];
    productsPerType: { name: string; count: number }[];
    discountedProductsDistribution: { percentage: number; count: number }[];
    productCreationOverTime: { date: string; count: number }[];
    productCount: number;
    fetchNewArrivals: () => Promise<void>;
    fetchPopularIPhones: () => Promise<void>;
    fetchPopularLaptops: () => Promise<void>;
    fetchTrendingIPads: () => Promise<void>;
    fetchDealProducts: (limit?: number) => Promise<void>;
    fetchSonyProducts: () => Promise<void>;
    fetchAcerProducts: () => Promise<void>;
    fetchLenovoProducts: () => Promise<void>;
    fetchDellProducts: () => Promise<void>;
    fetchProductsPerBrand: () => Promise<void>;
    fetchProductsPerColor: () => Promise<void>;
    fetchProductsPerStorage: () => Promise<void>;
    fetchProductsPerConnectivity: () => Promise<void>;
    fetchProductsPerSimSlot: () => Promise<void>;
    fetchProductsPerBatteryHealth: () => Promise<void>;
    fetchProductsPerRam: () => Promise<void>;
    fetchProductsPerCpu: () => Promise<void>;
    fetchProductsPerScreenSize: () => Promise<void>;
    fetchProductsPerType: () => Promise<void>;
    fetchDiscountedProductsDistribution: () => Promise<void>;
    fetchProductCreationOverTime: () => Promise<void>;
    fetchProductCount: () => Promise<void>;
};

export const useProductStore = create<ProductStore>((set) => ({
    newArrivals: [],
    fetchNewArrivals: async () => {
        try {
            const data = await getNewArrivals(10);
            set({ newArrivals: data });
        } catch (error) {
            console.error('Error fetching new arrivals:', error);
        }
    },
    popularIPhones: [],
    fetchPopularIPhones: async () => {
        try {
            const data = await getPopularIPhones(8);
            set({ popularIPhones: data });
        } catch (error) {
            console.error('Error fetching popular iPhones:', error);
        }
    },
    popularLaptops: [],
    fetchPopularLaptops: async () => {
        try {
            const data = await getPopularLaptops(8);
            set({ popularLaptops: data });
        } catch (error) {
            console.error('Error fetching popular laptops:', error);
        }
    },
    trendingIPads: [],
    fetchTrendingIPads: async () => {
        try {
            const data = await getTrendingIPads(8);
            set({ trendingIPads: data });
        } catch (error) {
            console.error('Error fetching trending iPads:', error);
        }
    },
    dealProducts: [],
    fetchDealProducts: async (limit?: number) => {
        try {
            const data = await getDealProducts(limit);
            set({ dealProducts: data });
        } catch (error) {
            console.error('Error fetching deal products:', error);
        }
    },
    sonyProducts: [],
    fetchSonyProducts: async () => {
        try {
            const data = await getRandomProductsByBrand('Sony', 4);
            set({ sonyProducts: data });
        } catch (error) {
            console.error('Error fetching Sony products:', error);
        }
    },
    acerProducts: [],
    fetchAcerProducts: async () => {
        try {
            const data = await getRandomProductsByBrand('Acer', 4);
            set({ acerProducts: data });
        } catch (error) {
            console.error('Error fetching Acer products:', error);
        }
    },
    lenovoProducts: [],
    fetchLenovoProducts: async () => {
        try {
            const data = await getRandomProductsByBrand('Lenovo', 4);
            set({ lenovoProducts: data });
        } catch (error) {
            console.error('Error fetching Lenovo products:', error);
        }
    },
    dellProducts: [],
    fetchDellProducts: async () => {
        try {
            const data = await getRandomProductsByBrand('Dell', 4);
            set({ dellProducts: data });
        } catch (error) {
            console.error('Error fetching Dell products:', error);
        }
    },
    productsPerBrand: [],
    fetchProductsPerBrand: async () => {
        try {
            const data = await getProductsPerAttribute('brand');
            set({ productsPerBrand: data });
        } catch (error) {
            console.error('Error fetching products per brand:', error);
            set({ productsPerBrand: [] });
        }
    },
    productsPerColor: [],
    fetchProductsPerColor: async () => {
        try {
            const data = await getProductsPerAttribute('color');
            set({ productsPerColor: data });
        } catch (error) {
            console.error('Error fetching products per color:', error);
            set({ productsPerColor: [] });
        }
    },
    productsPerStorage: [],
    fetchProductsPerStorage: async () => {
        try {
            const data = await getProductsPerAttribute('storage');
            set({ productsPerStorage: data });
        } catch (error) {
            console.error('Error fetching products per storage:', error);
            set({ productsPerStorage: [] });
        }
    },
    productsPerConnectivity: [],
    fetchProductsPerConnectivity: async () => {
        try {
            const data = await getProductsPerAttribute('connectivity');
            set({ productsPerConnectivity: data });
        } catch (error) {
            console.error('Error fetching products per connectivity:', error);
            set({ productsPerConnectivity: [] });
        }
    },
    productsPerSimSlot: [],
    fetchProductsPerSimSlot: async () => {
        try {
            const data = await getProductsPerAttribute('simSlot');
            set({ productsPerSimSlot: data });
        } catch (error) {
            console.error('Error fetching products per simSlot:', error);
            set({ productsPerSimSlot: [] });
        }
    },
    productsPerBatteryHealth: [],
    fetchProductsPerBatteryHealth: async () => {
        try {
            const data = await getProductsPerAttribute('batteryHealth');
            set({ productsPerBatteryHealth: data });
        } catch (error) {
            console.error('Error fetching products per batteryHealth:', error);
            set({ productsPerBatteryHealth: [] });
        }
    },
    productsPerRam: [],
    fetchProductsPerRam: async () => {
        try {
            const data = await getProductsPerAttribute('ram');
            set({ productsPerRam: data });
        } catch (error) {
            console.error('Error fetching products per ram:', error);
            set({ productsPerRam: [] });
        }
    },
    productsPerCpu: [],
    fetchProductsPerCpu: async () => {
        try {
            const data = await getProductsPerAttribute('cpu');
            set({ productsPerCpu: data });
        } catch (error) {
            console.error('Error fetching products per cpu:', error);
            set({ productsPerCpu: [] });
        }
    },
    productsPerScreenSize: [],
    fetchProductsPerScreenSize: async () => {
        try {
            const data = await getProductsPerAttribute('screenSize');
            set({ productsPerScreenSize: data });
        } catch (error) {
            console.error('Error fetching products per screenSize:', error);
            set({ productsPerScreenSize: [] });
        }
    },
    productsPerType: [],
    fetchProductsPerType: async () => {
        try {
            const data = await getProductsPerAttribute('type');
            set({ productsPerType: data });
        } catch (error) {
            console.error('Error fetching products per type:', error);
            set({ productsPerType: [] });
        }
    },
    discountedProductsDistribution: [],
    fetchDiscountedProductsDistribution: async () => {
        try {
            const data = await getDiscountedProductsDistribution();
            set({ discountedProductsDistribution: data });
        } catch (error) {
            console.error('Error fetching discounted products distribution:', error);
            set({ discountedProductsDistribution: [] });
        }
    },
    productCreationOverTime: [],
    fetchProductCreationOverTime: async () => {
        try {
            const data = await getProductCreationOverTime();
            set({ productCreationOverTime: data });
        } catch (error) {
            console.error('Error fetching product creation over time:', error);
            set({ productCreationOverTime: [] });
        }
    },
    productCount: 0,
    fetchProductCount: async () => {
        try {
            const count = await getProductCount();
            set({ productCount: count });
        } catch (error) {
            console.error('Error fetching product count:', error);
            set({ productCount: 0 });
        }
    },
}));
