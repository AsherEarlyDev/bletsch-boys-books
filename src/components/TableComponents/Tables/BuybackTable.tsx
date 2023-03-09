import {useState} from 'react';
import {api} from "../../../utils/api";
import TableDetails from "../TableDetails";
import CreateEntries from '../../CreateEntries';
import ViewPurchaseModal from '../Modals/PurchaseModals/ViewPurchaseModal';
import Table from './Table';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BuybackOrderTableRow from '../TableRows/BuybackOrderTableRow';
import EditBuybackTableModal from '../Modals/BuybackModals/EditBuybackTableModal';
import ViewBuybackTableModal from '../Modals/BuybackModals/ViewBuybackTableModal';
import AddPurchaseOrderModal from '../Modals/PurchaseModals/AddPurchaseOrderModal';
import DeleteBuybackOrderModal from '../Modals/BuybackModals/DeleteBuybackOrderModal';
import ViewBuybackModal from '../Modals/BuybackModals/ViewBuybackModal';
import {useSession} from "next-auth/react";

export default function BuybackTable() {
  const FIRST_HEADER = ["Date Created", "date"]
  const SORTABLE_HEADERS = [["Vendor Name", "vendorName"], ["Unique Books", "uniqueBooks"], ["Total Books", "totalBooks"], ["Total Revenue", "revenue"], ["Creator", "userName"]]
  const STATIC_HEADERS = ["Edit", "Delete"]
  const ENTRIES_PER_PAGE = 5
  const [buybacks, setBuybacks] = useState<any[]>([])
  const [buybackOrderId, setId] = useState('')
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
  const [displayAddBuybackView, setDisplayAddBuybackView] = useState(false)
  const [onlyEdit, setOnlyEdit] = useState(false)
  const [createData, setCreateData] = useState({
    date: '',
    vendorId: '',
    id: ''
  })
  const {data, status} = useSession();
  
  const createBuybackOrder = api.buybackOrder.createBuybackOrder.useMutation({
    onSuccess: ()=>{
      setDisplayEditBuybackView(true)
    },
    
  })
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
        <BuybackOrderTableRow onAdd={handleAdd} onView={openBuybackView}
                               onDelete={openDeleteBuybackView} onEdit={openEditBuybackView}
                               buybackOrderInfo={order}></BuybackOrderTableRow>
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
                             submitText="Edit Buybacl">
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
                <DeleteBuybackOrderModal closeOut={closeDeleteBuybackView}
                                          buybackId={currentOrder.id}></DeleteBuybackOrderModal>
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
                                        buybackVendorName={currentOrder.vendor.name}></ViewBuybackTableModal>
              </CreateEntries>) : null) : null}
        </>
    )
  }

  function closeBuybackView() {
    setDisplayBuybackView(false)
  }

  const handleAdd = async (id: string) => {
    if (buybackOrder) {
      for (const order of buybackOrder) {
        if (order.id === id) {
          setId(order.id)
        }
      }
      setDisplayAddBuybackView(true)
    }
  }

  function renderAdd() {
    const dummyBuyback = {
      id: '',
      buybackOrderId: buybackOrderId,
      buybackPrice: 0,
      quantity: 0,
      bookId: '',
      subtotal: 0
    }
    return <>
      {(displayAddBuybackView && buybackOrderId) ?
          <CreateEntries closeStateFunction={setDisplayAddBuybackView} submitText="Add Sale">
            <ViewBuybackModal cardType={'entry'} buyback={dummyBuyback}
                               closeOut={function (): void {
                                 throw new Error('Function not implemented.');
                               }}></ViewBuybackModal></CreateEntries> : null}
    </>;
  }


  return (
      <div className="px-4 sm:px-6 lg:px-8">
        <TableDetails tableName="Book Buybacks"
                      tableDescription="A list of all the Book Buybacks and their details.">
          <AddPurchaseOrderModal showPurchaseOrderEdit={handleBuybackSubmission}
                                 buttonText="Create Buyback"
                                 submitText="Create Buyback"
                                 vendorList={vendors}></AddPurchaseOrderModal>
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
          {renderAdd()}
          {renderEditBuybackView()}
          <ToastContainer/>
        </div>
      </div>

  )
}
