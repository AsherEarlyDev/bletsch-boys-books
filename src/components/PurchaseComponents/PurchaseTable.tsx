import { useState } from 'react';
import { api } from "../../utils/api";
import TableDetails from "../TableComponents/TableDetails";
import FilterableColumnHeading from "../TableComponents/FilterableColumnHeading";
import TableHeader from "../TableComponents/TableHeader";
import CreateEntries from '../CreateEntries';
import PurchaseOrderTableRow from '../TableComponents/PurchaseOrderTableRow';
import AddPurchaseOrderModal from './AddPurchaseOrderModal';
import PurchasesCard from './PurchasesCard';
import PurchaseDetailsCard from './PurchaseDetailsCard';
import SortedFilterableColumnHeading from '../TableComponents/SortedFilterableColumnHeading';






export default function PurchaseTable() {
  const ENTRIES_PER_PAGE = 5
  const [purchases, setPurchases] = useState<any[]>([])
  const [purchaseOrderId, setId] = useState('')
  const [currOrder, setCurrOrder] = useState({
    id: '',
    date: '',
    vendorName:''
  })
  const [pageNumber, setPageNumber] = useState(0)
  const [sortField, setSortField] = useState("date")
//   const [displayEntries, setDisplayEntries] = useState(false)
  const purchaseOrder: any[] = api.purchaseOrder.getPurchaseOrderDetails
  .useQuery({pageNumber:pageNumber, entriesPerPage:ENTRIES_PER_PAGE, sortBy:sortField, descOrAsc:"desc"}).data;
  const numberOfPages = Math.ceil(api.purchaseOrder.getNumPurchaseOrder.useQuery().data / ENTRIES_PER_PAGE)
  const [displayEdit, setDisplayEdit] = useState(false)
  const [displayDelete, setDelete] = useState(false)
  const [displayDetails, setDisplayDetails] = useState(false)
  const [displayAdd, setDisplayAdd] = useState(false)
  const createPurchaseOrder = api.purchaseOrder.createPurchaseOrder.useMutation()
  const vendors = api.vendor.getVendors.useQuery().data

  const handleOrderSubmit = async (date: string, vendorId: string) => {
    // setDate(date)
    // setDisplayEntries(true)
    if (createPurchaseOrder){
        createPurchaseOrder.mutate({
        date: date,
        vendorId: vendorId
      })
    }
  }

  const handleEdit = async (id:string) => {
    if (purchaseOrder){
      for (const order of purchaseOrder){
        if (order.id === id){
          setCurrOrder({
            id: order.id, 
            date: order.date,
            vendorName: order.vendorName
          })
        }
      }
      setDisplayEdit(true)
    }
    
  }

  const handleDelete = async (id:string) => {
    if (purchaseOrder){
        for (const order of purchaseOrder){
          if (order.id === id){
            
            setCurrOrder({
              id: order.id, 
              date: order.date,
              vendorName: order.vendorName
            })
          }
        }
        setDelete(true)
      }
  }

  const handleView = async (id:string) => {
    console.log("View")
    if (purchaseOrder){
      console.log(purchaseOrder)
      for (const order of purchaseOrder){
        if (order.id === id && order.purchases){
          setPurchases(order.purchases)
        }
      }
      setDisplayDetails(true)
      console.log(displayDetails)
    }
  }

  const handleAdd = async (id:string) => {
    if (purchaseOrder){
      for (const order of purchaseOrder){
        if (order.id === id){
          setId(order.id)
        }
      }
      setDisplayAdd(true)
    }
  }


  // function renderEntries() {
  //   return <>
  //     {displayEntries ? <CreateSaleEntries submitText='Create Sale Reconciliation'>
  //           <SalesRecCard date={date} cardType="entry" salesRecId={' '}></SalesRecCard>
  //     </CreateSaleEntries>: null}
  //   </>;
  // }

  function renderEdit() {
    return <>
      {(displayEdit && currOrder) ?
          <CreateEntries closeStateFunction={setDisplayEdit} submitText="Edit Purchase Order"> 
            <PurchasesCard date={currOrder.date} cardType="edit" purchaseOrderId={currOrder.id} vendorName={currOrder.vendorName}></PurchasesCard></CreateEntries> : null}
  </>;
  }

  function renderDelete() {
    return <>
      {displayDelete ? <CreateEntries closeStateFunction={setDelete} submitText='Delete Purchase Order'>
            <PurchasesCard date={currOrder.date} cardType="delete" purchaseOrderId={currOrder.id} vendorName={currOrder.vendorName}></PurchasesCard>
      </CreateEntries>: null}
  </>;
  }

  function renderDetails() {
    return <>
      {displayDetails ? (purchases ? (
          <CreateEntries closeStateFunction={setDisplayDetails} submitText="Show Purchase Details"> {purchases.map((purchase) => (
            <PurchaseDetailsCard cardType={'edit'} purchase={purchase}></PurchaseDetailsCard>))}</CreateEntries>) : null) : null}
  </>;
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
      {(displayAdd && purchaseOrderId)? 
          <CreateEntries closeStateFunction={setDisplayAdd} submitText="Add Sale"> 
            <PurchaseDetailsCard cardType={'entry'} purchase={dummyPurchase}></PurchaseDetailsCard></CreateEntries> : null}
  </>;
  }


  return (
      <div className="px-4 sm:px-6 lg:px-8">
        <TableDetails tableName="Purchase Orders"
                      tableDescription="A list of all the Purchase Orders and Purchases.">
          <AddPurchaseOrderModal showPurchaseOrderEdit={handleOrderSubmit} buttonText="Create Purchase Order"
                        submitText="Create Purchase Order" vendorList={vendors}></AddPurchaseOrderModal>
        </TableDetails>
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div
                  className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300 table-auto">
                  <TableHeader>
                    <SortedFilterableColumnHeading sortFields={setSortField} databaseLabel="id" 
                    label="Purchase Order ID" firstEntry={true}></SortedFilterableColumnHeading>
                    <SortedFilterableColumnHeading sortFields={setSortField} databaseLabel="date" 
                    label="Date Created"></SortedFilterableColumnHeading>
                    <SortedFilterableColumnHeading sortFields={setSortField} databaseLabel="vendorName" 
                    label="Vendor Name"></SortedFilterableColumnHeading>
                    <SortedFilterableColumnHeading  sortFields={setSortField} databaseLabel="uniqueBooks" 
                    label="Unique Books"></SortedFilterableColumnHeading>
                    <SortedFilterableColumnHeading sortFields={setSortField} databaseLabel="totalBooks" 
                    label="Total Books"></SortedFilterableColumnHeading>
                    <SortedFilterableColumnHeading sortFields={setSortField} databaseLabel="cost" 
                    label="Total Cost"></SortedFilterableColumnHeading>
                  </TableHeader>
                  <tbody className="divide-y divide-gray-200 bg-white">
                  {purchaseOrder ? purchaseOrder.map((order) => (
                      <PurchaseOrderTableRow onAdd={handleAdd} onView={handleView} onDelete={handleDelete} onEdit={handleEdit} purchaseOrderInfo={order}></PurchaseOrderTableRow>
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
          {renderEdit()}
          {renderDelete()}
          {renderDetails()}
          {renderAdd()}
        </div>
      </div>

  )
}
