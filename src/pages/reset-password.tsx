import AppShell from "../components/AppShell";
import PasswordChange from "../components/PasswordChange";

export default function DocumentationPage() {
  return (
      <>
        <AppShell activePage="Reset Password"></AppShell>
        <PasswordChange></PasswordChange>
      </>
  )
}