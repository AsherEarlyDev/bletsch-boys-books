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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function SalesTable() {
  const date = new Date()
  const ENTRIES_PER_PAGE = 5
  const [currentSales, setCurrentSales] = useState<any[]>([])
  const [saleRecId, setId] = useState('')
  const [startDate, setStartDate] = useState(date.toString())
  const [endDate, setEndDate] = useState(date.toString())
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
  const salesRecs: any[] = api.salesRec.getSaleRecDetails.useQuery({pageNumber:pageNumber, entriesPerPage:ENTRIES_PER_PAGE, sortBy:sortField, descOrAsc:sortOrder}).data
  const numberOfPages = Math.ceil(api.salesRec.getNumSalesRec.useQuery().data / ENTRIES_PER_PAGE)
  const revenueReport = api.salesReport.generateRevenueReport.useQuery({startDate: startDate, endDate: endDate}).data
  const costReport = api.salesReport.generateCostReport.useQuery({startDate: startDate, endDate: endDate}).data
  const topSellers = api.salesReport.getTopSelling.useQuery({startDate: startDate, endDate: endDate}).data

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
            <ViewSalesRecModal cardType={'entry'} sale={dummySale}></ViewSalesRecModal></CreateSaleEntries>
             : null}
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
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div
                  className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300 table-auto">
                  <TableHeader>
                    <SortedFilterableColumnHeading resetPage={setPageNumber} setOrder={setSortOrder} currentOrder={sortOrder} currentField={sortField} sortFields={setSortField} databaseLabel="date"
                                                   label="Date Created" firstEntry={true}></SortedFilterableColumnHeading>
                    <SortedFilterableColumnHeading resetPage={setPageNumber} setOrder={setSortOrder} currentOrder={sortOrder} currentField={sortField} sortFields={setSortField} databaseLabel="uniqueBooks"
                                                   label="Unique Books"></SortedFilterableColumnHeading>
                    <SortedFilterableColumnHeading resetPage={setPageNumber} setOrder={setSortOrder} currentOrder={sortOrder} currentField={sortField} sortFields={setSortField} databaseLabel="totalBooks"
                                                   label="Total Books"></SortedFilterableColumnHeading>
                    <SortedFilterableColumnHeading resetPage={setPageNumber} setOrder={setSortOrder} currentOrder={sortOrder} currentField={sortField} sortFields={setSortField} databaseLabel="revenue"
                                                   label="Total Revenue"></SortedFilterableColumnHeading>
                  </TableHeader>
                  <tbody className="divide-y divide-gray-200 bg-white">
                  {salesRecs ? salesRecs.map((rec) => (
                      <SalesRecTableRow onAdd={handleAdd} onView={openSalesRecView} onDelete={openDeleteSalesRecView} onEdit={openEditSalesRecView} salesRecInfo={rec}></SalesRecTableRow>
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
          {renderEditSalesRecView()}
          {renderDeleteSalesRecView()}
          {renderSalesRecView()}
          {renderAdd()}
          <ToastContainer/>
        </div>
      </div>

  )
}