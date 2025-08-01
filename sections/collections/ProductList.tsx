'use client';

import PriceRange from '@/components/client/PriceRange';
import { useAnimate } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { CiFilter } from 'react-icons/ci';
import { SlArrowDown } from 'react-icons/sl';
import Loader from '@/components/Loader';
import { debounce } from 'lodash';
import { Link } from '@/i18n/navigation';
import GoToTop from '@/components/GoToTop';
import { useLocale, useTranslations } from 'next-intl';

type Product = {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    priceWithDiscount?: number | null;
    quantity: number;
    images: { url: string }[];
    brand?: { id: string; name: string } | null | undefined;
    color?: { id: string; name: string; hex: string } | null | undefined;
    storage?: { id: string; name: string } | null | undefined;
    connectivity?: { id: string; name: string } | null | undefined;
    simSlot?: { id: string; title: string } | null | undefined;
    batteryHealth?: { id: string; title: string } | null | undefined;
    ram?: { id: string; title: string } | null | undefined;
    cpu?: { id: string; name: string } | null | undefined;
    screenSize?: { id: string; name: string } | null | undefined;
    type?: { id: string; name: string } | null | undefined;
    category: { id: string; name: string; slug: string };
    promotions?: { percentageNumber: number }[] | null | undefined;
    createdDate: Date;
};

type FilterOption = {
    id: string;
    name: string | number;
};

type FilterDataMap = {
    Category?: FilterOption[];
    Brand: FilterOption[];
    Color: FilterOption[];
    Storage: FilterOption[];
    Connectivity: FilterOption[];
    'Sim slot': FilterOption[];
    'Battery Health': FilterOption[];
    Ram: FilterOption[];
    Cpu: FilterOption[];
    'Screen size': FilterOption[];
    Type: FilterOption[];
};

type SortOption = {
    id: string;
    title: string;
    sortFn: (a: Product, b: Product) => number;
};

interface ProductListProps {
    initialProducts: Product[];
    showCategoriesFilter?: boolean;
}

export default function ProductList({ initialProducts, showCategoriesFilter = false }: ProductListProps) {
    const t = useTranslations('ProductList');
    const locale = useLocale() as 'en' | 'vi';

    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [priceRange, setPriceRange] = useState([0, Math.max(...initialProducts.map((p) => p.price), 0)]);
    const [filters, setFilters] = useState<Record<string, string[]>>({});
    const [sortOption, setSortOption] = useState<string>('latest');
    const [isLoading, setIsLoading] = useState(false);
    const [filterScope, filterAnimate] = useAnimate();
    const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({});
    const filterRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const debouncedSetFilters = debounce(setFilters, 300);

    // Fixed exchange rate (1 USD = 25,000 VND)
    const EXCHANGE_RATE = 25000;

    // Function to convert and format price based on locale
    const formatPrice = (priceInUSD: number) => {
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

    // Adjust price range for VND if locale is 'vi'
    const maxPriceInUSD = Math.max(...initialProducts.map((p) => p.priceWithDiscount || p.price), 0);
    const displayMaxPrice = locale === 'vi' ? maxPriceInUSD * EXCHANGE_RATE : maxPriceInUSD;

    // Calculate filter options dynamically
    const filterDataMap: FilterDataMap = {
        ...(showCategoriesFilter && {
            Category: Array.from(new Set(initialProducts.map((p) => p.category?.id).filter(Boolean)))
                .map((id) => initialProducts.find((p) => p.category?.id === id)!.category!)
                .map((c) => ({ id: c.id, name: c.name })),
        }),
        Brand: Array.from(new Set(initialProducts.map((p) => p.brand?.id).filter(Boolean)))
            .map((id) => initialProducts.find((p) => p.brand?.id === id)!.brand!)
            .map((b) => ({ id: b.id, name: b.name })),
        Color: Array.from(new Set(initialProducts.map((p) => p.color?.id).filter(Boolean)))
            .map((id) => initialProducts.find((p) => p.color?.id === id)!.color!)
            .map((c) => ({ id: c.id, name: c.name })),
        Storage: Array.from(new Set(initialProducts.map((p) => p.storage?.id).filter(Boolean)))
            .map((id) => initialProducts.find((p) => p.storage?.id === id)!.storage!)
            .map((s) => ({ id: s.id, name: s.name })),
        Connectivity: Array.from(new Set(initialProducts.map((p) => p.connectivity?.id).filter(Boolean)))
            .map((id) => initialProducts.find((p) => p.connectivity?.id === id)!.connectivity!)
            .map((c) => ({ id: c.id, name: c.name })),
        'Sim slot': Array.from(new Set(initialProducts.map((p) => p.simSlot?.id).filter(Boolean)))
            .map((id) => initialProducts.find((p) => p.simSlot?.id === id)!.simSlot!)
            .map((s) => ({ id: s.id, name: s.title })),
        'Battery Health': Array.from(new Set(initialProducts.map((p) => p.batteryHealth?.id).filter(Boolean)))
            .map((id) => initialProducts.find((p) => p.batteryHealth?.id === id)!.batteryHealth!)
            .map((b) => ({ id: b.id, name: b.title })),
        Ram: Array.from(new Set(initialProducts.map((p) => p.ram?.id).filter(Boolean)))
            .map((id) => initialProducts.find((p) => p.ram?.id === id)!.ram!)
            .map((r) => ({ id: r.id, name: r.title })),
        Cpu: Array.from(new Set(initialProducts.map((p) => p.cpu?.id).filter(Boolean)))
            .map((id) => initialProducts.find((p) => p.cpu?.id === id)!.cpu!)
            .map((r) => ({ id: r.id, name: r.name })),
        'Screen size': Array.from(new Set(initialProducts.map((p) => p.screenSize?.id).filter(Boolean)))
            .map((id) => initialProducts.find((p) => p.screenSize?.id === id)!.screenSize!)
            .map((r) => ({ id: r.id, name: r.name })),
        Type: Array.from(new Set(initialProducts.map((p) => p.type?.id).filter(Boolean)))
            .map((id) => initialProducts.find((p) => p.type?.id === id)!.type!)
            .map((r) => ({ id: r.id, name: r.name })),
    };

    // Sort options
    const sortOptions: SortOption[] = [
        {
            id: 'latest',
            title: t('latestRelease'),
            sortFn: (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime(),
        },
        {
            id: 'oldest',
            title: t('oldRelease'),
            sortFn: (a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime(),
        },
        {
            id: 'price-low',
            title: t('priceLowToHigh'),
            sortFn: (a, b) => (a.priceWithDiscount || a.price) - (b.priceWithDiscount || b.price),
        },
        {
            id: 'price-high',
            title: t('priceHighToLow'),
            sortFn: (a, b) => (b.priceWithDiscount || b.price) - (a.priceWithDiscount || a.price),
        },
    ];

    // Filter and sort products with delay
    useEffect(() => {
        setIsLoading(true);
        const timeout = setTimeout(() => {
            let filteredProducts = [...initialProducts];

            // Filter by price range
            filteredProducts = filteredProducts.filter(
                (p) =>
                    (p.priceWithDiscount || p.price) >= priceRange[0] &&
                    (p.priceWithDiscount || p.price) <= priceRange[1],
            );

            // Filter by technical attributes
            Object.entries(filters).forEach(([key, selectedIds]) => {
                if (selectedIds.length > 0) {
                    filteredProducts = filteredProducts.filter((p) => {
                        // Map filter key to product field
                        const fieldMap: Record<string, keyof Product> = {
                            Category: 'category',
                            Brand: 'brand',
                            Color: 'color',
                            Storage: 'storage',
                            Connectivity: 'connectivity',
                            'Sim slot': 'simSlot',
                            'Battery Health': 'batteryHealth',
                            Ram: 'ram',
                            Cpu: 'cpu',
                            'Screen size': 'screenSize',
                            Type: 'type',
                        };

                        const field = fieldMap[key];
                        if (!field) {
                            console.warn(`Unknown filter key: ${key}`);
                            return true; // Skip unknown filters
                        }

                        const value = p[field] as any;
                        return value && selectedIds.includes(value.id);
                    });
                }
            });

            // Sort
            const selectedSort = sortOptions.find((opt) => opt.id === sortOption);
            if (selectedSort) {
                filteredProducts.sort(selectedSort.sortFn);
            }

            setProducts(filteredProducts);
            setIsLoading(false);
        }, 500); // Delay 0.5 seconds

        return () => clearTimeout(timeout); // Cleanup timeout
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [priceRange, filters, sortOption, initialProducts]);

    const handleFilterClick = (filterName: string) => {
        setOpenFilters((prev) => ({
            ...prev,
            [filterName]: !prev[filterName],
        }));
    };

    const handleFilterChange = (filterName: string, id: string) => {
        debouncedSetFilters((prev) => {
            const selectedIds = prev[filterName] || [];
            if (selectedIds.includes(id)) {
                return {
                    ...prev,
                    [filterName]: selectedIds.filter((selectedId) => selectedId !== id),
                };
            } else {
                return {
                    ...prev,
                    [filterName]: [...selectedIds, id],
                };
            }
        });
    };

    const handlePriceRangeChange = (newValues: number[]) => {
        setPriceRange(newValues);
    };

    useEffect(() => {
        Object.entries(openFilters).forEach(([filterName, isOpen]) => {
            const filterElement = filterRefs.current[filterName];
            if (filterElement) {
                filterAnimate(
                    filterElement,
                    {
                        maxHeight: isOpen ? '288px' : '0px',
                    },
                    {
                        duration: 0.1,
                    },
                );
            }
        });
    }, [openFilters, filterAnimate]);

    return (
        <>
            <GoToTop />
            <div className="min-h-[70vh]">
                <div className="container pb-8">
                    <div className="mt-5 grid grid-cols-12 gap-x-5">
                        {/* Attribute Filters */}
                        <section className="col-span-4 hidden h-fit rounded-md border lg:block xl:col-span-3">
                            <div className="group grid divide-y">
                                <div className="px-4 pt-4">
                                    <div>
                                        <h2 className="mb-2 text-base font-bold capitalize text-gray-700 xs:mb-3 lg:text-sm lg:uppercase">
                                            {t('priceRange')}
                                        </h2>
                                        <div className="price-span grid grid-cols-2 gap-2">
                                            <input
                                                className="rounded bg-gray-200 py-2 px-3 text-base text-gray-700 xs:py-3.5 xl:text-sm outline-none"
                                                value={formatPrice(
                                                    priceRange[0] / (locale === 'vi' ? EXCHANGE_RATE : 1),
                                                )}
                                                readOnly
                                            />
                                            <input
                                                className="rounded bg-gray-200 py-2 px-3 text-base text-gray-700 xs:py-3.5 xl:text-sm outline-none"
                                                value={formatPrice(
                                                    priceRange[1] / (locale === 'vi' ? EXCHANGE_RATE : 1),
                                                )}
                                                readOnly
                                            />
                                        </div>
                                        <div className="py-[30px]">
                                            <PriceRange
                                                onPriceRangeChange={handlePriceRangeChange}
                                                maxPrice={displayMaxPrice}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="divide-y">
                                    {Object.entries(filterDataMap)
                                        .filter(([_, options]) => options.length > 0)
                                        .map(([filterName]) => (
                                            <div key={filterName} className="bg-white">
                                                <div
                                                    className="cursor-pointer mb-3 flex items-center justify-between px-4 pt-4"
                                                    onClick={() => handleFilterClick(filterName)}
                                                >
                                                    <h3 className="flex w-full cursor-pointer items-center gap-2 text-sm font-bold uppercase text-gray-700">
                                                        <div>
                                                            <div className="h-[2px] w-[10px] bg-gray-700"></div>
                                                            <div className="mx-auto -mt-[6px] h-[10px] w-[2px] bg-gray-700 transition-all duration-150 ease-in-out"></div>
                                                        </div>
                                                        {t(`${filterName}`)}
                                                    </h3>
                                                </div>
                                                <div
                                                    className="overflow-auto transition-all duration-300 ease-in-out px-4 max-h-0"
                                                    ref={(el) => {
                                                        filterRefs.current[filterName] = el;
                                                    }}
                                                >
                                                    {filterDataMap[filterName as keyof FilterDataMap]?.map((item) => (
                                                        <label
                                                            key={item.id}
                                                            className="mb-2 block cursor-pointer text-sm text-gray-700"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                className="peer relative top-[2px] mr-2 h-[15px] w-[15px] accent-gray-700"
                                                                checked={
                                                                    filters[filterName]?.includes(item.id) || false
                                                                }
                                                                onChange={() => handleFilterChange(filterName, item.id)}
                                                            />
                                                            <span className="peer-disabled:opacity-70">
                                                                {item.name}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </section>
                        {/* Product List */}
                        <section className="col-span-12 gap-x-5 lg:col-span-8 xl:col-span-9">
                            {/* Filter Buttons */}
                            <div className="grid grid-cols-12 gap-y-2.5 gap-x-5">
                                <div className="order-2 col-span-12 lg:order-1 lg:col-span-9">
                                    <div className="hide-scrollbar flex flex-nowrap gap-1 overflow-hidden overflow-x-scroll">
                                        {filterDataMap.Category?.map(({ id, name }) => (
                                            <button
                                                key={id}
                                                className={`flex h-10 shrink-0 items-center justify-center rounded-md border px-3 text-sm outline-none transition duration-300 ease-in-out disabled:opacity-40 hover:cursor-pointer ${
                                                    filters.Category?.includes(id)
                                                        ? 'bg-gradient-light'
                                                        : 'hover:bg-gradient-light'
                                                }`}
                                                onClick={() => handleFilterChange('Category', id)}
                                            >
                                                {name}
                                            </button>
                                        ))}
                                        {filterDataMap.Brand.map(({ id, name }) => (
                                            <button
                                                key={id}
                                                className={`flex h-10 shrink-0 items-center justify-center rounded-md border px-3 text-sm outline-none transition duration-300 ease-in-out disabled:opacity-40 hover:cursor-pointer ${
                                                    filters.Brand?.includes(id)
                                                        ? 'bg-gradient-light'
                                                        : 'hover:bg-gradient-light'
                                                }`}
                                                onClick={() => handleFilterChange('Brand', id)}
                                            >
                                                {name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="order-1 col-span-12 mr-[-2px] grid h-10 grid-cols-2 divide-x rounded-md border text-sm lg:order-2 lg:col-span-3 lg:grid-cols-1 lg:divide-x-0">
                                    <button className="flex items-center justify-center gap-x-3 disabled:opacity-40 lg:hidden hover:underline hover:underline-offset-2">
                                        {t('filters')}
                                        <div className="h-4 w-4">
                                            <CiFilter size={50} />
                                        </div>
                                    </button>
                                    <div className="relative z-20 opacity-100 group">
                                        <button className="flex h-full w-full items-center justify-center gap-x-3 px-3 lg:justify-between">
                                            <span className="block truncate">
                                                {sortOptions.find((opt) => opt.id === sortOption)?.title ||
                                                    t('latestRelease')}
                                            </span>
                                            <span>
                                                <div className="relative h-[6px] w-[12px] xs:h-[7px] xs:w-[14px]">
                                                    <SlArrowDown
                                                        width={10}
                                                        height={5}
                                                        className="group-hover:rotate-180 transition-transform duration-500"
                                                    />
                                                </div>
                                            </span>
                                        </button>
                                        <ul
                                            className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 w-full rounded border bg-white transition-all duration-500"
                                            style={{ boxShadow: 'rgba(0, 0, 0, 0.1) 0px 15px 20px -10px' }}
                                        >
                                            {sortOptions.map(({ id, title }) => (
                                                <button
                                                    key={id}
                                                    className="group relative w-full py-2 text-left hover:underline"
                                                    onClick={() => setSortOption(id)}
                                                >
                                                    <span className="absolute inline-block h-[6px] w-[6px] -translate-y-1/2 rounded-full ring-gray-700 ring-offset-white left-4 top-1/2 border-none bg-white ring-[1px] ring-offset-[1.5px]"></span>
                                                    <span className="ml-9 block truncate font-normal">{title}</span>
                                                </button>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            {/* Product Grid */}
                            {isLoading ? (
                                <div className="flex justify-center items-center">
                                    <Loader />
                                </div>
                            ) : products.length === 0 ? (
                                <div className="flex justify-center items-center h-[300px] text-gray-700">
                                    {t('noProductFound')}
                                </div>
                            ) : (
                                <div className="mt-2.5 grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 xl:!grid-cols-4">
                                    {products.map(
                                        ({ id, name, images, price, priceWithDiscount, slug, promotions }) => (
                                            <div
                                                key={id}
                                                className="mr-[-1px] mb-[-1px] flex flex-col border border-gray-100 bg-white px-2 pt-5 pb-3 xs:px-4 xs:pt-7 xs:pb-3 group/collections-device"
                                            >
                                                <Link href={`/collections/details/${slug}`}>
                                                    <div className="flex h-full flex-col gap-3">
                                                        <div className="flex-1 px-3">
                                                            <div className="relative h-full min-h-[100px] w-full">
                                                                <Image
                                                                    src={images[0]?.url || '/placeholder.png'}
                                                                    alt={`${name}-${id}`}
                                                                    width={280}
                                                                    height={120}
                                                                    className="h-[18vw] object-contain xs:h-[13vw] sm:h-[10vw] lg:h-[7vw] xl:h-[95px] group-hover/collections-device:scale-95 transition-all duration-300"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-1 items-center justify-between">
                                                            <div className="w-full">
                                                                <h3 className="three-line-ellipsis text-sm">{name}</h3>
                                                                <div className="mt-3 flex items-center justify-between">
                                                                    <div className="flex flex-col justify-center">
                                                                        {priceWithDiscount && (
                                                                            <h3 className="text-sm font-semibold">
                                                                                {formatPrice(priceWithDiscount)}
                                                                            </h3>
                                                                        )}
                                                                        {priceWithDiscount ? (
                                                                            <h4 className="text-xs text-slate-gray-300 line-through">
                                                                                {formatPrice(price)}
                                                                            </h4>
                                                                        ) : (
                                                                            <h4 className="text-sm font-semibold">
                                                                                {formatPrice(price)}
                                                                            </h4>
                                                                        )}
                                                                    </div>
                                                                    {priceWithDiscount &&
                                                                        promotions?.[0]?.percentageNumber && (
                                                                            <div className="mb-2 ml-2 flex items-center justify-center rounded-full bg-rose-500 px-2 py-0.5 text-[11px] text-white xs:mb-0 xs:ml-1 sm:ml-0">
                                                                                {t('save')}{' '}
                                                                                <span className="ml-1 font-semibold">
                                                                                    {promotions[0].percentageNumber}%
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        ),
                                    )}
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}
