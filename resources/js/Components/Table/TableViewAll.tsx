import get from 'lodash/get';
import { Form, Table } from 'react-bootstrap';
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
      paddingTop: '1rem',
      paddingBottom: '1rem',
    },
    auto: {
      verticalAlign: 'middle',
      paddingTop: '1rem',
      paddingBottom: '1rem',
    },
    action: {
      width: '180px',
      verticalAlign: 'middle',
      whiteSpace:'nowrap',
      paddingTop: '1rem',
      paddingBottom: '1rem',
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
  
  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <Table striped responsive className='mb-0'>
        <thead>
          <tr className="font-bold text-left">
            {columns?.map(column => (
              <th
                key={column.label}
                colSpan={column.colSpan ?? 1}
                className="pb-3 pt-5"
                style={column.name == 'id' ? styles.id : styles.auto}
              >
                {column.name == 'id' ? <Form.Check  className='check-all-item' type="checkbox" onChange={handleChangeAll} /> : column.label}
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
                      style={column.name == 'id' ? styles.id : column.name == 'action' ? styles.action : styles.auto}
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
      </Table>
    </div>
  );
}
