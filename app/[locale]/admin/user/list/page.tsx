import Table from '@/components/admin/table/Table';
import TableSearch from '@/components/admin/table/TableSearch';
import Pagination from '@/sections/collections/Pagination';
import GoToTop from '@/components/GoToTop';
import { User, Prisma, Role } from '@/prisma/app/generated/prisma';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import Checkbox from '@/components/Checkbox';
import DeleteSelectedButtonClient from '@/components/admin/DeleteSelectedButtonClient';
import FormContainer from '@/components/admin/form/FormContainer';
import CheckboxHeader from '@/components/admin/CheckboxHeader';
import ExportButton from '@/components/admin/ExportButton';
import FilterDropdown from '@/components/admin/FilterDropdown';
import { exportUsers } from '@/lib/actions/user.action';
import { deleteSelectedUsers } from '@/components/admin/DeleteSelectedButton';
import { getTranslations } from 'next-intl/server';
import ReloadButton from '@/components/admin/ReloadButton';

type PageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

type UserList = User & { role: Role };

export default async function UserListPage({ searchParams }: PageProps) {
    const t = await getTranslations('UserList');

    const userSortOptions = [
        { value: 'name-asc', label: 'A-Z' },
        { value: 'name-desc', label: 'Z-A' },
        { value: 'date-desc', label: t('latestRelease') },
        { value: 'date-asc', label: t('oldRelease') },
    ];

    const { page, sort, ...queryParams } = await searchParams;
    const p = page ? parseInt(page as string) : 1;

    const currentSort = sort || 'date-desc';

    const query: Prisma.UserWhereInput = {};
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case 'search':
                        if (typeof value === 'string') {
                            query.fullName = { contains: value, mode: 'insensitive' };
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }

    const sortString = Array.isArray(currentSort) ? currentSort.join(',') : currentSort;
    const sortValues = sortString ? sortString.split(',') : ['date-desc'];
    const orderBy: Prisma.UserOrderByWithRelationInput[] = sortValues.map((sortValue) => {
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
        prisma.user.findMany({
            where: query,
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
            include: {
                role: true,
            },
            orderBy,
        }),
        prisma.user.count({ where: query }),
    ]);

    // Define columns after data is initialized
    const columns = [
        { header: <CheckboxHeader itemIds={data.map((item: UserList) => item.id)} />, accessor: 'check' },
        { header: t('fullName'), accessor: 'fullName', className: '' },
        { header: t('email'), accessor: 'email', className: '' },
        { header: t('role'), accessor: 'role', className: '' },
    ];

    const renderRow = (item: UserList) => (
        <tr key={item.id} className="border-b border-slate-100 text-sm hover:bg-gradient-more-lighter">
            <th scope="row">
                <Checkbox id={item.id} />
            </th>
            <td className="py-2">{item.fullName}</td>
            <td className="py-2">{item.email}</td>
            <td className="py-2">{item.role.name}</td>
            <td className="py-2">
                <div className="flex items-center gap-2">
                    <FormContainer table="user" type="update" data={item} />
                    <FormContainer table="user" type="delete" id={item.id} />
                </div>
            </td>
        </tr>
    );

    return (
        <>
            <GoToTop className="sm:bottom-8 bottom-32" />
            <div className="bg-white p-4 rounded-md flex-1 mt-0">
                <div className="flex items-center lg:justify-between justify-start">
                    <h1 className="hidden lg:block text-lg font-semibold">{t('allUsers')}</h1>
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4 w-full md:w-auto">
                        <TableSearch />
                        <div className="flex flex-wrap items-center gap-4 lg:self-end">
                            {/* Filter Dropdown */}
                            <FilterDropdown
                                currentSort={currentSort}
                                sortOptions={userSortOptions}
                                entityName={t('user')}
                            />
                            <ExportButton exportAction={exportUsers} entityName={t('user')} />
                            <ReloadButton />
                            <DeleteSelectedButtonClient deleteAction={deleteSelectedUsers} entityName={t('user')} />
                            <FormContainer table="user" type="create" />
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
