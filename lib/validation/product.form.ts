import { z } from 'zod';
import { messages } from '../messages';

const getTranslationsProductForm = (locale: 'en' | 'vi') => {
    return messages[locale].ProductForm;
};

export const productSchema = (locale: 'en' | 'vi') => {
    const t = getTranslationsProductForm(locale);

    return z.object({
        id: z.string().optional(),
        name: z.string().min(1, { message: t.productNameRequired }),
        description: z.string().min(1, { message: t.descriptionRequired }),
        price: z.number().min(1, { message: t.priceRequired }),
        quantity: z.number().min(0, { message: t.quantityRequired }),
        priceWithDiscount: z.number().optional(),
        slug: z.string().optional(),
        categoryId: z.string().min(1, { message: t.categoryRequired }),
        brandId: z.string().optional(),
        colorId: z.string().optional(),
        storageId: z.string().optional(),
        connectivityId: z.string().optional(),
        simSlotId: z.string().optional(),
        batteryHealthId: z.string().optional(),
        ramId: z.string().optional(),
        cpuId: z.string().optional(),
        screenSizeId: z.string().optional(),
        typeId: z.string().optional(),
        imageUrls: z.array(z.string()).optional(),
    });
};

export type ProductSchema = z.infer<ReturnType<typeof productSchema>>;
