import type { Metadata } from 'next';
import { Sora, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { StoreContextProvider } from '@/context/StoreContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from '@/context/ThemeContext';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';

const sora = Sora({
    subsets: ['latin'],
    variable: '--font-sora',
    weight: 'variable',
});
const spaceGroteskFont = Space_Grotesk({
    subsets: ['latin'],
    variable: '--font-space-grotesk',
    weight: 'variable',
});

export const metadata: Metadata = {
    title: 'Futuristic E-commerce 🛍️',
    description: 'Graduation project is made by Robert',
};

export default async function RootLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}>) {
    // Ensure that the incoming `locale` is valid
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={`${sora.variable} ${spaceGroteskFont.variable} font-body antialiased scrollbar`}>
                <NextIntlClientProvider>
                    <StoreContextProvider>
                        <AuthProvider>
                            <CartProvider>
                                <ThemeProvider>
                                    {children}
                                    <ToastContainer position="top-right" theme="light" />
                                </ThemeProvider>
                            </CartProvider>
                        </AuthProvider>
                    </StoreContextProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
