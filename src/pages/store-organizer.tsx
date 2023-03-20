import AppShell from "../components/AppShell";
import StoreOrganizer from "../components/TableComponents/Tables/StoreOrganizer";


export default function StoreOrganizerPage() {
  return (
      <>
        <AppShell activePage="Store Organizer"></AppShell>
        <StoreOrganizer></StoreOrganizer>
      </>
  )
}