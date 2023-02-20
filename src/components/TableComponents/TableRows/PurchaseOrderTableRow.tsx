import TableEntry from "../TableEntries/TableEntry";
import React from "react";
import { PurchaseOrder } from "../../../types/purchaseTypes";
import ViewTableEntry from "../TableEntries/ViewTableEntry";
import DeleteRowEntry from "../TableEntries/DeleteRowEntry";
import EditRowEntry from "../TableEntries/EditRowEntry";

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
        <ViewTableEntry onView={handleView}>{props.purchaseOrderInfo.id}</ViewTableEntry>
        <TableEntry>{props.purchaseOrderInfo.date}</TableEntry>
        <TableEntry>{props.purchaseOrderInfo.vendor.name}</TableEntry>
        <TableEntry>{props.purchaseOrderInfo.uniqueBooks}</TableEntry>
        <TableEntry>{props.purchaseOrderInfo.totalBooks}</TableEntry>
        <TableEntry>{props.purchaseOrderInfo.cost}</TableEntry>
        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
          <button onClick={handleAdd} className="text-indigo-600 hover:text-indigo-900">
            Add Purchase<span className="sr-only">, {props.purchaseOrderInfo.id}</span>
          </button>
        </td>
        <EditRowEntry onEdit={handleEdit}></EditRowEntry>
        <DeleteRowEntry onDelete={handleDelete}></DeleteRowEntry>
      </tr>
  )
}
