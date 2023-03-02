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
        <ViewTableEntry onView={handleView}>{props.purchaseOrderInfo.date}</ViewTableEntry>
        <TableEntry>{props.purchaseOrderInfo.vendor.name}</TableEntry>
        <TableEntry>{props.purchaseOrderInfo.uniqueBooks}</TableEntry>
        <TableEntry>{props.purchaseOrderInfo.totalBooks}</TableEntry>
        <TableEntry>${props.purchaseOrderInfo.cost.toFixed(2)}</TableEntry>
        <EditRowEntry onEdit={handleEdit}></EditRowEntry>
        <DeleteRowEntry onDelete={handleDelete}></DeleteRowEntry>
      </tr>
  )
}
