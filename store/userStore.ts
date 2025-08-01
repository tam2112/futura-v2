import { getUserCount } from '@/lib/actions/user.action';
import { getUserRoleDistribution, getUserRegistrationOverTime } from '@/lib/actions/chart.action';
import { create } from 'zustand';

type UserStore = {
    userCount: number;
    formattedUserCount: string;
    roleDistribution: { role: string; count: number }[];
    registrationOverTime: { date: string; count: number }[];
    fetchUserCount: () => Promise<void>;
    fetchRoleDistribution: () => Promise<void>;
    fetchRegistrationOverTime: () => Promise<void>;
};

export const useUserStore = create<UserStore>((set) => ({
    userCount: 0,
    formattedUserCount: '0',
    roleDistribution: [],
    registrationOverTime: [],
    fetchUserCount: async () => {
        try {
            const count = await getUserCount();
            const formatNumber = (num: number): string => {
                if (num >= 1_000_000) {
                    return `${(num / 1_000_000).toFixed(1)}M`;
                } else if (num >= 1_000) {
                    return `${(num / 1_000).toFixed(1)}K`;
                }
                return num.toString();
            };
            set({
                userCount: count,
                formattedUserCount: formatNumber(count),
            });
        } catch (error) {
            console.error('Error fetching user count:', error);
            set({ userCount: 0, formattedUserCount: '0' });
        }
    },
    fetchRoleDistribution: async () => {
        try {
            const data = await getUserRoleDistribution();
            set({ roleDistribution: data });
        } catch (error) {
            console.error('Error fetching role distribution:', error);
            set({ roleDistribution: [] });
        }
    },
    fetchRegistrationOverTime: async () => {
        try {
            const data = await getUserRegistrationOverTime();
            set({ registrationOverTime: data });
        } catch (error) {
            console.error('Error fetching registration over time:', error);
            set({ registrationOverTime: [] });
        }
    },
}));
