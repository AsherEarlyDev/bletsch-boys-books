import TableEntry from "../../TableEntries/TableEntry";
import React from "react";
import { PurchaseOrder } from "../../../../types/purchaseTypes";
import ViewTableEntry from "../../TableEntries/ViewTableEntry";
import DeleteRowEntry from "../../TableEntries/DeleteRowEntry";
import EditRowEntry from "../../TableEntries/EditRowEntry";

interface OrderTableRowProp{
    OrderInfo: {
        id: string,
        date: string,
        vendor: {id: string, name: string, bookBuybackPercentage: number}
        items: any[],
        totalBooks: number,
        uniqueBooks: number,
        cost?: number
        revenue?: number
    },
    onEdit: (id:string) => void,
    onDelete: (id: string) =>void,
    onView: (id: string) =>void,
    onAdd: (id: string) =>void
  }


export default function OrderTableRow(props:OrderTableRowProp) {
    function handleEdit(){
        props.onEdit(props.OrderInfo.id)
      }
    function handleDelete(){
      props.onDelete(props.OrderInfo.id)
      }
    function handleView(){
      props.onView(props.OrderInfo.id)
      }
    function handleAdd(){
      props.onAdd(props.OrderInfo.id)
      }
  return (
      <tr>
        <ViewTableEntry onView={handleView}>{props.OrderInfo.date}</ViewTableEntry>
        <TableEntry>{props.OrderInfo.vendor.name}</TableEntry>
        <TableEntry>{props.OrderInfo.uniqueBooks}</TableEntry>
        <TableEntry>{props.OrderInfo.totalBooks}</TableEntry>
        <TableEntry>${props.OrderInfo.cost ? props.OrderInfo.cost.toFixed(2) : props.OrderInfo.revenue.toFixed(2)}</TableEntry>
        <EditRowEntry onEdit={handleEdit}></EditRowEntry>
        <DeleteRowEntry onDelete={handleDelete}></DeleteRowEntry>
      </tr>
  )
}
