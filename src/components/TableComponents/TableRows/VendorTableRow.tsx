import TableEntry from "../TableEntries/TableEntry";
import React from "react";
import EditRowEntry from "../TableEntries/EditRowEntry";
import DeleteRowEntry from "../TableEntries/DeleteRowEntry";
import ViewTableEntry from "../TableEntries/ViewTableEntry";


interface VendorRowProps{
    vendorInfo: {
        id: string
        name: string
        buybackRate: number
    },
    onEdit: (id:string) => void,
    onDelete: (id: string) => void
    onView: (id: string) => void
  }


export function VendorTableRow(props: VendorRowProps){
    function handleEdit(){
      props.onEdit(props.vendorInfo.id)
    }
    function handleDelete(){
      props.onDelete(props.vendorInfo.id)
    }
    function handleView(){
      props.onView(props.vendorInfo.id)
    }
  return (
      <tr>
        <ViewTableEntry onView={handleView}>{props.vendorInfo.name}</ViewTableEntry>
        <TableEntry>{(props.vendorInfo.buybackRate === null) || (props.vendorInfo.buybackRate === 0)? "" : 
        (props.vendorInfo.buybackRate * 100)+"%"}</TableEntry>
        <EditRowEntry onEdit={handleEdit}></EditRowEntry>
        <DeleteRowEntry onDelete={handleDelete}></DeleteRowEntry>
      </tr>
      
  )
}
