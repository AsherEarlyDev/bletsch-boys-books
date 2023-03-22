import { useState } from 'react';
import { api } from "../../../utils/api";
import TableDetails from "../TableDetails";
import SalesRecTableRow from "../TableRows/SalesRecTableRow";
import EditSalesRecModal from "../Modals/SalesModals/Unused/EditSalesRecModal";
import CreateSaleEntries from '../../CreateEntries';
import ViewSalesRecModal from '../Modals/SalesModals/ViewSaleModal';
import AddSaleRecModal from "../Modals/SalesModals/AddSaleRecModal";
import GenSalesReportModal from '../../SalesComponents/SalesReportModal';
import { createSalesReportArray, generateSalesReportPDF } from '../../SalesComponents/SalesReport';
import DeleteSalesRecModal from "../Modals/SalesModals/DeleteSalesRecModal";
import Table from './Table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ViewSalesTableModal from "../Modals/SalesModals/ViewSalesTableModal";
import EditSalesTableModal from "../Modals/SalesModals/EditSalesTableModal";
<<<<<<< HEAD
import ViewTableModal from '../Modals/ParentModals/ViewTableModal';

=======
import { useRouter } from 'next/router'
>>>>>>> main

export default function SalesTable() {
  const {query} = useRouter()
  const router = useRouter()

  const date = new Date()
  const ENTRIES_PER_PAGE = 5
  const FIRST_HEADER =  ["Date Created", "date"]
  const SORTABLE_HEADERS = [["Unique Books", "uniqueBooks"], ["Total Books", "totalBooks"], ["Total Revenue", "revenue"]]
  const STATIC_HEADERS = ["Edit", "Delete"]
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
      setDisplayEditSalesRecView(true)
    }
  })
  const salesRecs: any[] = api.salesRec.getSalesRecs.useQuery({pageNumber:pageNumber, entriesPerPage:ENTRIES_PER_PAGE, sortBy:sortField, descOrAsc:sortOrder}).data
  const numberOfPages = Math.ceil(api.salesRec.getNumSalesRec.useQuery().data / ENTRIES_PER_PAGE)
  const revenueReport = api.salesReport.generateRevenueReport.useQuery({startDate: startDate, endDate: endDate}).data
  const costReport = api.salesReport.generateCostReport.useQuery({startDate: startDate, endDate: endDate}).data
  const buybackReport = api.salesReport.generateBuybacksReport.useQuery({startDate: startDate, endDate: endDate}).data
  const topSellers = api.salesReport.getTopSelling.useQuery({startDate: startDate, endDate: endDate}).data
  const numberOfEntries = api.salesRec.getNumberOfSalesRecs.useQuery().data

  const handleSaleRecSubmission = async (date: string) => {
    if (createSalesRec){
     const id = await createSalesRec.mutate({
        date: date
      })
    }

  }


  function renderSalesRow(items:any[]){
    return(salesRecs ? salesRecs.map((rec) => (
      <SalesRecTableRow onAdd={handleAdd} onView={openSalesRecView} onDelete={openDeleteSalesRecView} onEdit={openEditSalesRecView} salesRecInfo={rec}></SalesRecTableRow>
  )) : null)
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
              <CreateSaleEntries closeStateFunction={setDisplayEditSalesRecView} submitText="Delete Sale Rec">
                <DeleteSalesRecModal closeOut={closeDeleteSalesRecView} salesRecId={currentSalesRec.id}></DeleteSalesRecModal></CreateSaleEntries>
              : null}
        </>
    )
  }
  function closeDeleteSalesRecView(){
    setDisplayDeleteSalesRecView(false)
  }

  async function openSalesRecView(id: string){
    setDisplaySalesRecView(true, id)
  }
  function renderSalesRecView() {
    return(
        <>
          {(displaySalesRecView && viewCurrentSales) ?
              (<CreateSaleEntries closeStateFunction={setDisplaySalesRecView} submitText="Show Sales Details">
<<<<<<< HEAD
                <ViewTableModal type="Sale" closeOut={closeSalesRecView} items={ currentSales}
                                        id={currentSalesRec.id}
                                        date={currentSalesRec.date}
                                        vendor={null}></ViewTableModal>
=======
                <ViewSalesTableModal salesRecId={viewCurrentOrder.id} salesRecDate={viewCurrentOrder.date} sales={viewCurrentSales} closeOut={closeSalesRecView}></ViewSalesTableModal>
>>>>>>> main
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

  const handleAdd = async (id:string) => {
    if (salesRecs){
      for (const rec of salesRecs){
        if (rec.id === id){
          setId(rec.id)
        }
      }
      setDisplayAddSaleView(true)
    }
  }

  function generateReport (){
    const reportObj = createSalesReportArray(revenueReport, buybackReport, costReport, startDate, endDate)
    generateSalesReportPDF(reportObj.resultsArray, topSellers, reportObj.totalCost, reportObj.totalRev)
  }

  // function renderAdd() {
  //   const dummySale = {
  //     id: '',
  //     saleReconciliationId: saleRecId,
  //     price: 0,
  //     quantity: 0,
  //     bookId: '',
  //     subtotal: 0
  //   }

  //   return <>
  //     {(displayAddSaleView && saleRecId)?
  //         <CreateSaleEntries closeStateFunction={setDisplayAddSaleView} submitText="Add Sale">
  //           <ViewSalesRecModal cardType={'entry'} sale={dummySale}></ViewSalesRecModal></CreateSaleEntries>
  //            : null}
  //   </>;
  // }

  return (
      <div className="px-4 sm:px-6 lg:px-8">
        <TableDetails tableName="Sales Reconciliations"
                      tableDescription="A list of all the Sales Reconciliations and Sales.">
          <AddSaleRecModal showSaleRecEdit={handleSaleRecSubmission} buttonText="Create Sale Reconciliation"
                           submitText="Create Sale Reconciliation"></AddSaleRecModal>
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
        entriesPerPage={ENTRIES_PER_PAGE}></Table>
        <div>
          {renderEditSalesRecView()}
          {renderDeleteSalesRecView()}
          {renderSalesRecView()}
          {/* {renderAdd()} */}
          <ToastContainer/>
        </div>
      </div>

  )
}