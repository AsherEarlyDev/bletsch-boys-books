import AppShell from "../components/AppShell";
import Table from "../components/TableComponents/Tables/Table";
import BookCard from "../components/BookCard";


export default function RecordPage() {
  return (
      <>
        <AppShell activePage="Records"></AppShell>
        <Table></Table>
      </>
  )
}
