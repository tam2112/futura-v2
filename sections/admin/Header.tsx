'use client';

import Image from 'next/image';
import { CiBellOn } from 'react-icons/ci';
import { Tooltip } from 'react-tooltip';
import Cookies from 'js-cookie';
import { useRouter } from '@/i18n/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
    const fullName = Cookies.get('fullName') || 'Robert';
    const role = Cookies.get('role') || 'Admin';
    const router = useRouter();
    const { logout } = useAuth();

    return (
        <div className="xl:ml-[280px] pt-[20px] pb-[15px] px-[2rem] flex justify-end items-center">
            {/* On/Off sidebar */}
            {/* <div
                className="relative bg-white p-1.5 rounded-full cursor-pointer"
                data-tooltip-id="view-tooltip"
                data-tooltip-content="On/Off sidebar"
            >
                <CiViewBoard size={20} />
            </div> */}
            <Tooltip id="view-tooltip" />
            {/* interactive */}
            <div className="flex items-center gap-5">
                <div className="relative bg-white p-1.5 rounded-full">
                    <CiBellOn size={20} />
                    <div className="absolute -top-3 -right-3 bg-conic-gradient px-2 py-1 text-white font-semibold rounded-full text-[8px]">
                        1
                    </div>
                </div>
                <div>
                    <h4 className="text-sm font-semibold capitalize">{fullName}</h4>
                    <p className="text-[10px] text-right text-gray-400 leading-none capitalize">{role}</p>
                </div>
                <div>
                    <Image src="/default-avatar.png" alt="" width={24} height={24} className="rounded-full" />
                </div>
            </div>
        </div>
    );
}
