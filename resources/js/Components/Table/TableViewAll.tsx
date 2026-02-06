import get from 'lodash/get';
import { useState } from 'react';
interface TableProps<T> {
  columns: {
    name: string;
    label: string;
    colSpan?: number;
    renderCell?: (row: T) => React.ReactNode;

  }[];
  rows: T[];
  sendDataSelectItems: (data: any) => void;
  getRowDetailsUrl?: (row: T) => string;
}
export default function TableViewAll<T>({
  columns = [],
  rows = [],
  sendDataSelectItems,
}: TableProps<T>) {
  const styles = {
    id: {
      width: '100px',
      verticalAlign: 'middle',
      textAlign: 'center',
    },
    auto: {
      verticalAlign: 'middle',
    },
    action: {
      width: '180px',
      verticalAlign: 'middle',
      whiteSpace: 'nowrap',
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

  return (
    <div className="overflow-x-auto bg-white">
      <table className="mb-0 w-full whitespace-nowrap">
        <thead>
          <tr className="font-bold text-left bg-indigo-800 text-white">
            {columns?.map(column => (
              <th
                key={column.label}
                colSpan={column.colSpan ?? 1}
                className="pb-3 pt-5 px-3"
                style={column.name == 'id' ? styles.id : styles.auto}
              >
                {column.name == 'id' ? <input
                  type="checkbox"
                  onChange={handleChangeAll}
                  className="check-all-item h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition duration-150"
                /> : column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='body-items'>
          {/* Empty state */}
          {rows?.length === 0 && (
            <tr>
              <td
                className="p-3 border-t text-center"
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
                className="hover:bg-gray-100 focus-within:bg-gray-100"
              >
                {columns.map(column => {
                  let val = get(row, column.name);
                  return (
                    <td
                      key={column.name}
                      className='p-3'
                      style={column.name == 'id' ? styles.id : column.name == 'action' ? styles.action : styles.auto}
                    >
                      {column.name == 'id' ?
                        <input
                          type="checkbox"
                          value={val}
                          onChange={handleChange}
                          className="check-item h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-colors"
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
