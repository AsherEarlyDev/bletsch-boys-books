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
import {useSession} from "next-auth/react";
import OrderTableRow from '../TableRows/Parent/OrderTableRow';
import DeleteOrderModal from '../Modals/ParentModals/DeleteOrderModal';
import ViewTableModal from '../Modals/ParentModals/ViewTableModal';
import { useRouter } from 'next/router'
import { boolean } from 'zod';


export default function PurchaseTable() {
  const {query} = useRouter()
  const router = useRouter()
  const {data, status} = useSession()
  const isAdmin = (data?.user.role == "ADMIN" || data?.user.role == "SUPERADMIN")

  const FIRST_HEADER = ["Date Created", "date"]
  const SORTABLE_HEADERS = [["Vendor Name", "vendorName"], ["Unique Books", "uniqueBooks"], ["Total Books", "totalBooks"], ["Total Cost", "cost"], , ["Creator", "userName"]]
  const STATIC_HEADERS = isAdmin ? ["Edit", "Delete"] : []
  const [entriesPerPage, setEntries] = useState(10)
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
    entriesPerPage: entriesPerPage,
    sortBy: sortField,
    descOrAsc: sortOrder
  }).data
  const numberOfPages = Math.ceil(api.purchaseOrder.getNumberOfPurchaseOrders.useQuery().data / entriesPerPage)
  const [displayEditPurchaseView, setDisplayEditPurchaseView] = useState(false)
  const [displayDeletePurchaseView, setDisplayDeletePurchaseView] = useState(false)
  const displayPurchaseView = query.openView ? (query.openView==="true" ? true : false) : false
  const currentViewId = query.viewId ? query.viewId.toString() : ""
  const viewCurrentOrder = api.purchaseOrder.getUniquePurchaseOrders.useQuery(currentViewId).data
  const viewCurrentPurchases = viewCurrentOrder ? viewCurrentOrder.purchases : undefined
  const createPurchaseOrder = api.purchaseOrder.createPurchaseOrder.useMutation({
    onSuccess: ()=>{
      setOnlyEdit(false)
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
        vendorId: vendorId,
        userName: data?.user?.name
      })
    }
  }

  function renderOrderRow(items: any[]) {
    return (items ? items.map((order) => (
        <OrderTableRow type="Purchase" onView={openPurchaseView}
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
  
  function setDisplayPurchaseView(view:boolean, id?: string) {
    view ? router.push({
      pathname:'/purchases',
      query:{
        openView:"true",
        viewId: id
      }
    }, undefined, { shallow: true }) : 
    router.push({
      pathname:'/purchases',
      
    }, undefined, { shallow: true })
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
                                          id={currentOrder.id} type="Purchase Order" deleteMutation={deletePurchase}></DeleteOrderModal>
              </CreateEntries> : null}
        </>
    )
  }

  function closeDeletePurchaseView() {
    setDisplayDeletePurchaseView(false)
  }

  async function openPurchaseView(id: string) {
    setDisplayPurchaseView(true, id)
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
    }

  }

  function renderPurchaseView() {
    return (
        <>
          {displayPurchaseView ? (viewCurrentPurchases ? (
              <CreateEntries closeStateFunction={setDisplayPurchaseView} submitText="Show Purchase Details">
                <ViewTableModal type="Purchase Order" closeOut={closePurchaseView} items={viewCurrentPurchases}
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
          <div className="flex flex-row gap-3 items-center">
            <p>Entries Per page:</p>
            <div><select className="rounded-md border-1 border-indigo-600 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto" name="entriesPerPage" id="entriesPerPage" defaultValue={entriesPerPage} onChange={(e)=>setEntries(parseInt(e.currentTarget.value))}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            </div>
          </div>
        <div>{isAdmin && <AddOrderModal showOrderEdit={handlePurchaseOrderSubmission} buttonText="Create Purchase Order" submitText="Create Purchase Order" vendorList={vendors}></AddOrderModal>}</div>
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
            entriesPerPage={entriesPerPage}></Table>
        <div>
          {renderEditPurchaseView()}
          {renderDeletePurchaseView()}
          {renderPurchaseView()}
          <ToastContainer/>
        </div>
      </div>

  )
}
