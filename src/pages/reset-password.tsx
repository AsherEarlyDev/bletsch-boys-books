import AppShell from "../components/AppShell";
import PasswordChange from "../components/UserManagementComponents/PasswordChange";
import {ToastContainer} from "react-toastify";

export default function DocumentationPage() {
  return (
      <>
        <AppShell activePage="Reset Password"></AppShell>
        <PasswordChange></PasswordChange>
        <ToastContainer></ToastContainer>
      </>
  )
}