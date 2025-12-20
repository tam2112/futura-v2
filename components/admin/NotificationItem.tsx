'use client';

import { useRouter } from '@/i18n/navigation';
import { updateNotifyNew } from '@/lib/actions/notification.action';
import { Boxes } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';

interface NotificationItemProps {
    id: string;
    orderId: string | undefined;
    username: string | undefined;
    time: string;
    productImage?: string;
    productName?: string;
    isNew: boolean;
    fetchNotifications: () => Promise<void>;
    setShowNotifications: Dispatch<SetStateAction<boolean>>;
}

export default function NotificationItem({
    id,
    username,
    productImage,
    productName,
    time,
    isNew,
    fetchNotifications,
    setShowNotifications,
}: NotificationItemProps) {
    const t = useTranslations('Notification');
    const currentLocale = useLocale();

    const router = useRouter();

    const handleNotifyNew = async (notifyId: string) => {
        const result = await updateNotifyNew(notifyId);
        if (result.success) {
            fetchNotifications();
        } else {
            console.error(result.message || 'Cập nhật thất bại');
        }
    };

    const handleClick = () => {
        handleNotifyNew(id);
        // Navigate with hash for admin
        router.push('/admin/order/list', { locale: currentLocale });
        setShowNotifications(false);
    };

    return (
        <div
            onClick={handleClick}
            className={`flex items-start gap-4 p-3 hover:bg-gray-50 border-b last:border-b-0 last:rounded-b-lg ${
                isNew ? 'bg-indigo-50 hover:bg-indigo-50' : ''
            } cursor-pointer`}
        >
            {/* Icon */}
            <div className={`p-2 rounded-full text-orange-500 bg-orange-100`}>
                <Boxes className="size-5" fill="currentColor" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800">
                    {t('content', { productName: productName || '', username: username || '' })}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{time}</p>
            </div>

            {productImage && (
                <div className="ml-auto w-12 h-12 bg-gray-200 rounded-md shrink-0">
                    <Image src={productImage} alt="cover" width={48} height={48} className="object-cover size-12" />
                </div>
            )}
        </div>
    );
}
