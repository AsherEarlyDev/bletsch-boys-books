import AppShell from "../components/AppShell";
import SalesTable from "../components/SalesComponents/SalesTable";


export default function SalesPage() {
  return (
      <>
        <AppShell activePage="Sales"></AppShell>
        <SalesTable></SalesTable>
      </>
  )
}