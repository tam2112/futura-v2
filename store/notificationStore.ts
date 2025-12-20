import { create } from 'zustand';
import {
    cleanupExpiredNotifications,
    getNotifications,
    getUnreadNotificationCount,
} from '@/lib/actions/notification.action';

type Notification = {
    id: string;
    order: {
        id: string;
        createdDate: Date;
        user: { fullName: string };
        product: {
            id: string;
            name: string;
            images: { url: string }[];
        };
    } | null;
    isRead: boolean;
    isNew: boolean;
    createdAt: Date;
};

type NotificationStore = {
    notifyUnreadCount: number;
    notifications: Notification[] | null;
    fetchNotifyUnreadCount: () => Promise<void>;
    fetchNotifications: () => Promise<void>;
};

export const useNotificationStore = create<NotificationStore>((set) => {
    return {
        notifyUnreadCount: 0,
        fetchNotifyUnreadCount: async () => {
            try {
                const data = await getUnreadNotificationCount();
                set({ notifyUnreadCount: data });
            } catch (error) {
                console.error('Error fetching notifyUnreadCount:', error);
            }
        },
        notifications: [],
        fetchNotifications: async () => {
            try {
                const data = await getNotifications();
                await cleanupExpiredNotifications();
                set({ notifications: data });
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        },
    };
});
