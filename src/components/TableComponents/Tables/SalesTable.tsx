import { useState } from 'react';
import { api } from "../../../utils/api";
import TableDetails from "../TableDetails";
import TableHeader from "../TableHeader";
import SalesRecTableRow from "../TableRows/SalesRecTableRow";
import EditSalesRecModal from "../Modals/SalesModals/EditSalesRecModal";
import CreateSaleEntries from '../../CreateEntries';
import SalesRecDeleteCard from '../../SalesComponents/SalesRecDeleteCard';
import SaleDetailsCard from '../../SalesComponents/SalesCard';
import AddSaleRecModal from "../Modals/SalesModals/AddSaleRecModal";
import GenSalesReportModal from '../../SalesComponents/SalesReportModal';
import SalesReport from '../../SalesComponents/SalesReport';
import SortedFilterableColumnHeading from '../SortedFilterableColumnHeading';



export default function SalesTable() {
  const ENTRIES_PER_PAGE = 5
  const [sales, setSales] = useState<any[]>([])
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
  const [displayDeleteSalesRecView, setDeleteSalesRecView] = useState(false)
  const [displayDetails, setDisplayDetails] = useState(false)
  const [displayAddSaleView, setDisplayAddSaleView] = useState(false)
  const [displaySalesReport, setSalesReport] = useState(false)
  const createSalesRec = api.salesRec.createSaleRec.useMutation()
  const salesRecs: any[] = api.salesRec.getSaleRecDetails.useQuery({pageNumber:pageNumber, entriesPerPage:ENTRIES_PER_PAGE, sortBy:sortField, descOrAsc:"desc"}).data
  const numberOfPages = Math.ceil(api.salesRec.getNumSalesRec.useQuery().data / ENTRIES_PER_PAGE)

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

  const handleDelete = async (id:string) => {
    if (salesRecs){
      for (const rec of salesRecs){
        if (rec.id === id){
          setCurrentSalesRec({
            id: rec.id,
            date: rec.date,
          })
        }
      }
      setDeleteSalesRecView(true)
    }
  }

  const handleView = async (id:string) => {
    if (salesRecs){
      for (const rec of salesRecs){
        if (rec.id === id){
          console.log(rec)
          setSales(rec.sales)
        }
      }
      setDisplayDetails(true)
    }
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

  const generateReport = async (startDate: string, endDate: string) =>{
    setEndDate(endDate)
    setStartDate(startDate)
    setSalesReport(true)
  }

  function renderDelete() {
    return <>
      {displayDeleteSalesRecView ? <CreateSaleEntries closeStateFunction={setDelete} submitText='Delete Sale Reconciliation'>
        <SalesRecDeleteCard cardType="delete" salesRecId={currentSalesRec.id}></SalesRecDeleteCard>
      </CreateSaleEntries>: null}
    </>;
  }

  function renderDetails() {
    return <>
      {displayDetails ? (sales ? (
          <CreateSaleEntries closeStateFunction={setDisplayDetails} submitText="Show Sales Details"> {sales.map((sale) => (
              <SaleDetailsCard cardType={'edit'} sale={sale}></SaleDetailsCard>))}</CreateSaleEntries>) : null) : null}
    </>;
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
            <SaleDetailsCard cardType={'entry'} sale={dummySale}></SaleDetailsCard></CreateSaleEntries> : null}
    </>;
  }

  function renderSalesReport(){
    return <>
      {displaySalesReport ? <SalesReport start={startDate} end={endDate}></SalesReport>: null}
    </>;
  }

  return (
      <div className="px-4 sm:px-6 lg:px-8">
        <TableDetails tableName="Sales Reconciliations"
                      tableDescription="A list of all the Sales Reconciliations and Sales.">
          <AddSaleRecModal showSaleRecEdit={handleSaleRecSubmission} buttonText="Create Sale Reconciliation"
                           submitText="Create Sale Reconciliation"></AddSaleRecModal>
          <GenSalesReportModal genSalesReport={generateReport} buttonText="Generate Sales Report"
                               submitText="Generate Sales Report"></GenSalesReportModal>
        </TableDetails>
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div
                  className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300 table-auto">
                  <TableHeader>
                    <SortedFilterableColumnHeading sortFields={setSortField} databaseLabel="id"
                                                   label="Sale Reconciliation ID" firstEntry={true}></SortedFilterableColumnHeading>
                    <SortedFilterableColumnHeading sortFields={setSortField} databaseLabel="date"
                                                   label="Date Created"></SortedFilterableColumnHeading>
                    <SortedFilterableColumnHeading sortFields={setSortField} databaseLabel="uniqueBooks"
                                                   label="Unique Books"></SortedFilterableColumnHeading>
                    <SortedFilterableColumnHeading sortFields={setSortField} databaseLabel="totalBooks"
                                                   label="Total Books"></SortedFilterableColumnHeading>
                    <SortedFilterableColumnHeading sortFields={setSortField} databaseLabel="revenue"
                                                   label="Total Revenue"></SortedFilterableColumnHeading>
                  </TableHeader>
                  <tbody className="divide-y divide-gray-200 bg-white">
                  {salesRecs ? salesRecs.map((rec) => (
                      <SalesRecTableRow onAdd={handleAdd} onView={handleView} onDelete={handleDelete} onEdit={openEditSalesRecView} salesRecInfo={rec}></SalesRecTableRow>
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
          {renderDelete()}
          {renderDetails()}
          {renderAdd()}
          {renderSalesReport()}
        </div>
      </div>

  )
}