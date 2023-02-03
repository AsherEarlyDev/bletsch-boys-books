import AppShell from "../components/AppShell";
import Table from "../components/Table";
import AddBookCard from "../components/AddBookCard";


export default function RecordPage() {
  return (
      <>
        <AppShell activePage="Records"></AppShell>
        <Table></Table>
      </>
  )
}
