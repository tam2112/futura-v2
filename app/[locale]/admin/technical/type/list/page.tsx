import Table from '@/components/admin/table/Table';
import TableSearch from '@/components/admin/table/TableSearch';
import Pagination from '@/sections/collections/Pagination';
import GoToTop from '@/components/GoToTop';
import { Type, Prisma } from '@/prisma/app/generated/prisma';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import Checkbox from '@/components/Checkbox';
import DeleteSelectedButtonClient from '@/components/admin/DeleteSelectedButtonClient';
import FormContainer from '@/components/admin/form/FormContainer';
import CheckboxHeader from '@/components/admin/CheckboxHeader';
import ExportButton from '@/components/admin/ExportButton';
import FilterTechnicalDropdown from '@/components/admin/FilterTechnicalDropdown';
import { exportTypes } from '@/lib/actions/technical/type.action';
import { deleteSelectedTypes } from '@/components/admin/DeleteSelectedButton';
import { getTranslations } from 'next-intl/server';
import ReloadButton from '@/components/admin/ReloadButton';

type PageProps = {
    searchParams: { [key: string]: string | undefined };
};

type TypeList = Type;

export default async function TypeListPage({ searchParams }: PageProps) {
    const t = await getTranslations('TypeList');
    const categorySortOptions = [
        { value: 'name-asc', label: 'A-Z' },
        { value: 'name-desc', label: 'Z-A' },
        { value: 'date-desc', label: t('latestRelease') },
        { value: 'date-asc', label: t('oldRelease') },
    ];
    const { page, sort, ...queryParams } = searchParams;
    const p = page ? parseInt(page) : 1;

    const currentSort = sort || 'date-desc';

    const query: Prisma.TypeWhereInput = {};
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case 'search':
                        query.name = { contains: value, mode: 'insensitive' };
                        break;
                    default:
                        break;
                }
            }
        }
    }

    const sortValues = currentSort.split(',').filter((value) => value);
    const orderBy: Prisma.TypeOrderByWithRelationInput[] = sortValues.map((sortValue) => {
        switch (sortValue.trim()) {
            case 'name-asc':
                return { name: 'asc' };
            case 'name-desc':
                return { name: 'desc' };
            case 'date-asc':
                return { createdDate: 'asc' };
            case 'date-desc':
            default:
                return { createdDate: 'desc' };
        }
    });

    const [data, count] = await prisma.$transaction([
        prisma.type.findMany({
            where: query,
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
            orderBy,
        }),
        prisma.type.count({ where: query }),
    ]);

    // Define columns after data is initialized
    const columns = [
        { header: <CheckboxHeader itemIds={data.map((item: any) => item.id)} />, accessor: 'check' },
        { header: t('name'), accessor: 'name', className: 'hidden md:table-cell' },
    ];

    const renderRow = (item: TypeList) => (
        <tr key={item.id} className="border-b border-slate-100 text-sm hover:bg-gradient-more-lighter">
            <td>
                <Checkbox id={item.id} />
            </td>
            <td className="hidden md:table-cell py-2">{item.name}</td>
            <td className="py-2">
                <div className="flex items-center gap-2">
                    <FormContainer table="type" type="update" data={item} />
                    <FormContainer table="type" type="delete" id={item.id} />
                </div>
            </td>
        </tr>
    );

    return (
        <>
            <GoToTop />
            <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
                <div className="flex items-center justify-between">
                    <h1 className="hidden md:block text-lg font-semibold">{t('allTypes')}</h1>
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                        <TableSearch />
                        <div className="flex items-center gap-4 self-end">
                            {/* Filter Dropdown */}
                            <FilterTechnicalDropdown
                                currentSort={currentSort}
                                sortOptions={categorySortOptions}
                                entityName={t('type')}
                            />
                            <ExportButton exportAction={exportTypes} entityName={t('type')} />
                            <ReloadButton />
                            <FormContainer table="type" type="create" />
                            <DeleteSelectedButtonClient deleteAction={deleteSelectedTypes} entityName={t('type')} />
                        </div>
                    </div>
                </div>
                <div id="table-container">
                    <Table columns={columns} renderRow={renderRow} data={data} />
                </div>
                {data.length > 0 && <Pagination page={p} count={count} />}
            </div>
        </>
    );
}
