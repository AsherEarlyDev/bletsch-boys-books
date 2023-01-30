import AppShell from "../components/AppShell";
import React from 'react';
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const sessionData = useSession();
  if (sessionData.status === 'authenticated'){
    return (
        <>
          <AppShell activePage="Dashboard"></AppShell>
        </>
    )
  }
  return <p>Not Authenticated</p>
}