'use server';

import prisma from '../prisma';

export const getUnreadNotificationCount = async () => {
    try {
        const count = await prisma.notification.count({
            where: {
                isRead: false,
            },
        });
        return count;
    } catch (error) {
        console.error('Error fetching unread notification count:', error);
        return 0;
    }
};

export const getNotifications = async () => {
    try {
        const notifications = await prisma.notification.findMany({
            include: {
                order: {
                    select: {
                        id: true,
                        createdDate: true,
                        user: { select: { fullName: true } },
                        product: { select: { id: true, name: true, images: { select: { url: true } } } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return notifications;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
};

export const markAllNotificationsAsRead = async () => {
    try {
        await prisma.notification.updateMany({
            where: {
                isRead: false,
            },
            data: {
                isRead: true,
            },
        });
        return { success: true };
    } catch (error) {
        console.error('Error marking notifications as read:', error);
        return { success: false };
    }
};

export const cleanupExpiredNotifications = async () => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const deletedCount = await prisma.notification.deleteMany({
            where: {
                createdAt: {
                    lt: thirtyDaysAgo,
                },
            },
        });

        console.log(`Deleted ${deletedCount.count} expired notifications`);
        return { success: true, deleted: deletedCount.count };
    } catch (error) {
        console.error('Error cleaning up expired notifications:', error);
        return { success: false };
    }
};

export const updateNotifyNew = async (notifyId: string) => {
    try {
        const updatedNotify = await prisma.notification.update({
            where: { id: notifyId },
            data: { isNew: false },
        });
        return { success: true, error: false, doctor: updatedNotify };
    } catch (error) {
        console.error('Error updating job visibility:', error);
        return { success: false, error: true, message: 'Failed to update job visibility' };
    }
};
