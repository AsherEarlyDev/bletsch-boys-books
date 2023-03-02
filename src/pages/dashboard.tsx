import AppShell from "../components/AppShell";
import React from 'react';
import DashboardStats from "../components/BasicComponents/DashboardStats";

export default function DashboardPage() {

    return (
        <>
         <AppShell activePage="Dashboard">
         </AppShell>
          <DashboardStats></DashboardStats>
        </>
    )
}