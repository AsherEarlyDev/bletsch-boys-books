import TableEntry from "../TableEntries/TableEntry";
import React from "react";
import ViewTableEntry from "../TableEntries/ViewTableEntry";
import DeleteRowEntry from "../TableEntries/DeleteRowEntry";
import EditRowEntry from "../TableEntries/EditRowEntry";
import { BuybackOrder } from "../../../types/buybackTypes";

interface BuybackOrderTableRowProp{
    buybackOrderInfo: BuybackOrder,
    onEdit: (id:string) => void,
    onDelete: (id: string) =>void,
    onView: (id: string) =>void,
    onAdd: (id: string) =>void
  }


export default function BuybackOrderTableRow(props:BuybackOrderTableRowProp) {
    function handleEdit(){
        props.onEdit(props.buybackOrderInfo.id)
      }
    function handleDelete(){
      props.onDelete(props.buybackOrderInfo.id)
      }
    function handleView(){
      props.onView(props.buybackOrderInfo.id)
      }
    function handleAdd(){
      props.onAdd(props.buybackOrderInfo.id)
      }
  return (
      <tr>
        <ViewTableEntry onView={handleView}>{props.buybackOrderInfo.date}</ViewTableEntry>
        <TableEntry>{props.buybackOrderInfo.vendor.name}</TableEntry>
        <TableEntry>{props.buybackOrderInfo.uniqueBooks}</TableEntry>
        <TableEntry>{props.buybackOrderInfo.totalBooks}</TableEntry>
        <TableEntry>${props.buybackOrderInfo.revenue.toFixed(2)}</TableEntry>
        <EditRowEntry onEdit={handleEdit}></EditRowEntry>
        <DeleteRowEntry onDelete={handleDelete}></DeleteRowEntry>
      </tr>
  )
}
