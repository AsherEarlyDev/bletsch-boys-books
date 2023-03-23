import TableEntry from "../TableEntries/TableEntry";
import React from "react";
import { SalesRec } from "../../../types/salesTypes";
import {TrashIcon} from "@heroicons/react/20/solid";
import ViewTableEntry from "../TableEntries/ViewTableEntry";
import DeleteRowEntry from "../TableEntries/DeleteRowEntry";
import EditRowEntry from "../TableEntries/EditRowEntry";

interface SalesRecTableRowProp{
    salesRecInfo: SalesRec,
    onDelete: (id: string) =>void,
    onView: (id: string) =>void,
    onAdd: (id: string) =>void
  }


export default function SalesRecTableRow(props:SalesRecTableRowProp) {

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
        <ViewTableEntry onView={handleView}>{props.salesRecInfo.date}</ViewTableEntry>
        <TableEntry>{props.salesRecInfo.uniqueBooks}</TableEntry>
        <TableEntry>{props.salesRecInfo.totalBooks}</TableEntry>
        <TableEntry>${props.salesRecInfo.revenue.toFixed(2)}</TableEntry>
        <DeleteRowEntry onDelete={handleDelete}></DeleteRowEntry>
      </tr>
  )
}
