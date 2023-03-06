import React, { useState } from 'react';
import { api } from "../../../utils/api";
import TableDetails from "../TableDetails";
import TableHeader from "../TableHeader";
import { VendorTableRow } from '../TableRows/VendorTableRow';
import DeleteVendorModal from '../Modals/VendorModals/DeleteVendorModal';
import AddVendorModal from '../Modals/VendorModals/AddVendorModal';
import CreateEntries from "../../CreateEntries";
import EditVendorModal from "../Modals/VendorModals/EditVendorModal";
import ViewVendorModal from "../Modals/VendorModals/ViewVendorModal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Table from "./Table";
import {UserTableRow} from "../TableRows/UserTableRow";
import AddUserModal from "../Modals/UserModals/AddUserModal";


export default function UserTable() {
  const users = api.admin.getAllUsers.useQuery().data;
  const USERS_PER_PAGE = 5
  const FIRST_HEADER = ["Username", "username"]
  const SORTABLE_HEADERS = []
  const STATIC_HEADERS = ["Is Admin","Edit", "Delete"]
  const [sortField, setSortField] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [pageNumber, setPageNumber] = useState(0)
  const numberOfPages = Math.ceil(2 / USERS_PER_PAGE)
  const numberOfEntries = 2

  function renderUserRow() {
    return (users ? users.map((user) => (
        <UserTableRow userInfo={{id: user.id, name: user.username, isAdmin: user.isAdmin}}></UserTableRow>)) : null)
  }
  return (
      <div className="px-4 sm:px-6 lg:px-8">
        <TableDetails tableName="Users" tableDescription="A list of all the users.">
          <AddUserModal  buttonText="Create New User" submitText="Create User"></AddUserModal>
        </TableDetails>
        <Table sorting={{
          setOrder: setSortOrder,
          setField: setSortField,
          currentOrder: sortOrder,
          currentField: sortField
        }}
               setPage={setPageNumber}
               firstHeader={FIRST_HEADER}
               sortableHeaders={SORTABLE_HEADERS}
               staticHeaders={STATIC_HEADERS}
               items={users}
               pageNumber={pageNumber}
               numberOfPages={numberOfPages}
               entriesPerPage={USERS_PER_PAGE}
               numberOfEntries={numberOfEntries}
               renderRow={renderUserRow}></Table>
        <div>
          <ToastContainer/>
        </div>
      </div>
  )
}
