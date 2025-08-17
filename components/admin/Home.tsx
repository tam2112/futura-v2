'use client';

import { useState, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    BarElement,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { useUserStore } from '@/store/userStore';
import { useCategoryStore } from '@/store/categoryStore';
import { useProductStore } from '@/store/productStore';
import { useOrderStore } from '@/store/orderStore';
import GoToTop from '../GoToTop';
import { useTranslations } from 'next-intl';
import { TabsBtn, TabsContent, TabsProvider } from './TabsProvider';
import { LuTabletSmartphone, LuUserCog } from 'react-icons/lu';
import { VscLayoutMenubar } from 'react-icons/vsc';
import { CiBoxes } from 'react-icons/ci';

ChartJS.register(ArcElement, BarElement, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

export default function Home() {
    const t = useTranslations('Chart');

    const [activeTab, setActiveTab] = useState<'User' | 'Category' | 'Product' | 'Order'>('User');

    const {
        userCount,
        formattedUserCount,
        roleDistribution,
        registrationOverTime,
        fetchUserCount,
        fetchRoleDistribution,
        fetchRegistrationOverTime,
    } = useUserStore();
    const {
        categories,
        productsPerCategory,
        categoryCreationOverTime,
        categoryCount,
        fetchCategories,
        fetchProductsPerCategory,
        fetchCategoryCreationOverTime,
        fetchCategoryCount,
    } = useCategoryStore();
    const {
        productsPerBrand,
        productsPerColor,
        productsPerStorage,
        productsPerConnectivity,
        productsPerSimSlot,
        productsPerBatteryHealth,
        productsPerRam,
        productsPerCpu,
        productsPerScreenSize,
        productsPerType,
        discountedProductsDistribution,
        productCreationOverTime,
        productCount,
        fetchProductsPerBrand,
        fetchProductsPerColor,
        fetchProductsPerStorage,
        fetchProductsPerConnectivity,
        fetchProductsPerSimSlot,
        fetchProductsPerBatteryHealth,
        fetchProductsPerRam,
        fetchProductsPerCpu,
        fetchProductsPerScreenSize,
        fetchProductsPerType,
        fetchDiscountedProductsDistribution,
        fetchProductCreationOverTime,
        fetchProductCount,
    } = useProductStore();
    const {
        orders,
        orderStatusDistribution,
        orderCreationOverTime,
        orderCount,
        fetchOrders,
        fetchOrderStatusDistribution,
        fetchOrderCreationOverTime,
        fetchOrderCount,
    } = useOrderStore();

    useEffect(() => {
        fetchUserCount();
        fetchRoleDistribution();
        fetchRegistrationOverTime();
        fetchCategories();
        fetchProductsPerCategory();
        fetchCategoryCreationOverTime();
        fetchCategoryCount();
        fetchProductsPerBrand();
        fetchProductsPerColor();
        fetchProductsPerStorage();
        fetchProductsPerConnectivity();
        fetchProductsPerSimSlot();
        fetchProductsPerBatteryHealth();
        fetchProductsPerRam();
        fetchProductsPerCpu();
        fetchProductsPerScreenSize();
        fetchProductsPerType();
        fetchDiscountedProductsDistribution();
        fetchProductCreationOverTime();
        fetchProductCount();
        fetchOrders(''); // Note: Pass actual userId if needed
        fetchOrderStatusDistribution();
        fetchOrderCreationOverTime();
        fetchOrderCount();
    }, [
        fetchUserCount,
        fetchRoleDistribution,
        fetchRegistrationOverTime,
        fetchCategories,
        fetchProductsPerCategory,
        fetchCategoryCreationOverTime,
        fetchCategoryCount,
        fetchProductsPerBrand,
        fetchProductsPerColor,
        fetchProductsPerStorage,
        fetchProductsPerConnectivity,
        fetchProductsPerSimSlot,
        fetchProductsPerBatteryHealth,
        fetchProductsPerRam,
        fetchProductsPerCpu,
        fetchProductsPerScreenSize,
        fetchProductsPerType,
        fetchDiscountedProductsDistribution,
        fetchProductCreationOverTime,
        fetchProductCount,
        fetchOrders,
        fetchOrderStatusDistribution,
        fetchOrderCreationOverTime,
        fetchOrderCount,
    ]);

    const tabs = [
        { id: 1, name: 'User', count: userCount, color: 'violet-800', icon: <LuUserCog />, activeColor: 'violet-500' },
        {
            id: 2,
            name: 'Category',
            count: categoryCount,
            color: 'green-800',
            icon: <VscLayoutMenubar />,
            activeColor: 'green-500',
        },
        {
            id: 3,
            name: 'Product',
            count: productCount,
            color: 'amber-800',
            icon: <LuTabletSmartphone />,
            activeColor: 'amber-500',
        },
        { id: 4, name: 'Order', count: orderCount, color: 'sky-800', icon: <CiBoxes />, activeColor: 'sky-500' },
    ];

    // Chart configurations
    const pieChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
    };

    const barChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: t('attribute'),
                },
            },
            y: {
                title: {
                    display: true,
                    text: t('count'),
                },
                beginAtZero: true,
            },
        },
    };

    const lineChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: t('date'),
                },
            },
            y: {
                title: {
                    display: true,
                    text: t('count'),
                },
                beginAtZero: true,
            },
        },
    };

    // User Charts
    const userRoleChartData = {
        labels: roleDistribution.map((item: any) => t(`roles.${item.role}`)),
        datasets: [
            {
                data: roleDistribution.map((item: any) => item.count),
                backgroundColor: ['#3B82F6', '#60A5FA', '#2DD4BF', '#81E6D9'],
            },
        ],
    };

    const userRegistrationChartData = {
        labels: registrationOverTime.map((item: any) => item.date),
        datasets: [
            {
                data: registrationOverTime.map((item: any) => item.count),
                borderColor: '#2DD4BF',
                fill: false,
            },
        ],
    };

    // Category Charts
    const productsPerCategoryChartData = {
        labels: productsPerCategory.map((item: any) =>
            t(`categories.${item.name.toLowerCase()}`, { defaultValue: item.name }),
        ),
        datasets: [
            {
                data: productsPerCategory.map((item: any) => item.count),
                backgroundColor: '#81E6D9',
            },
        ],
    };

    const categoryCreationChartData = {
        labels: categoryCreationOverTime.map((item: any) => item.date),
        datasets: [
            {
                data: categoryCreationOverTime.map((item: any) => item.count),
                borderColor: '#2DD4BF',
                fill: false,
            },
        ],
    };

    // Product Charts
    const productsPerBrandChartData = {
        labels: productsPerBrand.map((item: any) => item.name),
        datasets: [
            {
                data: productsPerBrand.map((item: any) => item.count),
                backgroundColor: '#81E6D9',
            },
        ],
    };

    const productsPerColorChartData = {
        labels: productsPerColor.map((item: any) => item.name),
        datasets: [
            {
                data: productsPerColor.map((item: any) => item.count),
                backgroundColor: '#81E6D9',
            },
        ],
    };

    const productsPerStorageChartData = {
        labels: productsPerStorage.map((item: any) => item.name),
        datasets: [
            {
                data: productsPerStorage.map((item: any) => item.count),
                backgroundColor: '#81E6D9',
            },
        ],
    };

    const productsPerConnectivityChartData = {
        labels: productsPerConnectivity.map((item: any) => item.name),
        datasets: [
            {
                data: productsPerConnectivity.map((item: any) => item.count),
                backgroundColor: '#81E6D9',
            },
        ],
    };

    const productsPerSimSlotChartData = {
        labels: productsPerSimSlot.map((item: any) => item.name),
        datasets: [
            {
                data: productsPerSimSlot.map((item: any) => item.count),
                backgroundColor: '#81E6D9',
            },
        ],
    };

    const productsPerBatteryHealthChartData = {
        labels: productsPerBatteryHealth.map((item: any) => item.name),
        datasets: [
            {
                data: productsPerBatteryHealth.map((item: any) => item.count),
                backgroundColor: '#81E6D9',
            },
        ],
    };

    const productsPerRamChartData = {
        labels: productsPerRam.map((item: any) => item.name),
        datasets: [
            {
                data: productsPerRam.map((item: any) => item.count),
                backgroundColor: '#81E6D9',
            },
        ],
    };

    const productsPerCpuChartData = {
        labels: productsPerCpu.map((item: any) => item.name),
        datasets: [
            {
                data: productsPerCpu.map((item: any) => item.count),
                backgroundColor: '#81E6D9',
            },
        ],
    };

    const productsPerScreenSizeChartData = {
        labels: productsPerScreenSize.map((item: any) => item.name),
        datasets: [
            {
                data: productsPerScreenSize.map((item: any) => item.count),
                backgroundColor: '#81E6D9',
            },
        ],
    };

    const productsPerTypeChartData = {
        labels: productsPerType.map((item: any) => item.name),
        datasets: [
            {
                data: productsPerType.map((item: any) => item.count),
                backgroundColor: '#81E6D9',
            },
        ],
    };

    const discountedProductsChartData = {
        labels: discountedProductsDistribution.map((item: any) => `${item.percentage}%`),
        datasets: [
            {
                data: discountedProductsDistribution.map((item: any) => item.count),
                backgroundColor: '#81E6D9',
            },
        ],
    };

    const productCreationChartData = {
        labels: productCreationOverTime.map((item: any) => item.date),
        datasets: [
            {
                data: productCreationOverTime.map((item: any) => item.count),
                borderColor: '#2DD4BF',
                fill: false,
            },
        ],
    };

    // Order Charts
    const orderStatusChartData = {
        labels: orderStatusDistribution.map((item: any) =>
            t(`statuses.${item.status.toLowerCase().replace(' ', '_')}`),
        ),
        datasets: [
            {
                data: orderStatusDistribution.map((item: any) => item.count),
                backgroundColor: ['#3B82F6', '#60A5FA', '#2DD4BF', '#81E6D9'],
            },
        ],
    };

    const orderCreationChartData = {
        labels: orderCreationOverTime.map((item: any) => item.date),
        datasets: [
            {
                data: orderCreationOverTime.map((item: any) => item.count),
                borderColor: '#2DD4BF',
                fill: false,
            },
        ],
    };

    return (
        <>
            <GoToTop className="sm:bottom-8 bottom-32" />
            <TabsProvider defaultValue="User">
                <div className="mt-5 xl:pl-2 xl:pr-8 space-y-8 sm:pb-6 pb-36">
                    {/* Tab navigation */}
                    <div className="grid grid-cols-4 gap-1 mb-8 bg-white p-1 text-black rounded-md border divide-x divide-gray-400">
                        {tabs.map((tab) => (
                            <TabsBtn key={tab.id} onClick={() => setActiveTab(tab.name as any)} value={tab.name}>
                                <div className="relative z-[2] flex items-center justify-center sm:justify-between">
                                    <p className="sm:hidden">{tab.icon}</p>
                                    <h2 className="hidden sm:block">{t(tab.name.toLowerCase())}</h2>
                                    <p className="hidden sm:block">{tab.count}</p>
                                </div>
                            </TabsBtn>
                        ))}
                    </div>

                    {/* Tab content */}
                    <TabsContent value="User">
                        <div className="grid sm:grid-cols-2 grid-cols-1 gap-8">
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold mb-4">{t('userRoleDistribution')}</h3>
                                <Pie data={userRoleChartData} options={pieChartOptions} />
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold mb-4">{t('userRegistrationsOverTime')}</h3>
                                <Line data={userRegistrationChartData} options={lineChartOptions} />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="Category">
                        <div className="grid sm:grid-cols-2 grid-cols-1 gap-8">
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold mb-4">{t('productsPerCategory')}</h3>
                                <Bar data={productsPerCategoryChartData} options={barChartOptions} />
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold mb-4">{t('categoryCreationOverTime')}</h3>
                                <Line data={categoryCreationChartData} options={lineChartOptions} />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="Product">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold mb-4">{t('productsPerBrand')}</h3>
                            <Bar data={productsPerBrandChartData} options={barChartOptions} />
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold mb-4">{t('productsPerColor')}</h3>
                            <Bar data={productsPerColorChartData} options={barChartOptions} />
                        </div>
                        <div className="grid sm:grid-cols-2 grid-cols-1 gap-8">
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold mb-4">{t('productsPerStorage')}</h3>
                                <Bar data={productsPerStorageChartData} options={barChartOptions} />
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold mb-4">{t('productsPerConnectivity')}</h3>
                                <Bar data={productsPerConnectivityChartData} options={barChartOptions} />
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold mb-4">{t('productsPerSimSlot')}</h3>
                                <Bar data={productsPerSimSlotChartData} options={barChartOptions} />
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold mb-4">{t('productsPerBatteryHealth')}</h3>
                                <Bar data={productsPerBatteryHealthChartData} options={barChartOptions} />
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold mb-4">{t('productsPerRam')}</h3>
                                <Bar data={productsPerRamChartData} options={barChartOptions} />
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold mb-4">{t('productsPerType')}</h3>
                                <Bar data={productsPerTypeChartData} options={barChartOptions} />
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold mb-4">{t('discountedProductsDistribution')}</h3>
                                <Bar data={discountedProductsChartData} options={barChartOptions} />
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold mb-4">{t('productCreationOverTime')}</h3>
                                <Line data={productCreationChartData} options={lineChartOptions} />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold mb-4">{t('productsPerCpu')}</h3>
                            <Bar data={productsPerCpuChartData} options={barChartOptions} />
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold mb-4">{t('productsPerScreenSize')}</h3>
                            <Bar data={productsPerScreenSizeChartData} options={barChartOptions} />
                        </div>
                    </TabsContent>

                    <TabsContent value="Order">
                        <div className="grid sm:grid-cols-2 grid-cols-1 gap-8">
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold mb-4">{t('orderStatusDistribution')}</h3>
                                <Pie data={orderStatusChartData} options={pieChartOptions} />
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold mb-4">{t('ordersOverTime')}</h3>
                                <Line data={orderCreationChartData} options={lineChartOptions} />
                            </div>
                        </div>
                    </TabsContent>
                </div>
            </TabsProvider>
        </>
    );
}
