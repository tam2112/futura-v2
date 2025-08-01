import { getCategories, getCategoryCount, getRandomCategories } from '@/lib/actions/category.action';
import { getProductsPerCategory, getCategoryCreationOverTime } from '@/lib/actions/chart.action';
import { create } from 'zustand';

type Category = {
    id: string;
    name: string;
    slug: string;
    images: {
        url: string;
    }[];
};

type CategoryStore = {
    randomCategories: Category[];
    trendingCategories: Category[];
    popularCategories: Category[];
    categories: Category[];
    productsPerCategory: { name: string; count: number }[];
    categoryCreationOverTime: { date: string; count: number }[];
    categoryCount: number;
    fetchRandomCategories: () => Promise<void>;
    fetchTrendingCategories: () => Promise<void>;
    fetchPopularCategories: () => Promise<void>;
    fetchCategories: () => Promise<void>;
    fetchProductsPerCategory: () => Promise<void>;
    fetchCategoryCreationOverTime: () => Promise<void>;
    fetchCategoryCount: () => Promise<void>;
};

export const useCategoryStore = create<CategoryStore>((set) => ({
    randomCategories: [],
    fetchRandomCategories: async () => {
        try {
            const data = await getRandomCategories(5);
            set({ randomCategories: data });
        } catch (error) {
            console.error('Error fetching random categories:', error);
        }
    },
    trendingCategories: [],
    fetchTrendingCategories: async () => {
        try {
            const data = await getRandomCategories(4);
            set({ trendingCategories: data });
        } catch (error) {
            console.error('Error fetching random categories:', error);
        }
    },
    popularCategories: [],
    fetchPopularCategories: async () => {
        try {
            const data = await getRandomCategories(9);
            set({ popularCategories: data });
        } catch (error) {
            console.error('Error fetching random categories:', error);
        }
    },
    categories: [],
    fetchCategories: async () => {
        try {
            const data = await getCategories();
            set({ categories: data });
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    },
    productsPerCategory: [],
    fetchProductsPerCategory: async () => {
        try {
            const data = await getProductsPerCategory();
            set({ productsPerCategory: data });
        } catch (error) {
            console.error('Error fetching products per category:', error);
            set({ productsPerCategory: [] });
        }
    },
    categoryCreationOverTime: [],
    fetchCategoryCreationOverTime: async () => {
        try {
            const data = await getCategoryCreationOverTime();
            set({ categoryCreationOverTime: data });
        } catch (error) {
            console.error('Error fetching category creation over time:', error);
            set({ categoryCreationOverTime: [] });
        }
    },
    categoryCount: 0,
    fetchCategoryCount: async () => {
        try {
            const count = await getCategoryCount();
            set({ categoryCount: count });
        } catch (error) {
            console.error('Error fetching category count:', error);
            set({ categoryCount: 0 });
        }
    },
}));
