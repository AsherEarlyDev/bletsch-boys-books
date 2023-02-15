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






export default function PurchaseTable() {
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
  const purchaseOrder: any[] = api.purchaseOrder.getPurchaseOrderDetails
  .useQuery({pageNumber:pageNumber, entriesPerPage:ENTRIES_PER_PAGE, sortBy:sortField, descOrAsc:sortOrder}).data;
  const numberOfPages = Math.ceil(api.purchaseOrder.getNumPurchaseOrder.useQuery().data / ENTRIES_PER_PAGE)
  const [displayEditPurchaseView, setDisplayEditPurchaseView] = useState(false)
  const [displayDeletePurchaseView, setDisplayDeletePurchaseView] = useState(false)
  const [displayPurchaseView, setDisplayPurchaseView] = useState(false)
  const [displayAddPurchaseView, setDisplayAddPurchaseView] = useState(false)
  const createPurchaseOrder = api.purchaseOrder.createPurchaseOrder.useMutation()
  const vendors = api.vendor.getVendors.useQuery().data

  async function handlePurchaseOrderSubmission(date: string, vendorId: string){
    if (createPurchaseOrder){
        createPurchaseOrder.mutate({
        date: date,
        vendorId: vendorId
      })
    }
  }

  async function openEditPurchaseView(id: string){
    if (purchaseOrder){
      for (const order of purchaseOrder){
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
    if (purchaseOrder){
      for (const order of purchaseOrder){
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
    if (purchaseOrder){
      console.log(purchaseOrder)
      for (const order of purchaseOrder){
        if (order.id === id && order.purchases){
          setPurchases(order.purchases)
        }
      }
      setDisplayPurchaseView(true)
      console.log(displayPurchaseView)
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
    if (purchaseOrder){
      for (const order of purchaseOrder){
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
            <ViewPurchaseModal cardType={'entry'} purchase={dummyPurchase}></ViewPurchaseModal></CreateEntries> : null}
  </>;
  }


  return (
      <div className="px-4 sm:px-6 lg:px-8">
        <TableDetails tableName="Purchase Orders"
                      tableDescription="A list of all the Purchase Orders and Purchases.">
          <AddPurchaseOrderModal showPurchaseOrderEdit={handlePurchaseOrderSubmission} buttonText="Create Purchase Order"
                        submitText="Create Purchase Order" vendorList={vendors}></AddPurchaseOrderModal>
        </TableDetails>
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div
                  className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300 table-auto">
                  <TableHeader>
                    <SortedFilterableColumnHeading resetPage={setPageNumber} setOrder={setSortOrder} currentOrder={sortOrder} currentField={sortField} sortFields={setSortField} databaseLabel="id" 
                    label="Purchase Order ID" firstEntry={true}></SortedFilterableColumnHeading>
                    <SortedFilterableColumnHeading resetPage={setPageNumber} setOrder={setSortOrder} currentOrder={sortOrder} currentField={sortField} sortFields={setSortField} databaseLabel="date" 
                    label="Date Created"></SortedFilterableColumnHeading>
                    <SortedFilterableColumnHeading resetPage={setPageNumber} setOrder={setSortOrder} currentOrder={sortOrder} currentField={sortField} sortFields={setSortField} databaseLabel="vendorName" 
                    label="Vendor Name"></SortedFilterableColumnHeading>
                    <SortedFilterableColumnHeading resetPage={setPageNumber} setOrder={setSortOrder} currentOrder={sortOrder} currentField={sortField} sortFields={setSortField} databaseLabel="uniqueBooks" 
                    label="Unique Books"></SortedFilterableColumnHeading>
                    <SortedFilterableColumnHeading resetPage={setPageNumber} setOrder={setSortOrder} currentOrder={sortOrder} currentField={sortField} sortFields={setSortField} databaseLabel="totalBooks" 
                    label="Total Books"></SortedFilterableColumnHeading>
                    <SortedFilterableColumnHeading resetPage={setPageNumber} setOrder={setSortOrder} currentOrder={sortOrder} currentField={sortField} sortFields={setSortField} databaseLabel="cost" 
                    label="Total Cost"></SortedFilterableColumnHeading>
                  </TableHeader>
                  <tbody className="divide-y divide-gray-200 bg-white">
                  {purchaseOrder ? purchaseOrder.map((order) => (
                      <PurchaseOrderTableRow onAdd={handleAdd} onView={openPurchaseView} onDelete={openDeletePurchaseView} onEdit={openEditPurchaseView} purchaseOrderInfo={order}></PurchaseOrderTableRow>
                  )) : null}
                  </tbody>
                </table>
                <center><button style={{padding:"10px"}} onClick={()=>setPageNumber(pageNumber-1)} disabled ={pageNumber===0} className="text-indigo-600 hover:text-indigo-900">
                  Previous     
                </button>
                <button style={{padding:"10px"}} onClick={()=>setPageNumber(pageNumber+1)} disabled={pageNumber===numberOfPages-1} className="text-indigo-600 hover:text-indigo-900">
                  Next
                </button></center>
              </div>
            </div>
          </div>
        </div>
        <div>
          {/* {renderEntries()} */}
          {renderEditPurchaseView()}
          {renderDeletePurchaseView()}
          {renderPurchaseView()}
          {renderAdd()}
        </div>
      </div>

  )
}
