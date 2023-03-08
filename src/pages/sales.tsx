import AppShell from "../components/AppShell";
import SalesTable from "../components/TableComponents/Tables/SalesTable";


export default function SalesPage() {
  return (
      <>
        <AppShell activePage="Sales"></AppShell>
        <SalesTable></SalesTable>
      </>
  )
}