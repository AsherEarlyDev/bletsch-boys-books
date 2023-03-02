import TableEntry from "../TableEntries/TableEntry";
import React from "react";
import EditRowEntry from "../TableEntries/EditRowEntry";
import DeleteRowEntry from "../TableEntries/DeleteRowEntry";
import ViewTableEntry from "../TableEntries/ViewTableEntry";


interface UserTableRowProps{
    userInfo: {
        id: string
        name: string
        isAdmin: boolean
    }
  }


export function UserTableRow(props: UserTableRowProps){
  function handleEdit(){
    console.log("Editing user")
    // props.onEdit(props.vendorInfo.id)
  }
  function handleDelete(){
    console.log("Deleting user")
    // props.onDelete(props.vendorInfo.id)
  }
  function handleView(){
    // props.onView(props.vendorInfo.id)
  }
  return (
      <tr>
        <TableEntry firstEntry={true}>{props.userInfo.name}</TableEntry>
        <TableEntry>{props.userInfo.isAdmin ? "Admin" : "Not admin."}</TableEntry>
        <EditRowEntry onEdit={handleEdit}></EditRowEntry>
        <DeleteRowEntry onDelete={handleDelete}></DeleteRowEntry>
      </tr>
      
  )
}
