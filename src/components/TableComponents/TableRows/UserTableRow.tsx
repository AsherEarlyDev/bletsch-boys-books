import TableEntry from "../TableEntries/TableEntry";
import React from "react";
import EditRowEntry from "../TableEntries/EditRowEntry";
import DeleteRowEntry from "../TableEntries/DeleteRowEntry";
import ViewTableEntry from "../TableEntries/ViewTableEntry";
import AddUserModal from "../Modals/UserModals/AddUserModal";
import EditUserModal from "../Modals/UserModals/EditUserModal";
import DeleteUserModal from "../Modals/UserModals/DeleteUserModal";
import {ToastContainer} from "react-toastify";


interface UserTableRowProps{
    userInfo: {
        id: number
        name: string
        isAdmin: boolean
    }
  }


export function UserTableRow(props: UserTableRowProps){
  return (
      <tr>
        <TableEntry firstEntry={true}>{props.userInfo.name}</TableEntry>
        <TableEntry>{props.userInfo.isAdmin ? "Admin" : "Not admin."}</TableEntry>
        {props.userInfo.id != 1 &&
        <EditUserModal isAdmin={props.userInfo.isAdmin} username={props.userInfo.name} id={props.userInfo.id}></EditUserModal>}
        {props.userInfo.id != 1 &&
        <DeleteUserModal id={props.userInfo.id}></DeleteUserModal>}
      </tr>
      
  )
}
