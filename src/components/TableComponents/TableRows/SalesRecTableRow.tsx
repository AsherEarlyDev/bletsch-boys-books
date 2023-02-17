import TableEntry from "../TableEntries/TableEntry";
import React from "react";
import { SalesRec } from "../../../types/salesTypes";
import {TrashIcon} from "@heroicons/react/20/solid";
import ViewTableEntry from "../TableEntries/ViewTableEntry";
import DeleteRowEntry from "../TableEntries/DeleteRowEntry";
import EditRowEntry from "../TableEntries/EditRowEntry";

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
        <ViewTableEntry onView={handleView}>{props.salesRecInfo.id}</ViewTableEntry>
        <TableEntry>{props.salesRecInfo.date}</TableEntry>
        <TableEntry>{props.salesRecInfo.uniqueBooks}</TableEntry>
        <TableEntry>{props.salesRecInfo.totalBooks}</TableEntry>
        <TableEntry>{props.salesRecInfo.revenue}</TableEntry>
        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
          <button onClick={handleAdd} className="text-indigo-600 hover:text-indigo-900">
            Add Sale<span className="sr-only">, {props.salesRecInfo.id}</span>
          </button>
        </td>
        <EditRowEntry onEdit={handleEdit}></EditRowEntry>
        <DeleteRowEntry onDelete={handleDelete}></DeleteRowEntry>
      </tr>
  )
}
