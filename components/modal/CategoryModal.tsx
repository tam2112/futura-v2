'use client';

import { useAnimate } from 'framer-motion';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import LogoWithName from '../client/LogoWithName';
import { HiOutlineChevronDown, HiOutlineChevronUp, HiOutlineXMark } from 'react-icons/hi2';
import hotDealsImg from '@/public/hot-deals.png';
import Image from 'next/image';
import Button from '../Button';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '@/context/AuthContext';
import { PiShoppingBagOpenLight, PiSignOut, PiUser } from 'react-icons/pi';
import { Link, useRouter } from '@/i18n/navigation';
import { useCategoryStore } from '@/store/categoryStore';
import { useTranslations } from 'next-intl';
import { CiSearch } from 'react-icons/ci';
import { getProducts } from '@/lib/actions/product.action';
import { debounce } from 'lodash';
import Loader from '../Loader';
import { useMediaQuery } from 'react-responsive';
import LanguageSelect from '../LanguageSelect';
import DarkModeSwitch from '../DarkModeSwitch';

type CategoryModalType = {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function CategoryModal({ isOpen, setIsOpen }: CategoryModalType) {
    const t = useTranslations('CategoryModal');
    const n = useTranslations('Navigation');

    const [navScope, navAnimate] = useAnimate();
    const [showOverlay, setShowOverlay] = useState(false);
    const [showAllCategories, setShowAllCategories] = useState(false);
    const { trendingCategories, categories, fetchTrendingCategories, fetchCategories } = useCategoryStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    const router = useRouter();

    const { isLoggedIn } = useAuth();

    useEffect(() => {
        // Gọi fetchCategories khi component mount
        fetchTrendingCategories();
    }, [fetchTrendingCategories]);

    useEffect(() => {
        // Gọi fetchCategories khi component mount
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        if (isOpen) {
            setShowOverlay(true);
            navAnimate(
                navScope.current,
                {
                    transform: isMobile ? 'translateX(0%)' : 'translateX(0%)', // Both start at 0% when open
                },
                {
                    duration: 0.5,
                },
            );
        } else {
            navAnimate(
                navScope.current,
                {
                    transform: isMobile ? 'translateX(100%)' : 'translateX(-100%)', // Right for mobile, left for others
                },
                {
                    duration: 0.5,
                },
            );
            setTimeout(() => {
                setShowOverlay(false);
            }, 500);
        }
    }, [isOpen, navAnimate, navScope, isMobile]);

    const fetchSuggestions = async (query: string) => {
        if (query.trim() === '') {
            setSuggestions([]);
            setIsSuggestionsOpen(false);
            return;
        }

        try {
            const products = await getProducts();
            const filteredProducts = (products ?? [])
                .filter((product: any) => product.name.toLowerCase().includes(query.toLowerCase()))
                .slice(0, 5); // Limit to 5 suggestions
            setSuggestions(filteredProducts);
            setIsSuggestionsOpen(true);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestions([]);
            setIsSuggestionsOpen(false);
        }
    };

    const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        debouncedFetchSuggestions(query);
    };

    const handleSuggestionClick = (slug: string) => {
        setSearchQuery('');
        setSuggestions([]);
        setIsSuggestionsOpen(false);
        setIsLoading(true); // Show loader
        setTimeout(() => {
            setIsLoading(false); // Hide loader
            router.push(`/collections/details/${slug}`);
        }, 500); // 0.5-second delay
    };

    return (
        <>
            {/* Loader */}
            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/10">
                    <Loader />
                </div>
            )}
            {/* Overlay */}
            {showOverlay && (
                <div
                    className={twMerge(
                        'fixed inset-0 top-0 left-0 w-full h-full bg-black/50 opacity-0 transition-opacity duration-500 z-10',
                        isOpen && 'opacity-100',
                    )}
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Modal */}
            <div
                className={twMerge(
                    'fixed top-0 h-[100dvh] -translate-x-[0%] overflow-x-hidden hide-scrollbar bg-white shadow-md z-10 transition-all duration-500',
                    !isOpen && 'invisible',
                    isMobile ? 'right-0' : 'left-0',
                )}
                ref={navScope}
            >
                <div className="lg:w-[325px] md:w-[375px] w-screen pb-8">
                    <div className="sticky bg-white z-50 top-0 left-0 right-0">
                        <div className="flex items-center justify-between border-b border-gray-200">
                            <div className="sm:pl-4 pl-6 py-4">
                                <Link href="/">
                                    <LogoWithName />
                                </Link>
                            </div>
                            <div
                                className="text-black py-5 pl-4 pr-4 border-l border-gray-200 cursor-pointer"
                                onClick={() => setIsOpen(false)}
                            >
                                <HiOutlineXMark size={30} />
                            </div>
                        </div>
                    </div>
                    <div className="sm:p-4 p-6">
                        <div
                            className="flex h-[70px] items-center justify-between gap-x-5 rounded-lg px-3"
                            style={{
                                background:
                                    'linear-gradient(90deg, rgb(123, 53, 53) 0%, rgb(31, 35, 35) 40%, rgb(31, 35, 35) 100%)',
                            }}
                        >
                            <div className="h-16">
                                <Image
                                    src={hotDealsImg}
                                    alt="hot deals img"
                                    width={200}
                                    height={100}
                                    className="h-full w-auto rounded-tl-xl object-cover object-right"
                                />
                            </div>
                            <Link href={'/collections/top-deals'} onClick={() => setIsOpen(false)}>
                                <div className="shrink-0 px-4 py-2 bg-red-400 text-white font-semibold rounded-full font-body text-xs">
                                    {t('browseDeals')}
                                </div>
                            </Link>
                        </div>
                    </div>
                    <nav className="mt-4 sm:px-4 px-6 flex flex-col space-y-4 divide-y divide-gray-200">
                        {/* Search */}
                        <div ref={searchContainerRef} className="lg:hidden block">
                            <div className="relative">
                                <div className="border border-black/60 rounded-full relative">
                                    <CiSearch size={20} className="absolute top-1/2 -translate-y-1/2 ml-3" />
                                    <input
                                        type="text"
                                        placeholder={n('searchPlaceholder')}
                                        className="w-full outline-none rounded-full px-4 pl-10 py-2 bg-transparent"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        onFocus={() => searchQuery && setIsSuggestionsOpen(true)}
                                    />
                                </div>
                                {isSuggestionsOpen && suggestions.length > 0 ? (
                                    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg">
                                        <ul className="flex flex-col">
                                            {suggestions.map((product) => (
                                                <li
                                                    key={product.id}
                                                    className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handleSuggestionClick(product.slug)}
                                                >
                                                    <Image
                                                        src={
                                                            product.images.length > 0
                                                                ? product.images[0].url
                                                                : '/device-test-02.png'
                                                        }
                                                        alt={product.name}
                                                        width={40}
                                                        height={40}
                                                        className="size-10 object-cover"
                                                    />
                                                    <span className="text-sm">{product.name}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : isSuggestionsOpen && searchQuery ? (
                                    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg">
                                        <p className="p-2 text-gray-500">{n('noProducts')}</p>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        {/* Trending */}
                        <div className="mt-4">
                            <h3 className="font-semibold font-heading mb-1 lg:text-base md:text-lg text-xl">
                                {t('trending')}
                            </h3>
                            <ul>
                                {trendingCategories.map((cat: any) => (
                                    <li key={cat.id} onClick={(e) => e.stopPropagation()}>
                                        <Link
                                            href={`/collections/list/${cat.slug}`}
                                            className="text-black py-1.5 group/nav-item relative isolate cursor-pointer block"
                                        >
                                            <div className="relative isolate">
                                                <span className="lg:text-sm md:text-base text-lg group-hover/nav-item:pl-4 transition-all duration-500 capitalize">
                                                    {t(`${cat.name}`)}
                                                </span>
                                            </div>
                                            <div className="absolute w-full h-0 bg-gray-100 group-hover/nav-item:h-full transition-all duration-500 bottom-0 -z-10"></div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* All Categories */}
                        <div>
                            <h3 className="font-semibold font-heading mt-4 mb-1 lg:text-base md:text-lg text-xl">
                                {t('allCategories')}
                            </h3>
                            <ul>
                                {categories.slice(0, showAllCategories ? categories.length : 5).map((cat: any) => (
                                    <li key={cat.id} onClick={(e) => e.stopPropagation()}>
                                        <Link
                                            href={`collections/list/${cat.slug}`}
                                            className="text-black py-1.5 group/nav-item relative isolate cursor-pointer block"
                                        >
                                            <div className="relative isolate">
                                                <span className="lg:text-sm md:text-base text-lg group-hover/nav-item:pl-4 transition-all duration-500 capitalize">
                                                    {t(`${cat.name}`)}
                                                </span>
                                            </div>
                                            <div className="absolute w-full h-0 bg-gray-100 group-hover/nav-item:h-full transition-all duration-500 bottom-0 -z-10"></div>
                                        </Link>
                                    </li>
                                ))}
                                <li
                                    className="text-black py-1.5 group/nav-item relative isolate cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowAllCategories(!showAllCategories);
                                    }}
                                >
                                    <div className="relative isolate">
                                        <div className="flex items-center gap-2">
                                            <span className="lg:text-sm md:text-base text-lg group-hover/nav-item:pl-4 transition-all duration-500">
                                                {showAllCategories ? t('seeLess') : t('seeAll')}
                                            </span>
                                            {showAllCategories ? (
                                                <HiOutlineChevronUp size={14} />
                                            ) : (
                                                <HiOutlineChevronDown size={14} />
                                            )}
                                        </div>
                                    </div>
                                    <div className="absolute w-full h-0 bg-gray-100 group-hover/nav-item:h-full transition-all duration-500 bottom-0 -z-10"></div>
                                </li>
                            </ul>
                        </div>
                        {/* Customize */}
                        <div className="sm:hidden">
                            <h3 className="font-semibold font-heading mt-4 mb-2 lg:text-base md:text-lg text-xl">
                                {t('customize')}
                            </h3>
                            <div className="flex items-center gap-4">
                                {/* languages */}
                                <LanguageSelect />
                                {/* dark mode */}
                                <div className="border border-black/10 p-2 px-3 relative rounded-lg">
                                    <DarkModeSwitch />
                                </div>
                            </div>
                        </div>
                        {/* Settings */}
                        <div>
                            <h3 className="font-semibold font-heading mt-4 mb-2 lg:text-base md:text-lg text-xl">
                                {t('settings')}
                            </h3>
                            {isLoggedIn ? (
                                <ul>
                                    <li
                                        className="text-black py-2 group/nav-item relative isolate cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    >
                                        <div className="relative isolate">
                                            <span className="lg:text-sm md:text-base text-lg group-hover/nav-item:pl-4 transition-all duration-500 flex items-center gap-1">
                                                <PiUser size={14} />
                                                <span className="ml-2">{t('myProfile')}</span>
                                            </span>
                                        </div>
                                        <div className="absolute w-full h-0 bg-gray-100 group-hover/nav-item:h-full transition-all duration-500 bottom-0 -z-10"></div>
                                    </li>
                                    <li
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    >
                                        <Link
                                            href={'/my-orders'}
                                            className="text-black py-2 group/nav-item relative isolate cursor-pointer block"
                                        >
                                            <div className="relative isolate">
                                                <span className="lg:text-sm md:text-base text-lg group-hover/nav-item:pl-4 transition-all duration-500 flex items-center gap-1">
                                                    <PiShoppingBagOpenLight size={14} />
                                                    <span className="ml-2">{t('myOrders')}</span>
                                                </span>
                                            </div>
                                            <div className="absolute w-full h-0 bg-gray-100 group-hover/nav-item:h-full transition-all duration-500 bottom-0 -z-10"></div>
                                        </Link>
                                    </li>
                                    <li
                                        className="text-black py-2 group/nav-item relative isolate cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    >
                                        <div className="relative isolate">
                                            <span className="lg:text-sm md:text-base text-lg group-hover/nav-item:pl-4 transition-all duration-500 flex items-center gap-1">
                                                <PiSignOut size={14} />
                                                <span className="ml-2">{t('signOut')}</span>
                                            </span>
                                        </div>
                                        <div className="absolute w-full h-0 bg-gray-100 group-hover/nav-item:h-full transition-all duration-500 bottom-0 -z-10"></div>
                                    </li>
                                </ul>
                            ) : (
                                <ul className="flex items-center justify-center gap-4">
                                    <li className="relative">
                                        <Button variant="text" className="after:left-0">
                                            {t('signUp')}
                                        </Button>
                                    </li>
                                    <li>
                                        <Button>{t('signIn')}</Button>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
        </>
    );
}
