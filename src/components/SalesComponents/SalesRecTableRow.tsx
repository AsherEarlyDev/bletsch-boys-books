import TableEntry from "./TableEntry";
import React from "react";
import { SalesRec } from "../../types/salesTypes";

interface SalesRecTableRowProp{
    salesRecInfo: SalesRec,
    onEdit: (id:string) => void,
    onDelete: (id: string) =>void,
    onView: (id: string) =>void,
    onAdd: (id: string) =>void
  }


export default function SalesRecTableRow(props:SalesRecTableRowProp) {
    function handleEdit(){
        props.onEdit(props.salesRecInfo.id)
      }
    function handleDelete(){
      props.onDelete(props.salesRecInfo.id)
      }
    function handleView(){
      props.onView(props.salesRecInfo.id)
      }
    function handleAdd(){
      props.onAdd(props.salesRecInfo.id)
      }
  return (
      <tr>
        <TableEntry firstEntry={true}>{props.salesRecInfo.id}</TableEntry>
        <TableEntry>{props.salesRecInfo.date}</TableEntry>
        <TableEntry>{props.salesRecInfo.uniqueBooks}</TableEntry>
        <TableEntry>{props.salesRecInfo.totalBooks}</TableEntry>
        <TableEntry>{props.salesRecInfo.revenue}</TableEntry>
        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
          <button onClick={handleEdit} className="text-indigo-600 hover:text-indigo-900">
            Edit<span className="sr-only">, {props.salesRecInfo.id}</span>
          </button>
        </td>
        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
          <button onClick={handleView} className="text-indigo-600 hover:text-indigo-900">
            View Details<span className="sr-only">, {props.salesRecInfo.id}</span>
          </button>
        </td>
        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
          <button onClick={handleDelete} className="text-indigo-600 hover:text-indigo-900">
            Delete<span className="sr-only">, {props.salesRecInfo.id}</span>
          </button>
        </td>
        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
          <button onClick={handleAdd} className="text-indigo-600 hover:text-indigo-900">
            Add Sale<span className="sr-only">, {props.salesRecInfo.id}</span>
          </button>
        </td>
      </tr>
  )
}
