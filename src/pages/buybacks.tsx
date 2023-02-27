import AppShell from "../components/AppShell";
import BuybackTable from "../components/TableComponents/Tables/BuybackTable";



export default function BuybacksPage() {
  return (
      <>
        <AppShell activePage="Buybacks"></AppShell>
        <BuybackTable></BuybackTable>
      </>
  )
}