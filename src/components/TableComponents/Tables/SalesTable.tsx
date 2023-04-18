import { useState } from 'react';
import { api } from "../../../utils/api";
import TableDetails from "../TableDetails";
import CreateSaleEntries from '../../CreateEntries';
import GenSalesReportModal from '../../SalesComponents/SalesReportModal';
import { createSalesReportArray, generateSalesReportPDF } from '../../SalesComponents/SalesReport';
import Table from './Table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditSalesTableModal from "../Modals/SalesModals/EditSalesTableModal";
import ViewTableModal from '../Modals/ParentModals/ViewTableModal';
import { useRouter } from 'next/router'
import OrderTableRow from '../TableRows/Parent/OrderTableRow';
import DeleteOrderModal from '../Modals/ParentModals/DeleteOrderModal';
import {useSession} from "next-auth/react";
import AddOrderModal from '../Modals/ParentModals/AddOrderModal';

export default function SalesTable() {
  const {query} = useRouter()
  const router = useRouter()
  const {data, status} = useSession()
  const isAdmin = (data?.user.role == "ADMIN" || data?.user.role == "SUPERADMIN")
  const date = new Date()
  const [entriesPerPage, setEntries] = useState(10)
  const FIRST_HEADER =  ["Date Created", "date"]
  const SORTABLE_HEADERS = [["Sale Type", "editable"], ["Unique Books", "uniqueBooks"], ["Total Books", "totalBooks"], ["Total Revenue", "revenue"], ["Creator", "userName"]]
  const STATIC_HEADERS = isAdmin ? ["Edit","Delete"] : []
  const [currentSales, setCurrentSales] = useState<any[]>([])
  const [saleRecId, setId] = useState('')
  const [startDate, setStartDate] = useState(date.toDateString())
  const [endDate, setEndDate] = useState(date.toDateString())
  const [currentSalesRec, setCurrentSalesRec] = useState({
    id: '',
    date: '',
  })
  const [onlyEdit, setOnlyEdit] = useState(false)
  const [pageNumber, setPageNumber] = useState(0)
  const [sortField, setSortField] = useState("id")
  const [displayEditSalesRecView, setDisplayEditSalesRecView] = useState(false)
  const [displayDeleteSalesRecView, setDisplayDeleteSalesRecView] = useState(false)
  const displaySalesRecView = query.openView ? (query.openView==="true" ? true : false) : false
  const currentSalesRecId = query.viewId ? query.viewId.toString() : ""
  const viewCurrentOrder = api.salesRec.getUniqueSalesRecs.useQuery(currentSalesRecId).data
  const viewCurrentSales = viewCurrentOrder ? viewCurrentOrder.sales : undefined
  const [displayAddSaleView, setDisplayAddSaleView] = useState(false)
  const [displaySalesReport, setSalesReport] = useState(false)
  const [sortOrder, setSortOrder] = useState('asc')
  const createSalesRec = api.salesRec.createSaleRec.useMutation({
    onSuccess: ()=>{
      setOnlyEdit(false)
      setDisplayEditSalesRecView(true)
    }
  })
  const salesRecs: any[] = api.salesRec.getSalesRecs.useQuery({pageNumber:pageNumber, entriesPerPage:entriesPerPage, sortBy:sortField, descOrAsc:sortOrder}).data
  const numberOfPages = Math.ceil(api.salesRec.getNumSalesRec.useQuery().data / entriesPerPage)
  const revenueReport = api.salesReport.generateRevenueReport.useQuery({startDate: startDate, endDate: endDate}).data
  const costReport = api.salesReport.generateCostReport.useQuery({startDate: startDate, endDate: endDate}).data
  const buybackReport = api.salesReport.generateBuybacksReport.useQuery({startDate: startDate, endDate: endDate}).data
  const topSellers = api.salesReport.getTopSelling.useQuery({startDate: startDate, endDate: endDate}).data
  const numberOfEntries = api.salesRec.getNumberOfSalesRecs.useQuery().data
  const deleteSalesRec = api.salesRec.deleteSaleRec

  const handleSaleRecSubmission = async (date: string) => {
    if (createSalesRec){
     const id = await createSalesRec.mutate({
        date: date,
        userName: data?.user?.name
      })
    }

  }


  function renderSalesRow(items:any[]){
    return(salesRecs ? salesRecs.map((rec) => ( rec.editable ?
      <OrderTableRow type="Sale" onEdit={openEditSalesRecView} onView={openSalesRecView} onDelete={openDeleteSalesRecView} OrderInfo={rec} saleType="Sale Reconciliation"></OrderTableRow>
  : <OrderTableRow type="Sale" onEdit={null} onView={openSalesRecView} onDelete={openDeleteSalesRecView} OrderInfo={rec} saleType="Sale Record"></OrderTableRow>)) : null)
  }

  async function openEditSalesRecView(id: string){
    
    if (salesRecs){
      for (const rec of salesRecs){
        if (rec.id === id){
          setCurrentSalesRec({
            id: rec.id,
            date: rec.date,
          })
          setCurrentSales(rec.sales)
        }
      }
      setOnlyEdit(true)
      setDisplayEditSalesRecView(true)
    }
  }
  function renderEditSalesRecView() {
    const value = onlyEdit ? currentSalesRec : createSalesRec.data
    return(
        <>
          {(displayEditSalesRecView && value) ?
              (<CreateSaleEntries closeStateFunction={setDisplayEditSalesRecView} submitText="Edit Sales Reconciliation">
                <EditSalesTableModal salesRecId={value.id} salesRecDate={value.date} closeOut={closeEditSalesRecView}></EditSalesTableModal>
              </CreateSaleEntries>)
              : ()=>{
                toast.warning("LOADING...")
              }}
        </>
    )
  }
  function closeEditSalesRecView(){
    setDisplayEditSalesRecView(false)
  }

  async function openDeleteSalesRecView(id: string){
    if (salesRecs){
      for (const rec of salesRecs){
        if (rec.id === id){
          setCurrentSalesRec({
            id: rec.id,
            date: rec.date,
          })
        }
      }
      setDisplayDeleteSalesRecView(true)
    }
  }
  function renderDeleteSalesRecView() {
    return(
        <>
          {(displayDeleteSalesRecView && currentSalesRec) ?
              <CreateSaleEntries closeStateFunction={setDisplayEditSalesRecView} submitText="Delete Sales Record">
                <DeleteOrderModal closeOut={closeDeleteSalesRecView}
                                          id={currentSalesRec.id} type="Sales Record" deleteMutation={deleteSalesRec}></DeleteOrderModal></CreateSaleEntries>
              : null}
        </>
    )
  }
  function closeDeleteSalesRecView(){
    setDisplayDeleteSalesRecView(false)
  }

  async function openSalesRecView(id: string){
    setDisplaySalesRecView(true, id)
    if (salesRecs){
      for (const rec of salesRecs){
        if (rec.id === id){
          setCurrentSalesRec({
            id: rec.id,
            date: rec.date,
          })
        }
      }
    }
  }
  function renderSalesRecView() {
    return(
        <>
          {(displaySalesRecView && viewCurrentSales) ?
              (<CreateSaleEntries closeStateFunction={setDisplaySalesRecView} submitText="Show Sales Details">
                <ViewTableModal type="Sales Record" closeOut={closeSalesRecView} items={ viewCurrentSales }
                                        id={currentSalesRec.id}
                                        date={currentSalesRec.date}
                                        vendor={null}></ViewTableModal>
              </CreateSaleEntries>)
              : null}
        </>
    )
  }
  function setDisplaySalesRecView(view:boolean, id?: string) {
    view ? router.push({
      pathname:'/sales',
      query:{
        openView:"true",
        viewId: id
      }
    }, undefined, { shallow: true }) : 
    router.push({
      pathname:'/sales',
      
    }, undefined, { shallow: true })
  }
  function closeSalesRecView(){
    setDisplaySalesRecView(false)
  }

  function generateReport (){
    const reportObj = createSalesReportArray(revenueReport, buybackReport, costReport, startDate, endDate)
    generateSalesReportPDF(reportObj.resultsArray, topSellers, reportObj.totalCost, reportObj.totalRev)
  }


  return (
      <div className="px-4 sm:px-6 lg:px-8">
        <TableDetails tableName="Sales" tableDescription="A list of all the Sales Records and Sales Reconciliations.">
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
          {isAdmin && <AddOrderModal showOrderEdit={handleSaleRecSubmission} buttonText="Create Sale Reconciliation" submitText="Create Sale Reconciliation"></AddOrderModal>}
          <GenSalesReportModal generateReport={generateReport} startDate={setStartDate} endDate={setEndDate} buttonText="Generate Sales Report"
                               submitText="Generate Sales Report"></GenSalesReportModal>
        </TableDetails>
        <Table 
        setPage={setPageNumber}
        sortableHeaders={SORTABLE_HEADERS}
        firstHeader={FIRST_HEADER}
        staticHeaders={STATIC_HEADERS}
        items={salesRecs}
        pageNumber={pageNumber}
        numberOfPages={numberOfPages}
        numberOfEntries={numberOfEntries}
        renderRow={renderSalesRow}
        sorting={{ setOrder: setSortOrder, setField: setSortField, currentOrder: sortOrder, currentField: sortField }} 
        entriesPerPage={entriesPerPage}></Table>
        <div>
          {renderEditSalesRecView()}
          {renderDeleteSalesRecView()}
          {renderSalesRecView()}
          <ToastContainer/>
        </div>
      </div>

  )
}