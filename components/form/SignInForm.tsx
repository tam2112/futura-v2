'use client';

import Image from 'next/image';
import { Link, useRouter } from '@/i18n/navigation';
import { loginSchema, LoginSchema } from '@/lib/validation/user.form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { signInUser } from '@/lib/actions/user.action';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

import { RxEnvelopeClosed } from 'react-icons/rx';
import { PiEyeClosedLight, PiEyeLight } from 'react-icons/pi';

import heroImg from '@/public/log-hero-v3.png';
import { useAuth } from '@/context/AuthContext';
import { useLocale, useTranslations } from 'next-intl';
import { LoaderCircle } from 'lucide-react';

export default function SignInForm() {
    const t = useTranslations('SignInPage');
    const locale = useLocale() as 'en' | 'vi';
    const createLoginSchema = loginSchema(locale);

    const {
        register,
        handleSubmit,
        formState: { errors },
        clearErrors,
    } = useForm<LoginSchema>({
        resolver: zodResolver(createLoginSchema),
    });

    const router = useRouter();
    const currentLocale = useLocale();

    const [state] = useState({
        success: false,
        error: false,
        message: '',
    });
    const [loading, setLoading] = useState(false);

    // show and hide input type password
    const [showPassword, setShowPassword] = useState(false);

    const { setIsLoggedIn } = useAuth();

    const onSubmit = handleSubmit(async (data) => {
        setLoading(true);
        const response = await signInUser(state, data, locale);

        if (response.success) {
            if (response.token) {
                Cookies.set('token', response.token, { expires: 1 });
            }
            if (response.userId) {
                Cookies.set('userId', response.userId);
            }
            if (response.fullName) {
                Cookies.set('fullName', response.fullName);
            }
            if (response.email) {
                Cookies.set('email', response.email);
            }
            if (response.role) {
                Cookies.set('role', response.role);
            }
            setIsLoggedIn(true);
            toast(t('signInSuccess'));
            setLoading(false);

            // Redirect based on role
            if (response.role === 'admin') {
                await router.push('/admin', { locale: currentLocale });
            } else {
                await router.push('/', { locale: currentLocale });
            }
        } else {
            setLoading(false);
            toast.error(response.message || t('signInFailed'));
        }
    });

    return (
        <div className="sm:px-16 px-8 py-10 min-h-[500px] overflow-hidden">
            <div className="grid xl:grid-cols-2 grid-cols-1 h-[540px] bg-white relative rounded-lg">
                <div className="absolute w-full top-2 bottom-0 bg-gradient-light blur-md -z-10"></div>
                {/* image */}
                <div className="xl:flex hidden flex-col justify-center items-center h-full overflow-hidden rounded-lg">
                    <Image src={heroImg} alt="hero img" className="scale-[1.5] rounded-lg" />
                </div>
                {/* form */}
                <form onSubmit={onSubmit} className="flex flex-col justify-center items-center">
                    <h2 className="font-heading font-bold text-4xl mb-8">{t('logIn')}</h2>
                    <div>
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1">
                                <label htmlFor={'email'}>{t('email')}</label>
                                <div className="relative bg-white border border-black rounded-lg">
                                    <input
                                        type="email"
                                        {...register('email')}
                                        placeholder={`${t('emailPlaceholder')}`}
                                        className={`px-4 pl-[52px] py-2 min-w-[320px] rounded-lg outline-none`}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                onSubmit();
                                            }
                                        }}
                                    />
                                    <RxEnvelopeClosed className="absolute top-1/2 -translate-y-1/2 left-3" />
                                    <span className="absolute top-1/2 -translate-y-1/2 left-10 w-px h-[56%] bg-black"></span>
                                </div>
                                {errors.email?.message && (
                                    <p className="text-red-500 text-sm" style={{ maxWidth: '320px' }}>
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor={'password'}>{t('password')}</label>
                                <div className="relative bg-white border border-black rounded-lg">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        {...register('password')}
                                        placeholder={`${t('passwordPlaceholder')}`}
                                        className={`px-4 pl-[52px] py-2 min-w-[320px] rounded-lg outline-none`}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                onSubmit();
                                            }
                                        }}
                                    />
                                    <div
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute top-1/2 -translate-y-1/2 left-3"
                                    >
                                        {showPassword ? <PiEyeLight /> : <PiEyeClosedLight />}
                                    </div>
                                    <span className="absolute top-1/2 -translate-y-1/2 left-10 w-px h-[56%] bg-black"></span>
                                </div>
                                {errors.password?.message && (
                                    <p className="text-red-500 text-sm" style={{ maxWidth: '320px' }}>
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="space-y-3 mt-6">
                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-gradient-light w-full flex items-center justify-center py-2 rounded-lg font-bold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {t('logIn')} {loading && <LoaderCircle className="ml-1 animate-spin" />}
                                </button>
                            </div>
                            <div className="">
                                <p>
                                    {t('newCustomer')}{' '}
                                    <Link href="/sign-up" className="font-bold cursor-pointer hover:underline">
                                        {t('createAccount')}
                                    </Link>
                                </p>
                            </div>
                            <div className="">
                                <p>
                                    {t('lostPassword')}{' '}
                                    <Link href="/recover" className="font-bold cursor-pointer hover:underline">
                                        {t('recoverPassword')}
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
