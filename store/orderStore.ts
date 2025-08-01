import { getOrderCount, getUserOrders } from '@/lib/actions/order.action';
import { getOrderStatusDistribution, getOrderCreationOverTime } from '@/lib/actions/chart.action';
import { create } from 'zustand';

type Order = {
    id: string;
    createdDate: Date;
    quantity: number;
    status: {
        name: string;
    };
    product: {
        name: string;
        price: number;
        images: { url: string }[];
    };
    deliveryInfo: {
        firstName: string;
        lastName: string;
        street: string;
        city: string;
        country: string;
        phone: string;
    }[];
};

type OrderStore = {
    orders: Order[];
    orderStatusDistribution: { status: string; count: number }[];
    orderCreationOverTime: { date: string; count: number }[];
    orderCount: number;
    fetchOrders: (userId: string) => Promise<void>;
    fetchOrderStatusDistribution: () => Promise<void>;
    fetchOrderCreationOverTime: () => Promise<void>;
    fetchOrderCount: () => Promise<void>;
};

export const useOrderStore = create<OrderStore>((set) => ({
    orders: [],
    orderStatusDistribution: [],
    orderCreationOverTime: [],
    fetchOrders: async (userId: string) => {
        try {
            const data = await getUserOrders(userId);
            const sanitizedOrders = data.map((order) => ({
                ...order,
                product: {
                    ...order.product,
                    images: Array.isArray(order.product.images) ? order.product.images : [],
                },
            }));
            set({ orders: sanitizedOrders });
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    },
    fetchOrderStatusDistribution: async () => {
        try {
            const data = await getOrderStatusDistribution();
            set({ orderStatusDistribution: data });
        } catch (error) {
            console.error('Error fetching order status distribution:', error);
            set({ orderStatusDistribution: [] });
        }
    },
    fetchOrderCreationOverTime: async () => {
        try {
            const data = await getOrderCreationOverTime();
            set({ orderCreationOverTime: data });
        } catch (error) {
            console.error('Error fetching order creation over time:', error);
            set({ orderCreationOverTime: [] });
        }
    },
    orderCount: 0,
    fetchOrderCount: async () => {
        try {
            const count = await getOrderCount();
            set({ orderCount: count });
        } catch (error) {
            console.error('Error fetching order count:', error);
            set({ orderCount: 0 });
        }
    },
}));
