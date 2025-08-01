import ProductDetails from '@/sections/collections/ProductDetails';
import { getProductBySlug, getRelatedProducts } from '@/lib/actions/product.action';
import { notFound } from 'next/navigation';
import GoToTop from '@/components/GoToTop';

// Define the props type explicitly for clarity
interface CollectionsDetailsPageProps {
    params: { slug: string };
}

export default async function CollectionsDetailsPage({ params }: CollectionsDetailsPageProps) {
    const product = await getProductBySlug(params.slug);
    if (!product || !product.category) {
        notFound();
    }
    const relatedProducts = await getRelatedProducts(product.category.slug, product.id, 8);

    return (
        <>
            <GoToTop />
            <div className="pt-8 pb-16 mt-[140px]">
                <ProductDetails product={product} relatedProducts={relatedProducts} />
            </div>
        </>
    );
}
