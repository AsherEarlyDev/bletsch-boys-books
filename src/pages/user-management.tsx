import AppShell from "../components/AppShell";
import React, {useState} from 'react';
import UserTable from "../components/TableComponents/Tables/UserTable";

export default function UserManagement() {
  return (
        <>
         <AppShell activePage="User Management">
         </AppShell>
          <UserTable></UserTable>
        </>
    )
}