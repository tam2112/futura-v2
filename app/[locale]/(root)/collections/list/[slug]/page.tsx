import ProductList from '@/sections/collections/ProductList';
import { getProductsByCategorySlug } from '@/lib/actions/product.action';

interface CollectionsListPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function CollectionsListPage({ params }: CollectionsListPageProps) {
    const { slug } = await params;

    const products = await getProductsByCategorySlug(slug);

    return (
        <div className="pt-8 pb-16 mt-[140px]">
            <ProductList initialProducts={products} />
        </div>
    );
}
