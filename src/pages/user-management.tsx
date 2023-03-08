import AppShell from "../components/AppShell";
import React, {useState} from 'react';
import UserTable from "../components/TableComponents/Tables/UserTable";
import {useSession} from "next-auth/react";

export default function UserManagement() {
  const {data, status} = useSession()
  const activeUser = data?.user
  return (
      activeUser?.role!="USER" ?
        <>
         <AppShell activePage="User Management">
         </AppShell>
          <UserTable></UserTable>
        </>
          :
          <div>Page not available to regular users...</div>
    )
}