import get from 'lodash/get';
import { Form } from 'react-bootstrap';
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
      width: '100px',
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
    const elements = document.querySelectorAll(".check-item .form-check-input") as NodeListOf<HTMLInputElement>;
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
      const elements = document.querySelectorAll(".check-item .form-check-input") as NodeListOf<HTMLInputElement>;
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
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="table table-hover mb-0">
        <thead>
          <tr className="font-bold text-left">
            {columns?.map(column => (
              <th
                key={column.label}
                colSpan={column.colSpan ?? 1}
                className="p-3"
                style={column.name == 'id' ? styles.id : styles.auto}
              >
                {column.name == 'id' ? <Form.Check type="checkbox" onChange={handleChangeAll} /> : column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='body-items'>
          {/* Empty state */}
          {rows?.length === 0 && (
            <tr>
              <td
                className="px-6 py-24 border-t text-center"
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
                      style={column.name == 'id' ? styles.id : styles.auto}
                      className="p-3"
                    >
                      {column.name == 'id' ?
                        <Form.Check type="checkbox" className='check-item' value={val} onChange={handleChange}
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
