import AppShell from "../components/AppShell";
import BookTable from "../components/TableComponents/Tables/BookTable";
import GenreTable from "../components/TableComponents/Tables/GenreTable";

export default function RecordPage() {
  return (
      <>
        <AppShell activePage="Records"></AppShell>
        <BookTable></BookTable>
        <GenreTable></GenreTable>
      </>
  )
}
