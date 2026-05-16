import { Link } from '@inertiajs/react';
import get from 'lodash/get';
import { ChevronRight } from 'lucide-react';

interface TableProps<T> {
  columns: {
    name: string;
    label: string;
    colSpan?: number;
    renderCell?: (row: T) => React.ReactNode;
  }[];
  rows: T[];
  getRowDetailsUrl?: (row: T) => string;
}

export default function Table<T>({
  columns = [],
  rows = [],
  getRowDetailsUrl
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-[0_14px_40px_-30px_rgba(15,23,42,0.38)]">
      <table className="w-full whitespace-nowrap">
        <thead>
          <tr className="text-left bg-slate-950 text-white">
            {columns?.map(column => (
              <th
                key={column.label}
                colSpan={column.colSpan ?? 1}
                className="px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Empty state */}
          {rows?.length === 0 && (
            <tr>
              <td
                className="border-t border-slate-200 px-4 py-16 text-center text-slate-500"
                colSpan={columns.length}
              >
                No data found.
              </td>
            </tr>
          )}
          {rows?.map((row, index) => {
            return (
              <tr
                key={index}
                className="border-t border-slate-200/80 odd:bg-white even:bg-slate-50/60 transition-colors hover:bg-cyan-50/50 focus-within:bg-cyan-50/50"
              >
                {columns.map(column => {
                  return (
                    <td key={column.name} className="px-4 py-3 align-middle text-slate-700">
                      <Link
                        tabIndex={-1}
                        href={getRowDetailsUrl?.(row) as string}
                        className="flex items-center focus:outline-none"
                      >
                        {column.renderCell?.(row) ??
                          get(row, column.name) ??
                          'N/A'}
                      </Link>
                    </td>
                  );
                })}
                <td className={"w-px border-t border-slate-200"}>
                  <Link
                    href={getRowDetailsUrl?.(row)!}
                    className="flex items-center px-4 focus:outline-none"
                  >
                    <ChevronRight size={20} className="text-slate-400" />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
