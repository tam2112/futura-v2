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
        <div className="flex justify-center items-center">
            <div className="px-[2rem] h-full">
                <div className="flex justify-between items-center gap-12 h-full">
                    <div className="flex-1 h-full">
                        <div className="flex flex-col justify-center sm:mt-[200px] mt-[140px]">
                            {/* hashtag */}
                            <div className="inline-flex w-max items-center gap-2 px-3 py-2 rounded-full bg-gray-100 border border-gray-700 mx-auto lg:mx-0">
                                <span className="size-4 rounded-full bg-conic-gradient relative">
                                    <div className="bg-conic-gradient absolute inset-0 rounded-full animate-ping"></div>
                                </span>
                                <span className="uppercase">{t('hashtag')}</span>
                            </div>
                            {/* title */}
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl lg:max-w-5xl max-w-2xl md:mx-auto font-semibold leading-tight mt-2 text-center lg:text-left">
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
                            {/* description */}
                            <p className="text-sm xl:text-xl md:text-lg sm:text-base xl:mt-8 mt-6 lg:max-w-3xl max-w-xl mx-auto text-center lg:text-left text-gray-800">
                                {t('description')}
                            </p>
                            {/* explore button */}
                            <p className="xl:mt-8 mt-6 mx-auto lg:mx-0">
                                <Button onClick={handleScroll}>{t('exploreNow')}</Button>
                            </p>
                            {/* stats */}
                            <div className="hidden lg:flex items-center gap-4 pt-8 divide-x-[1px] divide-gray-300">
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
                    <div className="flex-1 hidden lg:block">
                        <div className="relative overflow-x-clip -mr-8">
                            <div className="absolute h-[710px] xl:w-[1600px] lg:w-[420px] bottom-0 left-1/2 -translate-x-1/2 bg-emerald-300/30 [mask-image:radial-gradient(50%_50%_at_top_center,black,transparent)] -z-10"></div>
                            <div className="absolute h-[710px] xl:w-[1600px] lg:w-[420px] bottom-0 left-1/2 -translate-x-1/2 bg-violet-300/30 [mask-image:radial-gradient(50%_50%_at_bottom_center,black,transparent)] -z-10"></div>
                            <ModelSlider />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
