import get from 'lodash/get';
import { useEffect, useState } from 'react';
interface TableProps<T> {
  columns: {
    name: string;
    label: string;
    colSpan?: number;
    renderCell?: (row: T) => React.ReactNode;

  }[];
  rows: T[];
  sendDataSelectItems: (data: any) => void;
  rolePermissions: T[];
}
export default function TableView<T>({
  columns = [],
  rows = [],
  sendDataSelectItems,
  rolePermissions = [],
}: TableProps<T>) {
  const styles = {
    id: {
      width: '88px',
      verticalAlign: 'middle',
      textAlign: 'center'
    },
    auto: {
      width: 'auto',
      verticalAlign: 'middle'
    },
  };
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const handleChangeAll = (e: any) => {
    const { value, checked } = e.target;
    const elements = document.querySelectorAll(".check-item") as NodeListOf<HTMLInputElement>;
    if (checked) {
      elements.forEach((checkbox) => {
        checkbox.checked = true;
        let id = checkbox.value;
        if (selectedItems.indexOf(id) == -1) {
          selectedItems.push(id);
        }
      })
    } else {
      elements.forEach((checkbox) => {
        checkbox.checked = false;
        setSelectedItems([]);
      })
    }
    sendDataSelectItems(selectedItems.join(","));
  }

  const handleChange = (e: any) => {

    const { value, checked } = e.target;
    let updatedList = [];

    if (checked) {
      updatedList = [...selectedItems, value];
    } else {
      updatedList = selectedItems.filter((item) => item !== value);

    }
    setSelectedItems(updatedList);
    sendDataSelectItems(updatedList.join(","));
  }
  useEffect(() => {
    if (rolePermissions.length) {
      const elements = document.querySelectorAll(".check-item") as NodeListOf<HTMLInputElement>;
      elements.forEach((checkbox) => {
        let id: any = checkbox.value;
        if (rolePermissions.some(item => item == id) && selectedItems.indexOf(id) == -1) {
          checkbox.checked = true;
          selectedItems.push(id);
        }
      });
    }
  }, []);
  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-[0_14px_40px_-30px_rgba(15,23,42,0.38)]">
      <table className="mb-0 w-full whitespace-nowrap">
        <thead>
          <tr className="text-left bg-slate-950 text-white">
            {columns?.map(column => (
              <th
                key={column.label}
                colSpan={column.colSpan ?? 1}
                className="px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80"
                style={column.name == 'id' ? styles.id : styles.auto}
              >
                {column.name == 'id' ? <input
                  type="checkbox"
                  onChange={handleChangeAll}
                  className="h-4 w-4 cursor-pointer rounded border-white/30 text-cyan-500 focus:ring-cyan-400"
                /> : column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="body-items">
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
                  let val = get(row, column.name);
                  return (
                    <td
                      key={column.name}
                      style={column.name == 'id' ? styles.id : styles.auto}
                      className="px-4 py-3 align-middle text-slate-700"
                    >
                      {column.name == 'id' ?
                        <input
                          type="checkbox"
                          value={val}
                          onChange={handleChange}
                          className="check-item h-4 w-4 cursor-pointer rounded border-slate-300 text-cyan-600 focus:ring-cyan-400 focus:ring-offset-0"
                        /> : column.renderCell?.(row) ??
                        val ??
                        'N/A'}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
