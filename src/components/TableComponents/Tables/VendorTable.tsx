import { useState } from 'react';
import { api } from "../../../utils/api";
import TableDetails from "../TableDetails";
import { VendorTableRow } from '../TableRows/VendorTableRow';
import AddVendorModal from '../Modals/VendorModals/AddVendorModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Table from "./Table";


export default function VendorTable() {
  const VENDORS_PER_PAGE = 5
  const FIRST_HEADER = ["Vendor Name", "name"]
  const SORTABLE_HEADERS = []
  const STATIC_HEADERS = ["Buyback Rate","Edit", "Delete"]
  const [sortField, setSortField] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [pageNumber, setPageNumber] = useState(0)
  const vendors = api.vendor.getVendors.useQuery({
        pageNumber: pageNumber,
        entriesPerPage: VENDORS_PER_PAGE,
        sortBy: sortField,
        descOrAsc: sortOrder
      }).data
  const newVendor = api.vendor.createVendor.useMutation({
    onSuccess: ()=>{
      window.location.reload()
    }
  })
  const numberOfPages = Math.ceil(api.vendor.getNumVendors.useQuery().data / VENDORS_PER_PAGE)
  const numberOfEntries = api.vendor.getNumVendors.useQuery().data

  const handleNewVendorSubmission = async (name: string, buyback: number) => {
    let buybackRate = buyback ? buyback : 0
    if (newVendor) {
      newVendor.mutate({
        name: name,
        buybackRate: buybackRate
      })
    }
  }

  function renderVendorRow() {
    return (vendors ? vendors.map((vendor) => (
        <VendorTableRow vendorInfo={{id: vendor.id, name: vendor.name, buybackRate: vendor.bookBuybackPercentage}}></VendorTableRow>)) : null)
  }

  return (
      <div className="px-4 sm:px-6 lg:px-8">
        <TableDetails tableName="Vendors" tableDescription="A list of all the Vendors.">
          <AddVendorModal showVendorEdit={handleNewVendorSubmission} buttonText="Add New Vendor" submitText="Add Vendor"></AddVendorModal>
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
               items={vendors}
               pageNumber={pageNumber}
               numberOfPages={numberOfPages}
               entriesPerPage={VENDORS_PER_PAGE}
               numberOfEntries={numberOfEntries}
               renderRow={renderVendorRow}></Table>
        <div>
          <ToastContainer/>
        </div>
      </div>
  )
}
