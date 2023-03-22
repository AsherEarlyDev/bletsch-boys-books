import React, { useState } from 'react';
import { api } from "../../../utils/api";
import TableDetails from "../TableDetails";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Table from "./Table";
import {UserTableRow} from "../TableRows/UserTableRow";
import AddUserModal from "../Modals/UserModals/AddUserModal";


export default function UserTable() {
  const users = api.user.getAllUsers.useQuery().data;
  const USERS_PER_PAGE = 5
  const FIRST_HEADER = ["Username", "username"]
  const SORTABLE_HEADERS = []
  const STATIC_HEADERS = ["Role","Edit", "Delete"]
  const [sortField, setSortField] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [pageNumber, setPageNumber] = useState(0)
  const numberOfEntries = api.user.getNumberOfUsers.useQuery().data;
  const numberOfPages = Math.ceil(numberOfEntries / USERS_PER_PAGE)

  function renderUserRow() {
    return (users ? users.map((user) => (
        <UserTableRow userInfo={{id: user.id, name: user.name, role: user.role}}></UserTableRow>)) : null)
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
