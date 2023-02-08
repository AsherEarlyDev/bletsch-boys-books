import TableEntry from "./TableEntry";
import React from "react";


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
        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
          <button onClick={handleEdit} className="text-indigo-600 hover:text-indigo-900">
            Edit<span className="sr-only">, {props.vendorInfo.id}</span>
          </button>
        </td>
        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
          <button onClick={handleDelete} className="text-indigo-600 hover:text-indigo-900">
            Delete<span className="sr-only">, {props.vendorInfo.id}</span>
          </button>
        </td>
      </tr>
      
  )
}
