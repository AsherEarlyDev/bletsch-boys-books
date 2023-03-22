import TableEntry from "../TableEntries/TableEntry";
import React from "react";
import EditUserModal from "../Modals/UserModals/EditUserModal";
import DeleteEntryModal from "../Modals/MasterModals/DeleteEntryModal";
import {useSession} from "next-auth/react";
import { Role } from "@prisma/client";
import {api} from "../../../utils/api";

interface UserTableRowProps{
    userInfo: {
        id: string
        name: string
        role: Role
    }
  }


export function UserTableRow(props: UserTableRowProps){
  const { data: session} = useSession()
  return (
      <tr>
        <TableEntry firstEntry={true}>{props.userInfo.name}</TableEntry>
        <TableEntry>{props.userInfo.role}</TableEntry>
        {(props.userInfo.id != session.user?.id && props.userInfo.role!="SUPERADMIN") &&
        <EditUserModal isAdmin={props.userInfo.role=="ADMIN"} username={props.userInfo.name} id={props.userInfo.id}></EditUserModal>}
        {(props.userInfo.id != session.user?.id && props.userInfo.role!="SUPERADMIN") &&
        <DeleteEntryModal router={api.user.deleteUser} item="User" id={props.userInfo.id}></DeleteEntryModal>}
      </tr>
      
  )
}
