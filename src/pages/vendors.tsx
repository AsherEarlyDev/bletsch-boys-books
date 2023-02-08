import AppShell from "../components/AppShell";
import React from 'react';
import VendorTable from "../components/VendorComponents/VendorTable";

export default function VendorsPage() {
    return (
        <>
         <AppShell activePage="Vendors"></AppShell>
         <VendorTable></VendorTable>
        </>
        
    )
}