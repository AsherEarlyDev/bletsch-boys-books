import AppShell from "../components/AppShell";
import Table from "../components/TableComponents/Tables/Table";
import GenreTable from "../components/TableComponents/Tables/GenreTable";

export default function RecordPage() {
  return (
      <>
        <AppShell activePage="Records"></AppShell>
        <Table></Table>
        {/*<GenreTable></GenreTable>*/}
      </>
  )
}
