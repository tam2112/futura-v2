'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Swiper as SwiperType } from 'swiper';
import { Navigation } from 'swiper/modules';
import Image from 'next/image';
import DeviceSliderBtn from './DeviceSliderBtn';
import { useRef } from 'react';
import { Link } from '@/i18n/navigation';
import { formatPrice } from '@/lib/utils';
import { useLocale } from 'next-intl';

interface DeviceSliderProps {
    data: {
        id: string;
        title: string;
        price: number;
        img: string;
        href: string;
    }[];
}

export default function DeviceSlider({ data }: DeviceSliderProps) {
    const swiperRef = useRef<SwiperType | null>(null);

    const locale = useLocale() as 'en' | 'vi';

    return (
        <>
            <Swiper
                modules={[Navigation]}
                breakpoints={{
                    320: { slidesPerView: 1, slidesPerGroup: 1 },
                    640: { slidesPerView: 2, slidesPerGroup: 1 },
                    768: { slidesPerView: 3, slidesPerGroup: 1 },
                    1024: { slidesPerView: 4, slidesPerGroup: 2 },
                    1280: { slidesPerView: 5, slidesPerGroup: 2 },
                }}
                spaceBetween={10}
                speed={700}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
                onSlideChange={() => console.log('slide change')}
            >
                {data.map(({ id, title, price, img, href }) => (
                    <SwiperSlide key={id}>
                        <Link
                            href={href}
                            className="flex min-h-[306px] w-full flex-col items-center justify-center rounded-xl border border-gray-300 bg-white group/device-popular transition-all duration-300"
                        >
                            <div className="block w-full px-2 py-4 xs:px-3 sm:py-5">
                                <div className="relative pb-[75%]">
                                    <div className="absolute left-0 top-1/2 h-3/4 w-full -translate-y-1/2">
                                        <div>
                                            <Image
                                                src={img}
                                                alt={title}
                                                width={200}
                                                height={200}
                                                sizes="100vw"
                                                className="object-contain group-hover/device-popular:scale-95 transition-all duration-300"
                                                style={{
                                                    position: 'absolute',
                                                    height: '100%',
                                                    width: '100%',
                                                    inset: '0px',
                                                    color: 'transparent',
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <h3 className="two-line-ellipsis text-center font-heading text-xs font-bold text-gray-700 xxs:text-sm">
                                    {title}
                                </h3>
                                <div className="text-center text-xs text-gray-700">{formatPrice(price, locale)}</div>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
            <DeviceSliderBtn swiperRef={swiperRef} />
        </>
    );
}
