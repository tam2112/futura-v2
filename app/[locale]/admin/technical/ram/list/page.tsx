import Table from '@/components/admin/table/Table';
import TableSearch from '@/components/admin/table/TableSearch';
import Pagination from '@/sections/collections/Pagination';
import GoToTop from '@/components/GoToTop';
import { Ram, Prisma } from '@/prisma/app/generated/prisma';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import Checkbox from '@/components/Checkbox';
import DeleteSelectedButtonClient from '@/components/admin/DeleteSelectedButtonClient';
import FormContainer from '@/components/admin/form/FormContainer';
import CheckboxHeader from '@/components/admin/CheckboxHeader';
import ExportButton from '@/components/admin/ExportButton';
import FilterTechnicalDropdown from '@/components/admin/FilterTechnicalDropdown';
import { exportRams } from '@/lib/actions/technical/ram.action';
import { deleteSelectedRams } from '@/components/admin/DeleteSelectedButton';
import { getTranslations } from 'next-intl/server';
import ReloadButton from '@/components/admin/ReloadButton';

type PageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

type RamList = Ram;

export default async function RamListPage({ searchParams }: PageProps) {
    const t = await getTranslations('RamList');
    const categorySortOptions = [
        { value: 'name-asc', label: 'A-Z' },
        { value: 'name-desc', label: 'Z-A' },
        { value: 'date-desc', label: t('latestRelease') },
        { value: 'date-asc', label: t('oldRelease') },
    ];
    const { page, sort, ...queryParams } = await searchParams;
    const p = page ? parseInt(page as string) : 1;

    const currentSort = sort || 'date-desc';

    const query: Prisma.RamWhereInput = {};
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case 'search':
                        if (typeof value === 'string') {
                            query.title = { contains: value, mode: 'insensitive' };
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }

    const sortString = Array.isArray(currentSort) ? currentSort.join(',') : currentSort;
    const sortValues = sortString.split(',').filter((value) => value);
    const orderBy: Prisma.RamOrderByWithRelationInput[] = sortValues.map((sortValue) => {
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
        prisma.ram.findMany({
            where: query,
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
            orderBy,
        }),
        prisma.ram.count({ where: query }),
    ]);

    // Define columns after data is initialized
    const columns = [
        { header: <CheckboxHeader itemIds={data.map((item: any) => item.id)} />, accessor: 'check' },
        { header: t('title'), accessor: 'title', className: 'hidden md:table-cell' },
    ];

    const renderRow = (item: RamList) => (
        <tr key={item.id} className="border-b border-slate-100 text-sm hover:bg-gradient-more-lighter">
            <td>
                <Checkbox id={item.id} />
            </td>
            <td className="hidden md:table-cell py-2">{item.title}</td>
            <td className="py-2">
                <div className="flex items-center gap-2">
                    <FormContainer table="ram" type="update" data={item} />
                    <FormContainer table="ram" type="delete" id={item.id} />
                </div>
            </td>
        </tr>
    );

    return (
        <>
            <GoToTop />
            <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
                <div className="flex items-center justify-between">
                    <h1 className="hidden md:block text-lg font-semibold">{t('allRams')}</h1>
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                        <TableSearch />
                        <div className="flex items-center gap-4 self-end">
                            {/* Filter Dropdown */}
                            <FilterTechnicalDropdown
                                currentSort={currentSort}
                                sortOptions={categorySortOptions}
                                entityName={t('ram')}
                            />
                            <ExportButton exportAction={exportRams} entityName={t('ram')} />
                            <ReloadButton />
                            <FormContainer table="ram" type="create" />
                            <DeleteSelectedButtonClient deleteAction={deleteSelectedRams} entityName={t('ram')} />
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
