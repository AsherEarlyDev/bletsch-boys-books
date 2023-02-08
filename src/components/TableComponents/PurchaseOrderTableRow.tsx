import TableEntry from "./TableEntry";
import React from "react";
import { PurchaseOrder } from "../../types/purchaseTypes";

interface PurchaseOrderTableRowProp{
    purchaseOrderInfo: PurchaseOrder,
    onEdit: (id:string) => void,
    onDelete: (id: string) =>void,
    onView: (id: string) =>void,
    onAdd: (id: string) =>void
  }


export default function PurchaseOrderTableRow(props:PurchaseOrderTableRowProp) {
    function handleEdit(){
        props.onEdit(props.purchaseOrderInfo.id)
      }
    function handleDelete(){
      props.onDelete(props.purchaseOrderInfo.id)
      }
    function handleView(){
      props.onView(props.purchaseOrderInfo.id)
      }
    function handleAdd(){
      props.onAdd(props.purchaseOrderInfo.id)
      }
  return (
      <tr>
        <TableEntry firstEntry={true}>{props.purchaseOrderInfo.id}</TableEntry>
        <TableEntry>{props.purchaseOrderInfo.date}</TableEntry>
        <TableEntry>{props.purchaseOrderInfo.vendorName}</TableEntry>
        <TableEntry>{props.purchaseOrderInfo.uniqueBooks}</TableEntry>
        <TableEntry>{props.purchaseOrderInfo.totalBooks}</TableEntry>
        <TableEntry>{props.purchaseOrderInfo.cost}</TableEntry>
        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
          <button onClick={handleEdit} className="text-indigo-600 hover:text-indigo-900">
            Edit<span className="sr-only">, {props.purchaseOrderInfo.id}</span>
          </button>
        </td>
        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
          <button onClick={handleView} className="text-indigo-600 hover:text-indigo-900">
            View Details<span className="sr-only">, {props.purchaseOrderInfo.id}</span>
          </button>
        </td>
        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
          <button onClick={handleDelete} className="text-indigo-600 hover:text-indigo-900">
            Delete<span className="sr-only">, {props.purchaseOrderInfo.id}</span>
          </button>
        </td>
        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
          <button onClick={handleAdd} className="text-indigo-600 hover:text-indigo-900">
            Add Purchase<span className="sr-only">, {props.purchaseOrderInfo.id}</span>
          </button>
        </td>
      </tr>
  )
}
