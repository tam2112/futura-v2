import Header from '@/sections/admin/Header';
import Sidebar from '@/sections/admin/Sidebar';
import SidebarVertical from '@/sections/admin/SidebarVertical';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin Panel',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-slate-100 min-h-screen [&::-webkit-scrollbar]:w-0">
            <div className="hidden xl:block">
                <Sidebar />
            </div>
            <div className="xl:hidden">
                <SidebarVertical />
            </div>
            <Header />
            <div className="xl:ml-[270px] px-[2rem] pt-[15px] pb-32 xl:pb-0 overflow-x-hidden">{children}</div>
        </div>
    );
}
