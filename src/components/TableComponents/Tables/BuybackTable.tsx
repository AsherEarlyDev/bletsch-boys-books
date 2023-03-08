import {useState} from 'react';
import {api} from "../../../utils/api";
import TableDetails from "../TableDetails";
import CreateEntries from '../../CreateEntries';
import Table from './Table';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditBuybackTableModal from '../Modals/BuybackModals/EditBuybackTableModal';
import ViewBuybackTableModal from '../Modals/BuybackModals/Unused/ViewBuybackTableModal';
import AddOrderModal from '../Modals/ParentModals/AddOrderModal';
import OrderTableRow from '../TableRows/Parent/OrderTableRow';
import DeleteOrderModal from '../Modals/ParentModals/DeleteOrderModal';

export default function BuybackTable() {
  const FIRST_HEADER = ["Date Created", "date"]
  const SORTABLE_HEADERS = [["Vendor Name", "vendorName"], ["Unique Books", "uniqueBooks"], ["Total Books", "totalBooks"], ["Total Revenue", "revenue"]]
  const STATIC_HEADERS = ["Edit", "Delete"]
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
  const [displayBuybackView, setDisplayBuybackView] = useState(false)
  const [onlyEdit, setOnlyEdit] = useState(false)
  
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
        vendorId: vendorId
      })
    }
    
  }

  function renderOrderRow(items: any[]) {
    return (items ? items.map((order) => (
        <OrderTableRow onView={openBuybackView}
                               onDelete={openDeleteBuybackView} onEdit={openEditBuybackView}
                               OrderInfo={order}></OrderTableRow>
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
    if (buybackOrder) {
      for (const order of buybackOrder) {
        if (order.id === id && order.buybacks) {
          setCurrentOrder({
            id: order.id,
            date: order.date,
            vendor: order.vendor,
          })
          setBuybacks(order.buybacks)
        }
      }
      setDisplayBuybackView(true)
    }
  }

  function renderBuybackView() {
    return (
        <>
          {displayBuybackView ? (buybacks ? (
              <CreateEntries closeStateFunction={setDisplayBuybackView}
                             submitText="Show Buyback Details">
                <ViewBuybackTableModal closeOut={closeBuybackView}
                                        buybacks={buybacks}
                                        buybackOrderId={currentOrder.id}
                                        buybackDate={currentOrder.date}
                                        buybackVendor={currentOrder.vendor}></ViewBuybackTableModal>
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
          <AddOrderModal showOrderEdit={handleBuybackSubmission}
                                 buttonText="Create Buyback"
                                 submitText="Create Buyback"
                                 vendorList={vendors}></AddOrderModal>
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
