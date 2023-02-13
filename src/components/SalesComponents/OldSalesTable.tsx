import { useState } from 'react';
import { api } from "../../utils/api";
import TableDetails from "../TableComponents/TableDetails";
import TableHeader from "../TableComponents/TableHeader";
import SalesRecTableRow from '../TableComponents/TableRows/SalesRecTableRow';
import EditSalesRecModal from '../TableComponents/Modals/SalesModals/EditSalesRecModal';
import CreateSaleEntries from '../CreateEntries';
import ViewSalesRecModal from '../TableComponents/Modals/SalesModals/ViewSalesRecModal';
import AddSaleRecModal from '../TableComponents/Modals/SalesModals/AddSaleRecModal';
import GenSalesReportModal from './SalesReportModal';
import SalesReport from './SalesReport';
import SortedFilterableColumnHeading from '../TableComponents/SortedFilterableColumnHeading';
import CreateEntries from "../CreateEntries";
import DeleteSalesRecModal from "../TableComponents/Modals/SalesModals/DeleteSalesRecModal";





export default function OldSalesTable() {
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
  const salesRecs: any[] = api.salesRec.getSaleRecDetails.useQuery({pageNumber:pageNumber, entriesPerPage:ENTRIES_PER_PAGE, sortBy:sortField, descOrAsc:"desc"}).data
  const numberOfPages = Math.ceil(api.salesRec.getNumSalesRec.useQuery().data / ENTRIES_PER_PAGE)
  const [displaySalesRecEditView, setDisplaySalesRecEditView] = useState(false)
  const [displayDeleteSalesRecView, setDisplayDeleteSalesRecView] = useState(false)
  const [displaySalesRecDetailsView, setDisplaySalesRecDetailsView] = useState(false)
  const [displaySaleAddView, setDisplaySaleAddView] = useState(false)
  const [displaySalesReportView, setDisplaySalesReportView] = useState(false)
  const createSalesRec = api.salesRec.createSaleRec.useMutation()

  const handleSaleRecSubmit = async (date: string) => {
    if (createSalesRec){
      createSalesRec.mutate({
        date: date
      })
    }
  }

  const openEditSalesRecView = async (id:string) => {
    if (salesRecs){
      for (const rec of salesRecs){
        if (rec.id === id){
          setCurrentSalesRec({
            id: rec.id, 
            date: rec.date,
          })
        }
      }
      setDisplaySalesRecEditView(true)
    }
    
  }

  const openDeleteSalesRecView = async (id:string) => {
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

  const openSalesRecDetailsView = async (id:string) => {
    if (salesRecs){
      for (const rec of salesRecs){
        if (rec.id === id){
          setSales(rec.sales)
        }
      }
      setDisplaySalesRecDetailsView(true)
    }
  }

  const openAddSaleView = async (id:string) => {
    if (salesRecs){
      for (const rec of salesRecs){
        if (rec.id === id){
          setId(rec.id)
        }
      }
      setDisplaySaleAddView(true)
    }
  }

  const generateReport = async (startDate: string, endDate: string) =>{
      setEndDate(endDate)
      setStartDate(startDate)
      setDisplaySalesReportView(true)
  }

  // function renderEntries() {
  //   return <>
  //     {displayEntries ? <CreateSaleEntries submitText='Create Sale Reconciliation'>
  //           <EditSalesRecModal date={date} cardType="entry" salesRecId={' '}></EditSalesRecModal>
  //     </CreateSaleEntries>: null}
  //   </>;
  // }

  function closeSalesRecEditView(){
    setDisplaySalesRecEditView(false)
  }

  function renderEdit() {
    return <>
      {(displaySalesRecEditView && currentSalesRec) ?
          <CreateSaleEntries closeStateFunction={setDisplaySalesRecEditView} submitText="Edit Sale Rec">
            <EditSalesRecModal closeOut={closeSalesRecEditView} date={currentSalesRec.date} salesRecId={currentSalesRec.id}></EditSalesRecModal></CreateSaleEntries> : null}
  </>;
  }

  function renderDeleteSalesRecView() {
    return <>
      {(displayDeleteSalesRecView) ?
          <CreateEntries closeStateFunction={setDisplayDeleteSalesRecView} submitText="Delete Sales Reconciliation">
            <DeleteSalesRecModal closeOut={closeDeleteSalesRecView} salesRecId={currentSalesRec.id} ></DeleteSalesRecModal></CreateEntries> : null}
    </>;
  }

  function closeDeleteSalesRecView(){
    setDisplayDeleteSalesRecView(false)
  }

  function renderDetails() {
    return <>
      {displaySalesRecDetailsView ? (sales ? (
          <CreateSaleEntries closeStateFunction={setDisplaySalesRecDetailsView} submitText="Show Sales Details"> {sales.map((sale) => (
            <ViewSalesRecModal cardType={'edit'} sale={sale}></ViewSalesRecModal>))}</CreateSaleEntries>) : null) : null}
  </>;
  }

  function renderAddSale() {
    const dummySale = {
        id: '',
        saleReconciliationId: saleRecId,
        price: 0,
        quantity: 0,
        bookId: '',
        subtotal: 0
      }
      
    
    return <>
      {(displaySaleAddView && saleRecId) ?
          <CreateSaleEntries closeStateFunction={setDisplaySaleAddView} submitText="Add Sale">
            <ViewSalesRecModal cardType={'entry'} sale={dummySale}></ViewSalesRecModal></CreateSaleEntries> : null}
  </>;
  }

  function renderSalesReport(){
    return <>
      {displaySalesReportView ? <SalesReport start={startDate} end={endDate}></SalesReport>: null}
  </>;
  }

  return (
      <div className="px-4 sm:px-6 lg:px-8">
        <TableDetails tableName="Sales Reconciliations"
                      tableDescription="A list of all the Sales Reconciliations and Sales.">
          <AddSaleRecModal showSaleRecEdit={handleSaleRecSubmit} buttonText="Create Sale Reconciliation"
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
                      <SalesRecTableRow onAdd={openAddSaleView} onView={openSalesRecDetailsView} onDelete={openDeleteSalesRecView} onEdit={openEditSalesRecView} salesRecInfo={rec}></SalesRecTableRow>
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
          {renderDeleteSalesRecView()}
          {renderDetails()}
          {renderAddSale()}
          {renderSalesReport()}
        </div>
      </div>

  )
}
