import AppShell from "../components/AppShell";
import BookTable from "../components/TableComponents/Tables/BookTable";
import GenreTable from "../components/TableComponents/Tables/GenreTable";

export default function GenrePage() {
  return (
      <>
        <AppShell activePage="Genres"></AppShell>
        <GenreTable></GenreTable>
      </>
  )
}
