'use client';

import SettingModal from '@/components/modal/SettingModal';
import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { GiSmartphone } from 'react-icons/gi';
import { GrTechnology } from 'react-icons/gr';
import { PiGear, PiHouse, PiUser } from 'react-icons/pi';
import { twMerge } from 'tailwind-merge';

export default function SidebarVertical() {
    const pathname = usePathname();

    const t = useTranslations('Sidebar');
    const [openSettingModal, setOpenSettingModal] = useState(false);

    const [isUserOpen, setIsUserOpen] = useState(false);
    const [isProductOpen, setIsProductOpen] = useState(false);
    const [isTechnicalOpen, setIsTechnicalOpen] = useState(false);

    const toggleUser = () => {
        setIsUserOpen(!isUserOpen);
        setIsProductOpen(false);
        setIsTechnicalOpen(false);
    };
    const toggleProduct = () => {
        setIsProductOpen(!isProductOpen);
        setIsUserOpen(false);
        setIsTechnicalOpen(false);
    };
    const toggleTechnical = () => {
        setIsTechnicalOpen(!isTechnicalOpen);
        setIsProductOpen(false);
        setIsUserOpen(false);
    };

    const technicalLinks = [
        { name: t('brand'), path: '/admin/technical/brand/list' },
        { name: t('color'), path: '/admin/technical/color/list' },
        { name: t('storage'), path: '/admin/technical/storage/list' },
        { name: t('connectivity'), path: '/admin/technical/connectivity/list' },
        { name: t('simSlot'), path: '/admin/technical/sim-slot/list' },
        { name: t('batteryHealth'), path: '/admin/technical/battery-health/list' },
        { name: t('ram'), path: '/admin/technical/ram/list' },
        { name: t('cpu'), path: '/admin/technical/cpu/list' },
        { name: t('screenSize'), path: '/admin/technical/screen-size/list' },
        { name: t('type'), path: '/admin/technical/type/list' },
    ];

    const userLinks = [
        { name: t('user'), path: '/admin/user/list' },
        { name: t('order'), path: '/admin/order/list' },
        { name: t('role'), path: '/admin/role/list' },
    ];

    const productLinks = [
        { name: t('category'), path: '/admin/category/list' },
        { name: t('product'), path: '/admin/product/list' },
        { name: t('promotion'), path: '/admin/promotion/list' },
        { name: t('status'), path: '/admin/status/list' },
    ];

    return (
        <>
            {openSettingModal && <SettingModal openModal={openSettingModal} setOpenModal={setOpenSettingModal} />}
            <div className="fixed z-[999999] sm:bottom-16 bottom-8 left-1/2 -translate-x-1/2">
                <div className="bg-white border border-black rounded-full sm:min-w-[200px] min-w-[180px]">
                    <ul className="flex items-center">
                        <Link
                            href={'/admin'}
                            className={`p-4 rounded-full sm:px-6 px-4 hover:text-white hover:bg-gradient-medium transition-all duration-300 ${
                                pathname === '/admin' && 'bg-gradient-medium'
                            }`}
                        >
                            <PiHouse className="size-8" />
                        </Link>
                        {/* user links */}
                        <li
                            className={twMerge(
                                'relative p-4 rounded-full sm:px-6 px-4 hover:text-white hover:bg-gradient-medium transition-all duration-300',
                                (isUserOpen || userLinks.some((link) => pathname === link.path)) &&
                                    'bg-gradient-medium',
                            )}
                            onClick={toggleUser}
                        >
                            <PiUser className="size-8" />

                            {/* dropdown */}
                            <div
                                className={twMerge(
                                    'absolute -top-[138px] min-w-[200px] overflow-y-auto bg-white rounded-md shadow-md transition-all duration-500',
                                    isUserOpen ? 'visible h-[132px] opacity-100' : 'invisible h-0 opacity-0',
                                )}
                            >
                                <div className="flex flex-col">
                                    {userLinks.map((link) => (
                                        <Link
                                            href={link.path}
                                            key={link.name}
                                            className={twMerge(
                                                'p-2 px-4 active:bg-gradient-light active:text-white active:font-semibold transition-all duration-300',
                                                pathname === link.path && 'bg-gradient-light font-semibold text-white',
                                            )}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </li>
                        {/* product links */}
                        <li
                            className={twMerge(
                                'relative p-4 rounded-full sm:px-6 px-4 hover:text-white hover:bg-gradient-medium transition-all duration-300',
                                (isProductOpen || productLinks.some((link) => pathname === link.path)) &&
                                    'bg-gradient-medium',
                            )}
                            onClick={toggleProduct}
                        >
                            <GiSmartphone className="size-8" />

                            {/* dropdown */}
                            <div
                                className={twMerge(
                                    'absolute -top-[138px] min-w-[200px] overflow-y-auto bg-white rounded-md shadow-md transition-all duration-500',
                                    isProductOpen ? 'visible h-[132px] opacity-100' : 'invisible h-0 opacity-0',
                                )}
                            >
                                <div className="flex flex-col">
                                    {productLinks.map((link) => (
                                        <Link
                                            href={link.path}
                                            key={link.name}
                                            className={twMerge(
                                                'p-2 px-4 active:bg-gradient-light active:text-white active:font-semibold transition-all duration-300',
                                                pathname === link.path && 'bg-gradient-light font-semibold text-white',
                                            )}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </li>
                        {/* technical links */}
                        <li
                            className={twMerge(
                                'relative p-4 rounded-full sm:px-6 px-4 hover:text-white hover:bg-gradient-medium transition-all duration-300',
                                (isTechnicalOpen || technicalLinks.some((link) => pathname === link.path)) &&
                                    'bg-gradient-medium',
                            )}
                            onClick={toggleTechnical}
                        >
                            <GrTechnology className="size-8" />

                            {/* dropdown */}
                            <div
                                className={twMerge(
                                    'absolute -top-[138px] min-w-[200px] overflow-y-auto bg-white rounded-md shadow-md transition-all duration-500',
                                    isTechnicalOpen ? 'visible h-[132px] opacity-100' : 'invisible h-0 opacity-0',
                                )}
                            >
                                <div className="flex flex-col">
                                    {technicalLinks.map((link) => (
                                        <Link
                                            href={link.path}
                                            key={link.name}
                                            className={twMerge(
                                                'p-2 px-4 active:bg-gradient-light active:text-white active:font-semibold transition-all duration-300',
                                                pathname === link.path && 'bg-gradient-light font-semibold text-white',
                                            )}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </li>
                        <li
                            onClick={() => setOpenSettingModal(true)}
                            className="p-4 rounded-full sm:px-6 px-4 hover:text-white hover:bg-gradient-medium transition-all duration-300"
                        >
                            <PiGear className="size-8" />
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}
