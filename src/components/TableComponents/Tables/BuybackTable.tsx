import {useState} from 'react';
import {api} from "../../../utils/api";
import TableDetails from "../TableDetails";
import CreateEntries from '../../CreateEntries';
import Table from './Table';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditBuybackTableModal from '../Modals/BuybackModals/EditBuybackTableModal';
import {useSession} from "next-auth/react";
import AddOrderModal from '../Modals/ParentModals/AddOrderModal';
import OrderTableRow from '../TableRows/Parent/OrderTableRow';
import DeleteOrderModal from '../Modals/ParentModals/DeleteOrderModal';
import { useRouter } from 'next/router';
import ViewTableModal from '../Modals/ParentModals/ViewTableModal';

export default function BuybackTable() {
  const {query} = useRouter()
  const router = useRouter()
  const {data, status} = useSession()
  const isAdmin = (data?.user.role == "ADMIN" || data?.user.role == "SUPERADMIN")
  const FIRST_HEADER = ["Date Created", "date"]
  const SORTABLE_HEADERS = [["Vendor Name", "vendorName"], ["Unique Books", "uniqueBooks"], ["Total Books", "totalBooks"], ["Total Revenue", "revenue"], ["Creator", "userName"]]
  const STATIC_HEADERS = isAdmin ? ["Edit", "Delete"] : []
  const ENTRIES_PER_PAGE = 5
  const [buybacks, setBuybacks] = useState<any[]>([])
  const [currentOrder, setCurrentOrder] = useState({
    id: '',
    date: '',
    vendor: {id: '', name: '', bookBuybackPercentage: 0}
  })
  const [pageNumber, setPageNumber] = useState(0)
  const [sortField, setSortField] = useState("date")
  const [sortOrder, setSortOrder] = useState("asc")
  const buybackOrder: any[] = api.buybackOrder.getBuybackOrders.useQuery({
    pageNumber: pageNumber,
    entriesPerPage: ENTRIES_PER_PAGE,
    sortBy: sortField,
    descOrAsc: sortOrder
  }).data
  const numberOfEntries = api.buybackOrder.getNumBuybackOrder.useQuery().data
  const numberOfPages = Math.ceil(numberOfEntries / ENTRIES_PER_PAGE)
  const [displayEditBuybackView, setDisplayEditBuybackView] = useState(false)
  const [displayDeleteBuybackView, setDisplayDeleteBuybackView] = useState(false)
  const displayBuybackView = query.openView ? (query.openView==="true" ? true : false) : false
  const currentBuybackId = query.viewId ? query.viewId.toString() : ""
  const viewCurrentOrder = api.buybackOrder.getUniqueBuybackOrders.useQuery(currentBuybackId).data
  const viewCurrentBuybacks = viewCurrentOrder ? viewCurrentOrder.buybacks : undefined
  const [onlyEdit, setOnlyEdit] = useState(false)
  const [createData, setCreateData] = useState({
    date: '',
    vendorId: '',
    id: ''
  })
  
  const createBuybackOrder = api.buybackOrder.createBuybackOrder.useMutation({
    onSuccess: ()=>{
      setDisplayEditBuybackView(true)
    },
    
  })
  const deleteBuyback = api.buybackOrder.deleteBuybackOrder
  const vendors = api.vendor.getVendorsWithBuyback.useQuery().data
  


  

  async function handleBuybackSubmission(date: string, vendorId: string) {
    if (createBuybackOrder) {
        createBuybackOrder.mutate({
        date: date,
        vendorId: vendorId,
        userName: data?.user?.name
      })
    }
    
  }

  function renderOrderRow(items: any[]) {
    return (items ? items.map((order) => (
        <OrderTableRow type="Buyback" onView={openBuybackView} onDelete={openDeleteBuybackView} onEdit={openEditBuybackView} OrderInfo={order}></OrderTableRow>
    )) : null)
  }

  async function openEditBuybackView(id: string) {
    if (buybackOrder) {
      for (const order of buybackOrder) {
        if (order.id === id) {
          setCurrentOrder({
            id: order.id,
            date: order.date,
            vendor: order.vendor,
          })
        }
      }
      setOnlyEdit(true)
      setDisplayEditBuybackView(true)
    }
  }


  function renderEditBuybackView() {
    const value = onlyEdit ? currentOrder : createBuybackOrder.data
    return (
        <>
          {(displayEditBuybackView && value) ?
              <CreateEntries closeStateFunction={setDisplayEditBuybackView}
                             submitText="Edit Buyback">
                <EditBuybackTableModal closeOut={closeEditBuybackView}
                                        data={value}></EditBuybackTableModal></CreateEntries> : null}
        </>
    )
  }


  function closeEditBuybackView() {
    setDisplayEditBuybackView(false)
  }

  async function openDeleteBuybackView(id: string) {
    if (buybackOrder) {
      for (const order of buybackOrder) {
        if (order.id === id) {
          setCurrentOrder({
            id: order.id,
            date: order.date,
            vendor: order.vendor,
          })
        }
      }
      setDisplayDeleteBuybackView(true)
    }
  }

  function renderDeleteBuybackView() {
    
    return (
        <>
          {(displayDeleteBuybackView && currentOrder) ?
              <CreateEntries closeStateFunction={setDisplayDeleteBuybackView}
                             submitText='Delete Buyback'>
                <DeleteOrderModal closeOut={closeDeleteBuybackView}
                                          id={currentOrder.id} deleteMutation={deleteBuyback} type="Buyback"></DeleteOrderModal>
              </CreateEntries> : null}
        </>
    )
  }

  function closeDeleteBuybackView() {
    setDisplayDeleteBuybackView(false)
  }

  async function openBuybackView(id: string) {
    setDisplayBuybackView(true, id)
    if (buybackOrder) {
      for (const order of buybackOrder) {
        if (order.id === id) {
          setCurrentOrder({
            id: order.id,
            date: order.date,
            vendor: order.vendor,
          })
        }
      }
    }
  }
  function setDisplayBuybackView(view:boolean, id?: string) {
    view ? router.push({
      pathname:'/buybacks',
      query:{
        openView:"true",
        viewId: id
      }
    }, undefined, { shallow: true }) : 
    router.push({
      pathname:'/buybacks',
      
    }, undefined, { shallow: true })
  }

  function renderBuybackView() {
    return (
        <>
          {displayBuybackView ? (viewCurrentBuybacks ? (
              <CreateEntries closeStateFunction={setDisplayBuybackView}
                             submitText="Show Buyback Details">
                <ViewTableModal type="Buyback" closeOut={closeBuybackView}
                                        items={viewCurrentBuybacks}
                                        id={currentOrder.id}
                                        date={currentOrder.date}
                                        vendor={currentOrder.vendor}></ViewTableModal>
              </CreateEntries>) : null) : null}
        </>
    )
  }

  function closeBuybackView() {
    setDisplayBuybackView(false)
  }


  return (
      <div className="px-4 sm:px-6 lg:px-8">
        <TableDetails tableName="Book Buybacks"
                      tableDescription="A list of all the Book Buybacks and their details.">
          {isAdmin && <AddOrderModal showOrderEdit={handleBuybackSubmission} buttonText="Create Buyback" submitText="Create Buyback" vendorList={vendors}></AddOrderModal>}
        </TableDetails>
        <Table
            setPage={setPageNumber}
            sortableHeaders={SORTABLE_HEADERS}
            firstHeader={FIRST_HEADER}
            staticHeaders={STATIC_HEADERS}
            items={buybackOrder}
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
          {renderDeleteBuybackView()}
          {renderBuybackView()}
          {renderEditBuybackView()}
          <ToastContainer/>
        </div>
      </div>

  )
}
