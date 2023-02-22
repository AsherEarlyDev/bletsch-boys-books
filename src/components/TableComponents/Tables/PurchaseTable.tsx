import { useState } from 'react';
import { api } from "../../../utils/api";
import TableDetails from "../TableDetails";
import TableHeader from "../TableHeader";
import CreateEntries from '../../CreateEntries';
import PurchaseOrderTableRow from '../TableRows/PurchaseOrderTableRow';
import AddPurchaseOrderModal from '../Modals/PurchaseModals/AddPurchaseOrderModal';
import PurchasesCard from '../Modals/PurchaseModals/PurchasesCard';
import ViewPurchaseModal from '../Modals/PurchaseModals/ViewPurchaseModal';
import SortedFilterableColumnHeading from '../TableColumnHeadings/SortedFilterableColumnHeading';
import DeletePurchaseOrderModal from "../Modals/PurchaseModals/DeletePurchaseOrderModal";
import EditPurchaseOrderModal from "../Modals/PurchaseModals/EditPurchaseOrderModal";
import Table from './Table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';





export default function PurchaseTable() {
  const FIRST_HEADER =  ["Date Created", "date"]
  const SORTABLE_HEADERS = [["Vendor Name", "vendorName"], ["Unique Books", "uniqueBooks"], ["Total Books", "totalBooks"], ["Total Cost", "cost"]]
  const STATIC_HEADERS = ["Add Purchase", "Edit", "Delete"]
  const ENTRIES_PER_PAGE = 3
  const [purchases, setPurchases] = useState<any[]>([])
  const [purchaseOrderId, setId] = useState('')
  const [currentOrder, setCurrentOrder] = useState({
    id: '',
    date: '',
    vendorName:''
  })
  const [pageNumber, setPageNumber] = useState(0)
  const [sortField, setSortField] = useState("date")
//   const [displayEntries, setDisplayEntries] = useState(false)
  const [sortOrder, setSortOrder] = useState("asc")
  //const purchaseOrder2: any[] = api.purchaseOrder.getPurchaseOrderDetails
  //.useQuery({pageNumber:pageNumber, entriesPerPage:ENTRIES_PER_PAGE, sortBy:sortField, descOrAsc:sortOrder}).data;
  const purchaseOrder2:any[] = api.purchaseOrder.getPurchaseOrders.useQuery({pageNumber:pageNumber, entriesPerPage:ENTRIES_PER_PAGE, sortBy:sortField, descOrAsc:sortOrder}).data
  const numberOfPages = Math.ceil(api.purchaseOrder.getNumberOfPurchaseOrders.useQuery().data / ENTRIES_PER_PAGE)
  const [displayEditPurchaseView, setDisplayEditPurchaseView] = useState(false)
  const [displayDeletePurchaseView, setDisplayDeletePurchaseView] = useState(false)
  const [displayPurchaseView, setDisplayPurchaseView] = useState(false)
  const [displayAddPurchaseView, setDisplayAddPurchaseView] = useState(false)
  const createPurchaseOrder = api.purchaseOrder.createPurchaseOrder.useMutation()
  const vendors = api.vendor.getAllVendors.useQuery().data
  const numberOfEntries = api.purchaseOrder.getNumberOfPurchaseOrders.useQuery().data

  async function handlePurchaseOrderSubmission(date: string, vendorId: string){
    if (createPurchaseOrder){
        createPurchaseOrder.mutate({
        date: date,
        vendorId: vendorId
      })
    }
  }

  function renderOrderRow(items:any[]){
    return(items ? items.map((order) => (
      <PurchaseOrderTableRow onAdd={handleAdd} onView={openPurchaseView} onDelete={openDeletePurchaseView} onEdit={openEditPurchaseView} purchaseOrderInfo={order}></PurchaseOrderTableRow>
  )) : null)
  }

  async function openEditPurchaseView(id: string){
    if (purchaseOrder2){
      for (const order of purchaseOrder2){
        if (order.id === id){
          setCurrentOrder({
            id: order.id,
            date: order.date,
            vendorName: order.vendorName
          })
        }
      }
      setDisplayEditPurchaseView(true)
    }
  }
  function renderEditPurchaseView() {
    return(
        <>
          {(displayEditPurchaseView && currentOrder) ?
              <CreateEntries closeStateFunction={setDisplayEditPurchaseView} submitText="Edit Purchase Order">
                <EditPurchaseOrderModal closeOut={closeEditPurchaseView} date={currentOrder.date} purchaseOrderId={currentOrder.id} vendorName={currentOrder.vendorName}></EditPurchaseOrderModal></CreateEntries> : null}
        </>
    )
  }
  function closeEditPurchaseView(){
    setDisplayEditPurchaseView(false)
  }

  async function openDeletePurchaseView(id: string){
    if (purchaseOrder2){
      for (const order of purchaseOrder2){
        if (order.id === id){
          setCurrentOrder({
            id: order.id,
            date: order.date,
            vendorName: order.vendorName
          })
        }
      }
      setDisplayDeletePurchaseView(true)
    }
  }
  function renderDeletePurchaseView() {
    return(
        <>
          {(displayDeletePurchaseView && currentOrder) ?
              <CreateEntries closeStateFunction={setDisplayDeletePurchaseView} submitText='Delete Purchase Order'>
              <DeletePurchaseOrderModal closeOut={closeDeletePurchaseView} purchaseId={currentOrder.id}></DeletePurchaseOrderModal>
          </CreateEntries>: null}
        </>
    )
  }
  function closeDeletePurchaseView(){
    setDisplayDeletePurchaseView(false)
  }

  async function openPurchaseView(id: string){
    if (purchaseOrder2){
      for (const order of purchaseOrder2){
        if (order.id === id && order.purchases){
          setPurchases(order.purchases)
        }
      }
      setDisplayPurchaseView(true)
    }
  }
  function renderPurchaseView() {
    return(
        <>
          {displayPurchaseView ? (purchases ? (
              <CreateEntries closeStateFunction={setDisplayPurchaseView} submitText="Show Purchase Details"> {purchases.map((purchase) => (
                  <ViewPurchaseModal closeOut={closePurchaseView} cardType={'edit'} purchase={purchase}></ViewPurchaseModal>))}</CreateEntries>) : null) : null}
        </>
    )
  }
  function closePurchaseView(){
    setDisplayPurchaseView(false)
  }

  const handleAdd = async (id:string) => {
    if (purchaseOrder2){
      for (const order of purchaseOrder2){
        if (order.id === id){
          setId(order.id)
        }
      }
      setDisplayAddPurchaseView(true)
    }
  }

  function renderAdd() {
    const dummyPurchase = {
        id: '',
        purchaseOrderId: purchaseOrderId,
        price: 0,
        quantity: 0,
        bookId: '',
        subtotal: 0
    }
    return <>
      {(displayAddPurchaseView && purchaseOrderId)?
          <CreateEntries closeStateFunction={setDisplayAddPurchaseView} submitText="Add Sale">
            <ViewPurchaseModal cardType={'entry'} purchase={dummyPurchase} closeOut={function (): void {
            throw new Error('Function not implemented.');
          } }></ViewPurchaseModal></CreateEntries> : null}
  </>;
  }


  return (
      <div className="px-4 sm:px-6 lg:px-8">
        <TableDetails tableName="Purchase Orders"
                      tableDescription="A list of all the Purchase Orders and Purchases.">
          <AddPurchaseOrderModal showPurchaseOrderEdit={handlePurchaseOrderSubmission} buttonText="Create Purchase Order"
                        submitText="Create Purchase Order" vendorList={vendors}></AddPurchaseOrderModal>
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
        sorting={{ setOrder: setSortOrder, setField: setSortField, currentOrder: sortOrder, currentField: sortField }} 
        entriesPerPage={ENTRIES_PER_PAGE}></Table>
        <div>
          {renderEditPurchaseView()}
          {renderDeletePurchaseView()}
          {renderPurchaseView()}
          {renderAdd()}
          <ToastContainer/>
        </div>
      </div>

  )
}
