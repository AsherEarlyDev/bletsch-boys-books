import AppShell from "../components/AppShell";
import PurchaseTable from "../components/TableComponents/Tables/PurchaseTable";


export default function PurchasesPage() {
  return (
      <>
        <AppShell activePage="Purchases"></AppShell>
        <PurchaseTable></PurchaseTable>
      </>
  )
}