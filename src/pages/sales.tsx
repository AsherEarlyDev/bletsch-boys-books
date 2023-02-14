import AppShell from "../components/AppShell";
import SalesTable from "../components/TableComponents/Tables/SalesTable";
import OldSalesTable from "../components/SalesComponents/OldSalesTable";


export default function SalesPage() {
  return (
      <>
        <AppShell activePage="Sales"></AppShell>
        <SalesTable></SalesTable>
      </>
  )
}