import { useState } from 'react';
import { api } from "../../../utils/api";
import TableDetails from "../TableDetails";
import TableHeader from "../TableHeader";
import SalesRecTableRow from "../TableRows/SalesRecTableRow";
import EditSalesRecModal from "../Modals/SalesModals/EditSalesRecModal";
import CreateSaleEntries from '../../CreateEntries';
import ViewSalesRecModal from '../Modals/SalesModals/ViewSalesRecModal';
import AddSaleRecModal from "../Modals/SalesModals/AddSaleRecModal";
import GenSalesReportModal from '../../SalesComponents/SalesReportModal';
import SortedFilterableColumnHeading from "../TableColumnHeadings/SortedFilterableColumnHeading";
import { createSalesReportArray, generateSalesReportPDF } from '../../SalesComponents/SalesReport';
import DeleteSalesRecModal from "../Modals/SalesModals/DeleteSalesRecModal";
import Table from './Table';



export default function SalesTable() {
  const ENTRIES_PER_PAGE = 5
  const FIRST_HEADER =  ["Sales Reconciliation Id", "id"]
  const SORTABLE_HEADERS = [["Date Created", "date"], ["Unique Books", "uniqueBooks"], ["Total Books", "totalBooks"], ["Total Revenue", "revenue"]]
  const STATIC_HEADERS = ["Add Sale", "Edit", "Delete"]
  const [currentSales, setCurrentSales] = useState<any[]>([])
  const [saleRecId, setId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currentSalesRec, setCurrentSalesRec] = useState({
    id: '',
    date: '',
  })
  const [pageNumber, setPageNumber] = useState(0)
  const [sortField, setSortField] = useState("id")
  const [displayEditSalesRecView, setDisplayEditSalesRecView] = useState(false)
  const [displayDeleteSalesRecView, setDisplayDeleteSalesRecView] = useState(false)
  const [displaySalesRecView, setDisplaySalesRecView] = useState(false)
  const [displayAddSaleView, setDisplayAddSaleView] = useState(false)
  const [displaySalesReport, setSalesReport] = useState(false)
  const [sortOrder, setSortOrder] = useState('asc')
  const createSalesRec = api.salesRec.createSaleRec.useMutation()

  //const salesRecs: any[] = api.salesRec.getSaleRecDetails.useQuery({pageNumber:pageNumber, entriesPerPage:ENTRIES_PER_PAGE, sortBy:sortField, descOrAsc:sortOrder}).data
  const salesRecs: any[] = api.salesRec.getSalesRecs.useQuery({pageNumber:pageNumber, entriesPerPage:ENTRIES_PER_PAGE, sortBy:sortField, descOrAsc:sortOrder}).data
  const numberOfPages = Math.ceil(api.salesRec.getNumSalesRec.useQuery().data / ENTRIES_PER_PAGE)
  const revenueReport = api.salesReport.generateRevenueReport.useQuery({startDate: startDate, endDate: endDate}).data
  const costReport = api.salesReport.generateCostReport.useQuery({startDate: startDate, endDate: endDate}).data
  const topSellers = api.salesReport.getTopSelling.useQuery({startDate: startDate, endDate: endDate}).data
  const numberOfEntries = api.salesRec.getNumberOfSalesRecs.useQuery().data

  const handleSaleRecSubmission = async (date: string) => {
    if (createSalesRec){
      createSalesRec.mutate({
        date: date
      })
    }
  }


  async function openEditSalesRecView(id: string){
    if (salesRecs){
      for (const rec of salesRecs){
        if (rec.id === id){
          setCurrentSalesRec({
            id: rec.id,
            date: rec.date,
          })
        }
      }
      setDisplayEditSalesRecView(true)
    }
  }

  function renderSalesRow(items:any[]){
    return(salesRecs ? salesRecs.map((rec) => (
      <SalesRecTableRow onAdd={handleAdd} onView={openSalesRecView} onDelete={openDeleteSalesRecView} onEdit={openEditSalesRecView} salesRecInfo={rec}></SalesRecTableRow>
  )) : null)
  }

  function renderEditSalesRecView() {
    return(
        <>
          {(displayEditSalesRecView && currentSalesRec) ?
              <CreateSaleEntries closeStateFunction={setDisplayEditSalesRecView} submitText="Edit Sale Rec">
                <EditSalesRecModal closeOut={closeEditSalesRecView} date={currentSalesRec.date} salesRecId={currentSalesRec.id}></EditSalesRecModal></CreateSaleEntries>
              : null}
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
              <CreateSaleEntries closeStateFunction={setDisplayEditSalesRecView} submitText="Edit Sale Rec">
                <DeleteSalesRecModal closeOut={closeDeleteSalesRecView} salesRecId={currentSalesRec.id}></DeleteSalesRecModal></CreateSaleEntries>
              : null}
        </>
    )
  }
  function closeDeleteSalesRecView(){
    setDisplayDeleteSalesRecView(false)
  }

  async function openSalesRecView(id: string){
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
      setDisplaySalesRecView(true)
    }
  }
  function renderSalesRecView() {
    return(
        <>
          {(displaySalesRecView && currentSalesRec) ?
              (<CreateSaleEntries closeStateFunction={setDisplaySalesRecView} submitText="Show Sales Details"> {currentSales.map((sale) => (
                      <ViewSalesRecModal closeOut={closeSalesRecView} cardType={'edit'} sale={sale}></ViewSalesRecModal>))}
              </CreateSaleEntries>)
              : null}
        </>
    )
  }
  function closeSalesRecView(){
    setDisplayDeleteSalesRecView(false)
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
    const reportObj = createSalesReportArray(revenueReport, costReport, startDate, endDate)
    generateSalesReportPDF(reportObj.resultsArray, topSellers, reportObj.totalCost, reportObj.totalRev)
  }

  function renderAdd() {
    const dummySale = {
      id: '',
      saleReconciliationId: saleRecId,
      price: 0,
      quantity: 0,
      bookId: '',
      subtotal: 0
    }

    return <>
      {(displayAddSaleView && saleRecId)?
          <CreateSaleEntries closeStateFunction={setDisplayAddSaleView} submitText="Add Sale">
            <ViewSalesRecModal cardType={'entry'} sale={dummySale}></ViewSalesRecModal></CreateSaleEntries> : null}
    </>;
  }

  // function renderSalesReport(){
  //   return <>
  //     {displaySalesReport ? <SalesReport start={startDate} end={endDate}></SalesReport>: null}
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
          {/* {renderEntries()} */}
          {renderEditSalesRecView()}
          {renderDeleteSalesRecView()}
          {renderSalesRecView()}
          {renderAdd()}
        </div>
      </div>

  )
}