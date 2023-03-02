import { useState } from 'react';
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


export default function VendorTable() {
  const VENDORS_PER_PAGE = 5
  const FIRST_HEADER = ["Vendor Name", "name"]
  const SORTABLE_HEADERS = []
  const STATIC_HEADERS = ["Buyback Rate","Edit", "Delete"]
  const [sortField, setSortField] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [pageNumber, setPageNumber] = useState(0)
  const vendors = api.vendor.getVendors.useQuery(
      {
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
  const [displayEditVendorView, setDisplayEditVendorView] = useState(false)
  const [displayDeleteVendorView, setDisplayDeleteVendorView] = useState(false)
  const [displayVendorView, setDisplayVendorView] = useState(false)
  const [currentVendor, setCurrentVendor] = useState({id: '', name: '', buybackRate: null})

  const handleNewVendorSubmission = async (name: string, buyback: number) => {
    let buybackRate = buyback ? buyback : 0
    if (newVendor) {
      newVendor.mutate({
        name: name,
        buybackRate: buybackRate
      })
    }
  }


  async function openEditVendorView(id: string) {
    if (vendors) {
      for (const ven of vendors) {
        if (ven.id === id) {
          setCurrentVendor({
            id: ven.id,
            name: ven.name,
            buybackRate: ven.bookBuybackPercentage
          })
        }
      }
      setDisplayEditVendorView(true)
    }
  }

  function renderEditVendorView() {
    return (
        <>
          {(displayEditVendorView && currentVendor) ?
              <CreateEntries closeStateFunction={setDisplayEditVendorView} submitText="Edit Vendor">
                <EditVendorModal closeOut={closeEditVendorView} vendorId={currentVendor.id}
                                 vendorName={currentVendor.name} buyback={currentVendor.buybackRate}></EditVendorModal>
              </CreateEntries> : null}
        </>
    )
  }

  function closeEditVendorView() {
    setDisplayEditVendorView(false)
  }

  async function openDeleteVendorView(id: striDeleteVendorng) {
    if (vendors) {
      for (const ven of vendors) {
        if (ven.id === id) {
          setCurrentVendor({
            id: ven.id,
            name: ven.name,
            buybackRate: ven.bookBuybackPercentage
          })
        }
      }
      setDisplayDeleteVendorView(true)
    }
  }

  function renderDeleteVendorView() {
    return <>
      {(displayDeleteVendorView && currentVendor) ?
          <CreateEntries closeStateFunction={setDisplayDeleteVendorView} submitText="Delete Vendor">
            <DeleteVendorModal closeOut={closeDeleteVendorView} vendorId={currentVendor.id}
                               vendorName={currentVendor.name}></DeleteVendorModal></CreateEntries> : null}
    </>;
  }

  function closeDeleteVendorView() {
    setDisplayDeleteVendorView(false)
  }

  async function openVendorView(id: string) {
    if (vendors) {
      for (const ven of vendors) {
        if (ven.id === id) {
          setCurrentVendor({
            id: ven.id,
            name: ven.name,
            buybackRate: ven.bookBuybackPercentage
          })
        }
      }
      setDisplayVendorView(true)
    }
  }

  function renderVendorView() {
    return <>
      {(displayVendorView && currentVendor) ?
          <CreateEntries closeStateFunction={setDisplayVendorView} submitText="Edit Vendor">
            <ViewVendorModal closeOut={closeVendorView} vendorId={currentVendor.id}
                             vendorName={currentVendor.name}
                             buybackRate={currentVendor.buybackRate}
                             openEdit={openEditVendorView}></ViewVendorModal></CreateEntries> : null}
    </>;
  }

  function closeVendorView() {
    setDisplayVendorView(false)
  }

  function renderVendorRow() {
    return (vendors ? vendors.map((vendor) => (
        <VendorTableRow onView={openVendorView} onEdit={openEditVendorView}
                        onDelete={openView}
                        vendorInfo={{id: vendor.id, name: vendor.name, buybackRate: vendor.bookBuybackPercentage}}></VendorTableRow>)) : null)
  }

  return (
      <div className="px-4 sm:px-6 lg:px-8">
        <TableDetails tableName="Vendors" tableDescription="A list of all the Vendors.">
          <AddVendorModal showVendorEdit={handleNewVendorSubmission} buttonText="Add New Vendor"
                          submitText="Add Vendor"></AddVendorModal>
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
               headersNotFiltered={["price", "inventory"]}
               pageNumber={pageNumber}
               numberOfPages={numberOfPages}
               entriesPerPage={VENDORS_PER_PAGE}
               numberOfEntries={numberOfEntries}
               renderRow={renderVendorRow}></Table>
        <div>
          {renderEditVendorView()}
          {renderDeleteVendorView()}
          {renderVendorView()}
          <ToastContainer/>
        </div>
      </div>
  )
}
