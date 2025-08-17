'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Navigation } from 'swiper/modules';
import { Swiper as SwiperType } from 'swiper';
import Image from 'next/image';
import DeviceSliderBtn from './DeviceSliderBtn';
import { useEffect, useRef } from 'react';
import { useProductStore } from '@/store/productStore';
import { Link } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { formatPrice } from '@/lib/utils';

export default function TopDealsSlider() {
    const t = useTranslations('TopDeals');
    const locale = useLocale() as 'en' | 'vi';

    const swiperRef = useRef<SwiperType | null>(null);
    const { dealProducts, fetchDealProducts } = useProductStore();

    // Fetch 6 deal products on mount
    useEffect(() => {
        fetchDealProducts(6);
    }, [fetchDealProducts]);

    return (
        <>
            <Swiper
                modules={[Navigation]}
                breakpoints={{
                    320: { slidesPerView: 1, slidesPerGroup: 1 },
                    640: { slidesPerView: 2, slidesPerGroup: 1 },
                    768: { slidesPerView: 2, slidesPerGroup: 1 },
                    1024: { slidesPerView: 3, slidesPerGroup: 2 },
                    1280: { slidesPerView: 3, slidesPerGroup: 2 },
                }}
                spaceBetween={10}
                speed={700}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
                className="!py-4 !pr-4 lg:!pl-0"
            >
                {dealProducts.map(({ id, name, price, priceWithDiscount, images, promotions, slug }, index) => (
                    <SwiperSlide key={id}>
                        <Link href={`/collections/details/${slug}`}>
                            <div className="flex min-h-[312px] w-full cursor-pointer flex-col rounded-xl bg-white p-4 group/top-deal">
                                {/* Order */}
                                <div className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full border-4 border-gray-200 bg-gradient-light text-xs text-cover-deals">
                                    #<span className="ml-[1px] font-heading font-bold">{index + 1}</span>
                                </div>
                                {/* Image */}
                                <div className="mt-2">
                                    <div className="flex items-center justify-center">
                                        <div className="size-24">
                                            <Image
                                                src={images[0]?.url || '/placeholder.png'}
                                                alt={name}
                                                width={100}
                                                height={100}
                                                className="h-full w-full object-contain group-hover/top-deal:scale-105 transition-all duration-300"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-5 flex h-6 items-center gap-2 text-xs">
                                        {promotions?.[0]?.percentageNumber && (
                                            <div className="flex h-6 items-center justify-center rounded-sm bg-rose-500 px-2 text-[11px] font-extrabold text-white">
                                                {promotions[0].percentageNumber}% {t('off')}
                                            </div>
                                        )}
                                        <span className="font-extrabold text-rose-500">{t('deal')}</span>
                                    </div>
                                </div>
                                {/* Content */}
                                <div className="mt-3 flex flex-1 flex-col justify-between">
                                    <h3 className="text-sm xl:line-clamp-4 md:line-clamp-3 line-clamp-2">{name}</h3>
                                    <div className="flex items-center gap-2">
                                        {/* Original price (strikethrough) */}
                                        <h4 className="mt-5 text-sm line-through font-light dark:text-white">
                                            {formatPrice(price, locale)}
                                        </h4>
                                        {/* Discounted price */}
                                        <h4 className="mt-5 text-sm font-extrabold dark:text-white">
                                            {formatPrice(priceWithDiscount ?? price, locale)}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
            <DeviceSliderBtn swiperRef={swiperRef} />
        </>
    );
}
