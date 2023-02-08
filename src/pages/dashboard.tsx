import AppShell from "../components/AppShell";
import React from 'react';
import ErrorAlert from "../components/BasicComponents/ErrorAlert";
import SuccessAlert from "../components/BasicComponents/SuccessAlert";

export default function DashboardPage() {
    return (
        <>
         <AppShell activePage="Dashboard"></AppShell>
          <ErrorAlert message="error" messageDetails="You can't do that..."></ErrorAlert>
          <SuccessAlert message="great job" messageDetails="Well done."></SuccessAlert>
        </>
    )
}