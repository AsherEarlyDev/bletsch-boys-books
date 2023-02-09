import TableEntry from "../TableComponents/TableEntry";
import React from "react";
import {TrashIcon} from '@heroicons/react/20/solid'


interface VendorProps{
    vendorInfo: {
        id: string
        name: string
    },
    onEdit: (id:string) => void,
    onDelete: (id: string) =>void
  }


export function VendorTableRow(props: VendorProps){
    function handleEdit(){
        props.onEdit(props.vendorInfo.id)
      }
    function handleDelete(){
      props.onDelete(props.vendorInfo.id)
      }
  return (
      <tr>
        <TableEntry>{props.vendorInfo.id}</TableEntry>
        <TableEntry>{props.vendorInfo.name}</TableEntry>
        <td className="relative whitespace-nowrap py-4 pl-1 text-right text-sm font-medium sm:pr-6">
          <button onClick={handleEdit} className="text-indigo-600 hover:text-indigo-900">
            Edit<span className="sr-only">, {props.vendorInfo.id}</span>
          </button>
        </td>
        <td className="relative whitespace-nowrap py-2 pr-2 text-right text-sm font-sm sm:pr-6">
          <button onClick={handleDelete} className="text-indigo-600 hover:text-indigo-900">
            <TrashIcon className="h-4 w-4"/> <span className="sr-only">, {props.vendorInfo.id}</span>
          </button>
        </td>
      </tr>
      
  )
}
