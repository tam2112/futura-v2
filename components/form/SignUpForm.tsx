'use client';

import Image from 'next/image';
import { Link, useRouter } from '@/i18n/navigation';
import { signUpSchema, SignUpSchema } from '@/lib/validation/user.form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormState } from 'react-dom';
import { useEffect, useState, useTransition } from 'react';
import { signUpUser } from '@/lib/actions/user.action';
import { toast } from 'react-toastify';

import { RxEnvelopeClosed } from 'react-icons/rx';
import { TbUserEdit } from 'react-icons/tb';
import { PiEyeClosedLight, PiEyeLight } from 'react-icons/pi';

import heroImg from '@/public/log-hero-v3.png';
import InputField from './InputField';
import { useLocale, useTranslations } from 'next-intl';
import { LoaderCircle } from 'lucide-react';

export default function SignUpForm() {
    const t = useTranslations('SignUpPage');
    const locale = useLocale() as 'en' | 'vi';
    const createSignUpSchema = signUpSchema(locale);

    const {
        register,
        handleSubmit,
        formState: { errors },
        clearErrors,
    } = useForm<SignUpSchema>({
        resolver: zodResolver(createSignUpSchema),
    });

    const router = useRouter();
    const currentLocale = useLocale();

    const [state, formAction] = useFormState(signUpUser, {
        success: false,
        error: false,
    });
    const [isPending, startTransition] = useTransition();

    const onSubmit = handleSubmit((data) => {
        console.log(data);
        startTransition(() => {
            formAction({ ...data });
        });
    });

    useEffect(() => {
        console.log('State updated:', state);
        if (state.success) {
            toast(t('signUpSuccess'));
            router.push('/sign-in', { locale: currentLocale });
        }
        if (state.error) {
            toast.error(state.message);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state, router, currentLocale]);

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
                    <h2 className="font-heading font-bold text-4xl mb-8">{t('signUp')}</h2>
                    <div>
                        <div className="space-y-4">
                            <InputField
                                label={t('fullName')}
                                name="fullName"
                                register={register}
                                error={errors.fullName}
                                icon={<TbUserEdit className="absolute top-1/2 -translate-y-1/2 left-3" />}
                            />
                            <InputField
                                label={t('email')}
                                name="email"
                                type="email"
                                register={register}
                                error={errors.email}
                                icon={<RxEnvelopeClosed className="absolute top-1/2 -translate-y-1/2 left-3" />}
                            />
                            <InputField
                                label={t('password')}
                                name="password"
                                className="pr-8"
                                register={register}
                                error={errors.password}
                                iconEyeOff={<PiEyeClosedLight className="absolute top-1/2 -translate-y-1/2 left-3" />}
                                iconEyeOn={<PiEyeLight className="absolute top-1/2 -translate-y-1/2 left-3" />}
                            />
                        </div>
                        <div className="space-y-3 mt-6">
                            <div>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="bg-gradient-light w-full flex items-center justify-center py-2 rounded-lg font-bold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {t('createAccount')} {isPending && <LoaderCircle className="ml-1 animate-spin" />}
                                </button>
                            </div>
                            <div className="">
                                <p>
                                    {t('alreadyMember')} {t('logIn')}{' '}
                                    <Link href="/sign-in" className="font-bold cursor-pointer hover:underline">
                                        {t('here')}
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
