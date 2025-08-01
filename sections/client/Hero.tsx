'use client';

import Button from '@/components/Button';
import ModelSlider from '@/components/model/ModelSlider';
import underlineImage from '@/public/underline.svg?url';
import { useTranslations } from 'next-intl';
import { animateScroll as scroll } from 'react-scroll';

export default function Hero() {
    const t = useTranslations('Hero');

    // Hàm xử lý scroll
    const handleScroll = () => {
        scroll.scrollMore(600, {
            smooth: true, // Hiệu ứng cuộn mượt mà
            duration: 700, // Thời gian cuộn (ms)
        });
    };

    return (
        <div className="h-screen">
            <div className="container h-full">
                <div className="flex justify-between items-center gap-12 h-full">
                    <div className="flex-1 h-full">
                        <div className="flex flex-col justify-center mt-[200px]">
                            <div className="inline-flex w-max items-center gap-2 px-3 py-2 rounded-full bg-gray-200 border">
                                <span className="size-3 rounded-full bg-conic-gradient relative">
                                    <div className="bg-conic-gradient absolute inset-0 rounded-full animate-ping-large"></div>
                                </span>
                                <span className="uppercase">{t('hashtag')}</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl max-w-5xl font-semibold leading-tight mt-2">
                                {t('titleSub')}{' '}
                                <span className="relative">
                                    <span>{t('titleMain')}</span>
                                    <span
                                        className="absolute w-full left-0 top-full -translate-y-1/2 h-4 bg-[linear-gradient(to_right,var(--color-amber-200),var(--color-teal-200),var(--color-violet-300),var(--color-fuchsia-300))]"
                                        style={{
                                            maskImage: `url(${underlineImage.src})`,
                                            maskSize: 'contain',
                                            maskPosition: 'center',
                                            maskRepeat: 'no-repeat',
                                        }}
                                    ></span>
                                </span>
                            </h1>
                            <p className="text-lg md:text-xl mt-8 max-w-3xl mx-auto">{t('description')}</p>
                            <p className="mt-8">
                                <Button onClick={handleScroll}>{t('exploreNow')}</Button>
                            </p>
                            <div className="flex items-center gap-4 pt-8 divide-x-[1px] divide-gray-300">
                                <div className="pr-4">
                                    <h2 className="text-4xl font-bold font-heading">
                                        16<span className="bg-gradient bg-clip-text text-transparent">%</span>
                                    </h2>
                                    <p className="text-sm font-extralight">{t('lessCommission')}</p>
                                </div>
                                <div className="px-4">
                                    <h2 className="text-4xl font-bold font-heading">
                                        25<span className="bg-gradient bg-clip-text text-transparent">K</span>
                                    </h2>
                                    <p className="text-sm font-extralight">{t('registeredUsers')}</p>
                                </div>
                                <div className="pl-4">
                                    <h2 className="text-4xl font-bold font-heading">
                                        95<span className="bg-gradient bg-clip-text text-transparent">%</span>
                                    </h2>
                                    <p className="text-sm font-extralight">{t('effectiveTrading')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="relative overflow-x-clip -mr-8">
                            <div className="absolute h-[710px] w-[1600px] bottom-0 left-1/2 -translate-x-1/2 bg-emerald-300/30 [mask-image:radial-gradient(50%_50%_at_top_center,black,transparent)] -z-10"></div>
                            <div className="absolute h-[710px] w-[1600px] bottom-0 left-1/2 -translate-x-1/2 bg-violet-300/30 [mask-image:radial-gradient(50%_50%_at_bottom_center,black,transparent)] -z-10"></div>
                            <ModelSlider />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
