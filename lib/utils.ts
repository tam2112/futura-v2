import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const generateSlug = (name: string): string => {
    return name
        .toLowerCase()
        .replace(/\s+/g, '-') // Thay khoảng trắng bằng dấu gạch ngang
        .replace(/[^\w\-]+/g, '') // Loại bỏ ký tự đặc biệt
        .replace(/\-\-+/g, '-') // Giảm nhiều gạch ngang liên tiếp thành 1
        .replace(/^-+/, '') // Loại bỏ gạch ngang ở đầu
        .replace(/-+$/, ''); // Loại bỏ gạch ngang ở cuối
};

export function formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

// Fixed exchange rate (1 USD = 25,000 VND)
export const EXCHANGE_RATE = 25000;

// Function to convert and format price based on locale
export const formatPrice = (priceInUSD: number, locale: string) => {
    if (locale === 'vi') {
        const priceInVND = priceInUSD * EXCHANGE_RATE;
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(priceInVND);
    }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(priceInUSD);
};

export const formatPriceInDetails = (priceInUSD: number, locale: string) => {
    let integerPart: string;
    let fractionalPart: string;

    if (locale === 'vi') {
        const priceInVND = priceInUSD * EXCHANGE_RATE;
        const priceInThousands = priceInVND / 1000;
        const [int, frac = '0'] = priceInThousands.toFixed(3).split('.');
        integerPart = Number(int).toLocaleString('vi-VN');
        fractionalPart = frac.padEnd(3, '0');
    } else {
        const [int, frac = '0'] = priceInUSD.toFixed(2).split('.');
        integerPart = Number(int).toLocaleString('en-US');
        fractionalPart = frac.padEnd(2, '0');
    }

    return {
        integerPart,
        fractionalPart,
        currency: locale === 'vi' ? 'VND' : 'USD',
    };
};
