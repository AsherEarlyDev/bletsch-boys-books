import {useState} from 'react';
import {api} from "../../../utils/api";
import TableDetails from "../TableDetails";
import CreateEntries from '../../CreateEntries';
import AddOrderModal from '../Modals/ParentModals/AddOrderModal';
import Table from './Table';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ViewPurchaseTableModal from '../Modals/PurchaseModals/Unused/ViewPurchaseTableModal';
import EditPurchaseTableModal from "../Modals/PurchaseModals/EditPurchaseTableModal";
import OrderTableRow from '../TableRows/Parent/OrderTableRow';
import DeleteOrderModal from '../Modals/ParentModals/DeleteOrderModal';
import ViewTableModal from '../Modals/ParentModals/ViewTableModal';


export default function PurchaseTable() {
  const FIRST_HEADER = ["Date Created", "date"]
  const SORTABLE_HEADERS = [["Vendor Name", "vendorName"], ["Unique Books", "uniqueBooks"], ["Total Books", "totalBooks"], ["Total Cost", "cost"]]
  const STATIC_HEADERS = ["Edit", "Delete"]
  const ENTRIES_PER_PAGE = 5
  const [purchases, setPurchases] = useState<any[]>([])
  const [currentOrder, setCurrentOrder] = useState({
    id: '',
    date: '',
    vendor: {id: '', name: '', bookBuybackPercentage: 0}
  })
  const [onlyEdit, setOnlyEdit] = useState(false)
  const [pageNumber, setPageNumber] = useState(0)
  const [sortField, setSortField] = useState("date")
  const [sortOrder, setSortOrder] = useState("asc")
  const purchaseOrder2: any[] = api.purchaseOrder.getPurchaseOrders.useQuery({
    pageNumber: pageNumber,
    entriesPerPage: ENTRIES_PER_PAGE,
    sortBy: sortField,
    descOrAsc: sortOrder
  }).data
  const numberOfPages = Math.ceil(api.purchaseOrder.getNumberOfPurchaseOrders.useQuery().data / ENTRIES_PER_PAGE)
  const [displayEditPurchaseView, setDisplayEditPurchaseView] = useState(false)
  const [displayDeletePurchaseView, setDisplayDeletePurchaseView] = useState(false)
  const [displayPurchaseView, setDisplayPurchaseView] = useState(false)
  const createPurchaseOrder = api.purchaseOrder.createPurchaseOrder.useMutation({
    onSuccess: ()=>{
      setDisplayEditPurchaseView(true)
    }
  })
  const deletePurchase = api.purchaseOrder.deletePurchaseOrder
  const vendors = api.vendor.getAllVendors.useQuery().data
  const numberOfEntries = api.purchaseOrder.getNumberOfPurchaseOrders.useQuery().data

  async function handlePurchaseOrderSubmission(date: string, vendorId: string) {
    if (createPurchaseOrder) {
      createPurchaseOrder.mutate({
        date: date,
        vendorId: vendorId
      })
    }
  }

  function renderOrderRow(items: any[]) {
    return (items ? items.map((order) => (
        <OrderTableRow onView={openPurchaseView}
                               onDelete={openDeletePurchaseView} onEdit={openEditPurchaseView}
                               OrderInfo={order}></OrderTableRow>
    )) : null)
  }

  async function openEditPurchaseView(id: string) {
    if (purchaseOrder2) {
      for (const order of purchaseOrder2) {
        if (order.id === id) {
          setCurrentOrder({
            id: order.id,
            date: order.date,
            vendor: order.vendor
          })
        }
      }
      setOnlyEdit(true)
      setDisplayEditPurchaseView(true)
    }
  }

  function renderEditPurchaseView() {
    const value = onlyEdit ? currentOrder : createPurchaseOrder.data
    return (
        <>
          {(displayEditPurchaseView && value) ?
              <CreateEntries closeStateFunction={setDisplayEditPurchaseView}
                             submitText="Edit Purchase Order">
                <EditPurchaseTableModal closeOut={closeEditPurchaseView}
                                        purchaseDate={value.date}
                                        purchaseOrderId={value.id}
                                        purchaseVendor={value.vendor}></EditPurchaseTableModal></CreateEntries> : ()=>{
                                          toast.warning("LOADING...")
                                        }}
        </>
    )
  }
  
  
  
  function closeEditPurchaseView() {
    setDisplayEditPurchaseView(false)
    setOnlyEdit(false)
  }

  async function openDeletePurchaseView(id: string) {
    if (purchaseOrder2) {
      for (const order of purchaseOrder2) {
        if (order.id === id) {
          setCurrentOrder({
            id: order.id,
            date: order.date,
            vendor: order.vendor
          })
        }
      }
      setDisplayDeletePurchaseView(true)
    }
  }

  function renderDeletePurchaseView() {
    return (
        <>
          {(displayDeletePurchaseView && currentOrder) ?
              <CreateEntries closeStateFunction={setDisplayDeletePurchaseView}
                             submitText='Delete Purchase Order'>
                <DeleteOrderModal closeOut={closeDeletePurchaseView}
                                          id={currentOrder.id} type="Purchase" deleteMutation={deletePurchase}></DeleteOrderModal>
              </CreateEntries> : null}
        </>
    )
  }

  function closeDeletePurchaseView() {
    setDisplayDeletePurchaseView(false)
  }

  async function openPurchaseView(id: string) {
    if (purchaseOrder2) {
      for (const order of purchaseOrder2) {
        if (order.id === id && order.purchases) {
          setCurrentOrder({
            id: order.id,
            date: order.date,
            vendor: order.vendor
          })
          setPurchases(order.purchases)
        }
      }
      setDisplayPurchaseView(true)
    }
  }

  function renderPurchaseView() {
    return (
        <>
          {displayPurchaseView ? (purchases ? (
              <CreateEntries closeStateFunction={setDisplayPurchaseView}
                             submitText="Show Purchase Details">
                <ViewTableModal type="Purchases" closeOut={closePurchaseView} items={purchases}
                                        id={currentOrder.id}
                                        date={currentOrder.date}
                                        vendor={currentOrder.vendor}></ViewTableModal>
              </CreateEntries>) : null) : null}
        </>
    )
  }

  function closePurchaseView() {
    setDisplayPurchaseView(false)
  }

  return (
      <div className="px-4 sm:px-6 lg:px-8">
        <TableDetails tableName="Purchase Orders"
                      tableDescription="A list of all the Purchase Orders and Purchases.">
          <AddOrderModal showOrderEdit={handlePurchaseOrderSubmission}
                                 buttonText="Create Purchase Order"
                                 submitText="Create Purchase Order"
                                 vendorList={vendors}></AddOrderModal>
        </TableDetails>
        <Table
            setPage={setPageNumber}
            sortableHeaders={SORTABLE_HEADERS}
            firstHeader={FIRST_HEADER}
            staticHeaders={STATIC_HEADERS}
            items={purchaseOrder2}
            pageNumber={pageNumber}
            numberOfPages={numberOfPages}
            numberOfEntries={numberOfEntries}
            renderRow={renderOrderRow}
            sorting={{
              setOrder: setSortOrder,
              setField: setSortField,
              currentOrder: sortOrder,
              currentField: sortField
            }}
            entriesPerPage={ENTRIES_PER_PAGE}></Table>
        <div>
          {renderEditPurchaseView()}
          {renderDeletePurchaseView()}
          {renderPurchaseView()}
          <ToastContainer/>
        </div>
      </div>

  )
}
