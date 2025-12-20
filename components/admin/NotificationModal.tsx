'use client';

import { Loader, XIcon } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import NotificationItem from './NotificationItem';
import moment from 'moment';
import { markAllNotificationsAsRead } from '@/lib/actions/notification.action';
import { useNotificationStore } from '@/store/notificationStore';
import { useTranslations } from 'next-intl';

export default function NotificationModal({
    setShowNotifications,
    fetchNotifyUnreadCount,
}: {
    setShowNotifications: Dispatch<SetStateAction<boolean>>;
    fetchNotifyUnreadCount: () => Promise<void>;
}) {
    const t = useTranslations('Notification');

    const { notifications, fetchNotifications } = useNotificationStore();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        try {
            fetchNotifications();
        } catch (error) {
            console.error('Error loading notifications:', error);
        } finally {
            setIsLoading(false);
        }
    }, [fetchNotifications]);

    useEffect(() => {
        // Ensure userId exists before calling
        const markAsRead = async () => {
            const result = await markAllNotificationsAsRead();
            if (result.success) {
                // Refetch after marking to update UI
                fetchNotifications();
                fetchNotifyUnreadCount();
            }
        };

        markAsRead();
    }, [fetchNotifications, fetchNotifyUnreadCount]);

    if (isLoading) return <Loader />;

    return (
        <>
            <div className="fixed bg-black/50 top-0 left-0 right-0 bottom-0 flex items-center justify-center z-99999">
                <div className="bg-white w-full max-w-md rounded-lg relative shadow-2xl">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-900">{t('title')}</h2>
                        <XIcon
                            onClick={() => setShowNotifications(false)}
                            size={20}
                            className="text-gray-500 hover:text-gray-800 cursor-pointer"
                        />
                    </div>
                    {/* List of Notifications */}
                    <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                        {notifications && notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    id={notification.id}
                                    orderId={notification.order?.id}
                                    username={notification.order?.user.fullName}
                                    productImage={notification.order?.product?.images[0].url}
                                    productName={notification.order?.product?.name}
                                    time={moment(notification.createdAt).fromNow()}
                                    isNew={notification.isNew}
                                    fetchNotifications={fetchNotifications}
                                    setShowNotifications={setShowNotifications}
                                />
                            ))
                        ) : (
                            <p className="p-4 text-center text-gray-500">{t('noNotifications')}</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
