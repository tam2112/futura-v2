'use client';

import { Dispatch, SetStateAction } from 'react';
import { HiOutlineXMark } from 'react-icons/hi2';
import LanguageSelect from '../LanguageSelect';
import DarkModeSwitch from '../DarkModeSwitch';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useAuth } from '@/context/AuthContext';
import { CiLogout } from 'react-icons/ci';

export default function SettingModal({
    setOpenModal,
}: {
    openModal: boolean;
    setOpenModal: Dispatch<SetStateAction<boolean>>;
}) {
    const t = useTranslations('SettingModal');
    const s = useTranslations('Sidebar');
    const router = useRouter();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <div className="fixed z-[9999] top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white sm:min-w-[400px] min-w-[300px] relative p-8 rounded-lg">
                <div className="absolute top-4 right-4">
                    <HiOutlineXMark size={20} onClick={() => setOpenModal(false)} className="cursor-pointer" />
                </div>
                <div className="space-y-4">
                    <h2 className="text-xl font-heading font-semibold">{t('title')}</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <h3>{t('languages')}:</h3>
                            <LanguageSelect />
                        </div>
                        {/* <div className="flex justify-between items-center">
                            <h3>{t('theme')}:</h3>
                            <DarkModeSwitch />
                        </div> */}
                    </div>
                    <hr className="my-6" />
                    <div
                        onClick={handleLogout}
                        className="cursor-pointer flex gap-3 items-center justify-center bg-gray-200 py-2 px-4 active:bg-gradient-light active:text-white active:font-semibold rounded-lg transition-all duration-300"
                    >
                        <CiLogout width={18} height={18} />
                        {s('logout')}
                    </div>
                    {/* <div className="flex h-full flex-col justify-end">
                        <button
                            className="bg-slate-200 px-6 py-2 text-center rounded-lg"
                            onClick={() => setOpenModal(false)}
                        >
                            {t('close')}
                        </button>
                    </div> */}
                </div>
            </div>
        </div>
    );
}
