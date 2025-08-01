'use server';

import prisma from '../prisma';

// User Chart Data
export const getUserRoleDistribution = async () => {
    try {
        const roleDistribution = await prisma.user.groupBy({
            by: ['roleId'],
            _count: {
                id: true,
            },
        });

        // Fetch role names for each roleId
        const roleIds = roleDistribution.map((item) => item.roleId);
        const roles = await prisma.role.findMany({
            where: { id: { in: roleIds } },
            select: { id: true, name: true },
        });
        const roleMap = Object.fromEntries(roles.map((role) => [role.id, role.name]));

        return roleDistribution.map((item) => ({
            role: roleMap[item.roleId] || 'Unknown',
            count: item._count.id,
        }));
    } catch (error) {
        console.error('Error fetching user role distribution:', error);
        return [];
    }
};

export const getUserRegistrationOverTime = async (): Promise<{ date: string; count: number }[]> => {
    try {
        const users = await prisma.user.findMany({
            select: {
                createdDate: true,
            },
        });

        const groupedByDate: { [key: string]: number } = users.reduce((acc: { [key: string]: number }, user) => {
            const date = user.createdDate.toISOString().split('T')[0]; // YYYY-MM-DD
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(groupedByDate).map(([date, count]) => ({
            date,
            count,
        }));
    } catch (error) {
        console.error('Error fetching user registration over time:', error);
        return [];
    }
};

// Category Chart Data
export const getProductsPerCategory = async () => {
    try {
        const productsPerCategory = await prisma.category.findMany({
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });

        return productsPerCategory.map((category) => ({
            name: category.name,
            count: category._count.products,
        }));
    } catch (error) {
        console.error('Error fetching products per category:', error);
        return [];
    }
};

export const getCategoryCreationOverTime = async (): Promise<{ date: string; count: number }[]> => {
    try {
        const categories = await prisma.category.findMany({
            select: {
                createdDate: true,
            },
        });

        const groupedByDate: { [key: string]: number } = categories.reduce((acc: { [key: string]: number }, user) => {
            const date = user.createdDate.toISOString().split('T')[0]; // YYYY-MM-DD
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(groupedByDate).map(([date, count]) => ({
            date,
            count,
        }));
    } catch (error) {
        console.error('Error fetching category creation over time:', error);
        return [];
    }
};

// Product Chart Data
export const getProductsPerAttribute = async (attribute: string) => {
    try {
        // Define valid attributes and their corresponding model and field
        const attributeConfig: {
            [key: string]: {
                field: string | any;
                model: any;
                nameField: 'name' | 'title';
            };
        } = {
            brand: { field: 'brandId', model: prisma.brand, nameField: 'name' },
            color: { field: 'colorId', model: prisma.color, nameField: 'name' },
            storage: { field: 'storageId', model: prisma.storage, nameField: 'name' },
            connectivity: { field: 'connectivityId', model: prisma.connectivity, nameField: 'name' },
            simSlot: { field: 'simSlotId', model: prisma.simSlot, nameField: 'title' },
            batteryHealth: { field: 'batteryHealthId', model: prisma.batteryHealth, nameField: 'title' },
            ram: { field: 'ramId', model: prisma.ram, nameField: 'title' },
            cpu: { field: 'cpuId', model: prisma.cpu, nameField: 'name' },
            screenSize: { field: 'screenSizeId', model: prisma.screenSize, nameField: 'name' },
            type: { field: 'typeId', model: prisma.type, nameField: 'name' },
        };

        // Validate attribute
        if (!attributeConfig[attribute]) {
            console.error(`Invalid attribute: ${attribute}`);
            throw new Error(
                `Invalid attribute: ${attribute}. Valid attributes are: ${Object.keys(attributeConfig).join(', ')}`,
            );
        }

        const { field, model, nameField } = attributeConfig[attribute];

        // Step 1: Group products by the attribute
        const groupData = await prisma.product.groupBy({
            by: [field],
            _count: {
                id: true,
            },
            where: {
                [field]: { not: null },
            },
        });

        if (groupData.length === 0) {
            console.warn(`No products found with non-null ${field}`);
            return [];
        }

        // Step 2: Fetch attribute names
        const attributeIds = groupData.map((item: any) => item[field]);
        const attributes = await model.findMany({
            where: { id: { in: attributeIds } },
            select: { id: true, [nameField]: true },
        });

        // Create a map of attribute IDs to names
        const attributeMap = Object.fromEntries(attributes.map((attr: any) => [attr.id, attr[nameField] || 'Unknown']));

        // Step 3: Map grouped data to the desired output format
        const result = groupData.map((item: any) => ({
            name: attributeMap[item[field]] || 'Unknown',
            count: item._count.id,
        }));

        console.log(`Successfully fetched products per ${attribute}:`, result);
        return result;
    } catch (error) {
        console.error(`Error fetching products per ${attribute}:`, error);
        return [];
    }
};

export const getDiscountedProductsDistribution = async () => {
    try {
        const products = await prisma.product.findMany({
            where: {
                priceWithDiscount: { not: null },
            },
            include: {
                promotions: {
                    select: { percentageNumber: true },
                },
            },
        });

        const distribution = products.reduce<{ [key: number]: number }>((acc, product) => {
            const percentage = product.promotions[0]?.percentageNumber || 0;
            if (percentage >= 1 && percentage <= 99) {
                acc[percentage] = (acc[percentage] || 0) + 1;
            }
            return acc;
        }, {});

        return Object.entries(distribution).map(([percentage, count]) => ({
            percentage: Number(percentage),
            count,
        }));
    } catch (error) {
        console.error('Error fetching discounted products distribution:', error);
        return [];
    }
};

export const getProductCreationOverTime = async (): Promise<{ date: string; count: number }[]> => {
    try {
        const products = await prisma.product.findMany({
            select: {
                createdDate: true,
            },
        });

        const groupedByDate: { [key: string]: number } = products.reduce((acc: { [key: string]: number }, user) => {
            const date = user.createdDate.toISOString().split('T')[0]; // YYYY-MM-DD
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(groupedByDate).map(([date, count]) => ({
            date,
            count,
        }));
    } catch (error) {
        console.error('Error fetching product creation over time:', error);
        return [];
    }
};

// Order Chart Data
export const getOrderStatusDistribution = async () => {
    try {
        const orderDistribution = await prisma.order.groupBy({
            by: ['statusId'],
            _count: {
                id: true,
            },
            where: {
                status: {
                    name: {
                        in: ['Pending', 'Out for delivery', 'Delivered', 'Cancelled'],
                    },
                },
            },
        });

        // Fetch status names for each statusId
        const statusIds = orderDistribution.map((item) => item.statusId);
        const statuses = await prisma.status.findMany({
            where: { id: { in: statusIds } },
            select: { id: true, name: true },
        });
        const statusMap = Object.fromEntries(statuses.map((status) => [status.id, status.name]));

        return orderDistribution.map((item) => ({
            status: statusMap[item.statusId] || 'Unknown',
            count: item._count.id,
        }));
    } catch (error) {
        console.error('Error fetching order status distribution:', error);
        return [];
    }
};

export const getOrderCreationOverTime = async (): Promise<{ date: string; count: number }[]> => {
    try {
        const orders = await prisma.order.findMany({
            select: {
                createdDate: true,
            },
        });

        const groupedByDate: { [key: string]: number } = orders.reduce((acc: { [key: string]: number }, user) => {
            const date = user.createdDate.toISOString().split('T')[0]; // YYYY-MM-DD
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(groupedByDate).map(([date, count]) => ({
            date,
            count,
        }));
    } catch (error) {
        console.error('Error fetching order creation over time:', error);
        return [];
    }
};
