import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
import emptyImg from '@/public/empty-data.png';
import { ReactNode } from 'react';

export default function Table<T>({
    columns,
    renderRow,
    data,
}: {
    columns: { header: ReactNode | string; accessor: string; className?: string }[];
    renderRow: (item: T) => React.ReactNode;
    data: any[];
}) {
    return (
        <div className="relative overflow-x-auto mt-4">
            <table className={twMerge('mt-4 w-[1000px] max-w-[1600px]', data.length > 0 ? 'h-auto' : 'h-[300px]')}>
                <thead>
                    <tr className="text-left font-heading font-semibold text-sm">
                        {columns.map((col) => (
                            <th key={col.accessor} scope="col" className={col.className}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                {data.length > 0 ? (
                    <tbody className="pt-2">{data.map((item) => renderRow(item))}</tbody>
                ) : (
                    <tbody className="pt-2">
                        <tr>
                            <td colSpan={columns.length} className="text-center py-16">
                                <div className="flex items-center justify-center">
                                    <Image src={emptyImg} alt="" width={320} height={320} className="" />
                                </div>
                                <h2 className="font-heading text-lg font-semibold">No data found</h2>
                                <p className="text-sm">There is no data to show you right now</p>
                            </td>
                        </tr>
                    </tbody>
                )}
            </table>
        </div>
    );
}
