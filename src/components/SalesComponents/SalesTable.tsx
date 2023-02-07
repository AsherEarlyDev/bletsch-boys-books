import { useState } from 'react';
import { api } from "../../utils/api";
import TableDetails from "../TableComponents/TableDetails";
import FilterableColumnHeading from "../TableComponents/FilterableColumnHeading";
import TableHeader from "../TableComponents/TableHeader";
import SalesRecTableRow from '../TableComponents/SalesRecTableRow';
import SalesRecCard from './SalesRecCard';
import CreateSaleEntries from './CreateSaleEntries';
import AddModal from './AddSaleRecModal';
import PrimaryButton from '../BasicComponents/PrimaryButton';
import SalesRecDeleteCard from './SalesRecDeleteCard';
import SaleDetailsCard from './SalesCard';
import AddSaleRecModal from './AddSaleRecModal';
import GenSalesReportModal from './SalesReportModal';
import SalesReport from './SalesReport';





export default function SalesTable() {
  const salesRecs = api.salesRec.getSaleRecDetails.useQuery().data;
  const [sales, setSales] = useState<any[]>([])
  const [saleRecId, setId] = useState('')
  const [date, setDate] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currRec, setCurrRec] = useState({
    id: '',
    date: '',
  })
  const [displayEntries, setDisplayEntries] = useState(false)
  const [displayEdit, setDisplayEdit] = useState(false)
  const [displayDelete, setDelete] = useState(false)
  const [displayDetails, setDisplayDetails] = useState(false)
  const [displayAdd, setDisplayAdd] = useState(false)
  const [displaySalesReport, setSalesReport] = useState(false)

  const handleSaleRecSubmit = async (date: string) => {
    setDate(date)
    setDisplayEntries(true)
  }

  const handleEdit = async (id:string) => {
    if (salesRecs){
      for (const rec of salesRecs){
        if (rec.id === id){
          setCurrRec({
            id: rec.id, 
            date: rec.date,
          })
        }
      }
      setDisplayEdit(true)
    }
    
  }

  const handleDelete = async (id:string) => {
    if (salesRecs){
      for (const rec of salesRecs){
        if (rec.id === id){
          setCurrRec({
            id: rec.id, 
            date: rec.date,
          })
        }
      }
      setDelete(true)
    }
  }

  const handleView = async (id:string) => {
    if (salesRecs){
      for (const rec of salesRecs){
        if (rec.id === id){
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
      setDisplayAdd(true)
    }
  }

  const generateReport = async (startDate: string, endDate: string) =>{
      setEndDate(endDate)
      setStartDate(startDate)
      setSalesReport(true)
  }

  function renderEntries() {
    return <>
      {displayEntries ? <CreateSaleEntries submitText='Create Sale Reconciliation'>
            <SalesRecCard date={date} cardType="entry" salesRecId={' '}></SalesRecCard>
      </CreateSaleEntries>: null}
    </>;
  }

  function renderEdit() {
    return <>
      {(displayEdit && currRec) ?
          <CreateSaleEntries submitText="Edit Sale Rec"> 
            <SalesRecCard date={currRec.date} cardType="edit" salesRecId={currRec.id}></SalesRecCard></CreateSaleEntries> : null}
  </>;
  }

  function renderDelete() {
    return <>
      {displayDelete ? <CreateSaleEntries submitText='Delete Sale Reconciliation'>
            <SalesRecDeleteCard cardType="delete" salesRecId={currRec.id}></SalesRecDeleteCard>
      </CreateSaleEntries>: null}
  </>;
  }

  function renderDetails() {
    return <>
      {displayDetails ? (sales ? (
          <CreateSaleEntries submitText="Show Sales Details"> {sales.map((sale) => (
            <SaleDetailsCard cardType={'edit'} saleComplete={sale}></SaleDetailsCard>))}</CreateSaleEntries>) : null) : null}
  </>;
  }

  function renderAdd() {
    const dummySale = {
      sale: {
        id: '',
        saleReconciliationId: saleRecId,
        price: 0,
        quantity: 0,
        bookId: ''
      },
      subtotal: 0
    }
    return <>
      {(displayAdd && saleRecId)? 
          <CreateSaleEntries submitText="Add Sale"> 
            <SaleDetailsCard cardType={'entry'} saleComplete={dummySale}></SaleDetailsCard></CreateSaleEntries> : null}
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
                    <FilterableColumnHeading label="Sale Reconciliation ID"
                                             firstEntry={true}></FilterableColumnHeading>
                    <FilterableColumnHeading label="Date Created"></FilterableColumnHeading>
                    <FilterableColumnHeading label="Unique Books"></FilterableColumnHeading>
                    <FilterableColumnHeading label="Total Books"></FilterableColumnHeading>
                    <FilterableColumnHeading label="Total Revenue"></FilterableColumnHeading>
                  </TableHeader>
                  <tbody className="divide-y divide-gray-200 bg-white">
                  {salesRecs ? salesRecs.map((rec) => (
                      <SalesRecTableRow onAdd={handleAdd} onView={handleView} onDelete={handleDelete} onEdit={handleEdit} salesRecInfo={rec}></SalesRecTableRow>
                  )) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div>
          {renderEntries()}
          {renderEdit()}
          {renderDelete()}
          {renderDetails()}
          {renderAdd()}
          {renderSalesReport()}
        </div>
      </div>

  )
}
