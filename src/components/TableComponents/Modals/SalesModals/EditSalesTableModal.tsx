import TableDetails from "../../TableDetails";
import { editableBook } from '../../../../types/bookTypes';
import NewBookEntryTableRow from "../../TableRows/NewBookEntryTableRow";
import TableHeader from "../../TableHeader";
import ColumnHeading from "../../TableColumnHeadings/ColumnHeading";
import React, {useState} from "react";
import SaveCardChanges from "../../../CardComponents/SaveCardChanges";
import {api} from "../../../../utils/api";
import SecondaryButton from "../../../BasicComponents/SecondaryButton";
import PrimaryButton from "../../../BasicComponents/PrimaryButton";
import {Sale} from "../../../../types/salesTypes";
import ViewSalesRecModal from "./ViewSaleModal";
import SaleTableRow from "../../TableRows/SaleTableRow";
import MutableCardProp from "../../../CardComponents/MutableCardProp";
import CreateSaleEntries from "../../../CreateEntries";
import ConfirmCard from "../../../CardComponents/ConfirmationCard";
import {toast} from "react-toastify";
import {PlusIcon} from "@heroicons/react/24/solid";
import Papa from "papaparse";

interface EditSalesTableModalProps{
  salesRecId: string
  salesRecDate: string
  closeOut: () => void
}

export default function EditSalesTableModal(props: EditSalesTableModalProps) {
  const [date, setDate] = useState(props.salesRecDate)
  const [addSaleRowView, setAddSaleRowView] = useState(false)
  const [displayConfirmationView, setDisplayConfirmationView] = useState(false)
  const header = date + " Sales Reconciliation"
  const [saleCSV, setSaleCSV] = useState<any[]>()
  const modifySaleRec = api.salesRec.modifySaleRec.useMutation({
    onError: (error)=>{
      toast.error(error.message)
    },
    onSuccess: ()=>{
      toast.success("Successfully modified sale!")
    }
  })
  const addSale = api.sales.createSale.useMutation({
    onError: (error)=>{
      toast.error(error.message)
    },
    onSuccess: ()=>{
      toast.success("Successfully added sale!")
    }
  })
  const sales: Sale[] = api.sales.getSalesByRecId.useQuery({saleRecId: props.salesRecId}).data


  function openConfirmationView(){
    setDisplayConfirmationView(true)
  }
  function renderConfirmationView(){
    return <>
      {(displayConfirmationView) ?
          <CreateSaleEntries closeStateFunction={setDisplayConfirmationView} submitText="Confirm">
            <ConfirmCard onClose={closeConfirmationView} onConfirm={handleEditSubmission} confirmHeading="Are You Sure You Want To Edit This Sales Reconciliation..."
                         confirmMessage="The current sales reconciliation information will be updated."></ConfirmCard></CreateSaleEntries> : null}
    </>;
  }
  function closeConfirmationView(){
    setDisplayConfirmationView(false)
  }
  function handleEditSubmission(){
    setDisplayConfirmationView(false)
    if(props.salesRecId && props.salesRecDate){
      modifySaleRec.mutate({
        date: date,
        saleRecId: props.salesRecId
      })
      props.closeOut()
    }
    else{
      toast.error("Date Input Details Undefined!")
    }
  }

  async function handleCSV(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const csvVal = (formData.get("saleCSV"))
    Papa.parse(csvVal, {
      header:true,
      complete: function(results) {
        const csv = results.data.map((result) => transformCSV(result))
        setSaleCSV(csv);
      }
  })}

  function transformCSV(csv){
    const quant = parseInt(csv.quantity)
    const price = parseFloat(csv.unit_retail_price.replaceAll('$', ''))
    return ({
      bookId:(csv.isbn).replaceAll('-', ''),
      quantity:quant,
      price: price,
      subtotal: quant* price,
    })
  }

  function renderCSVRows(){
    
    return saleCSV ? saleCSV?.map((sale) => (<SaleTableRow saveAdd={handleAddSale} closeAdd={removeCSVRow} isView={false} isAdding={true} isCSV={true} sale={sale}></SaleTableRow>)) : null
  }
  
  function removeCSVRow(isbn:string){
    setSaleCSV(saleCSV.filter((value) => value.bookId !== isbn))
  }

  function openAddSaleRow(){
    setAddSaleRowView(true)
  }
  function renderAddSaleRow(){
    const dummySale = {
      id: '',
      saleReconciliationId: props.salesRecId,
      price: 0,
      quantity: 0,
      bookId: '',
      subtotal: 0
    }
    return (addSaleRowView && (<SaleTableRow isView={false} saveAdd={handleAddSale} closeAdd={closeAddSaleRow} isAdding={true} sale={dummySale}></SaleTableRow>));
  }
  function closeAddSaleRow(){
    setAddSaleRowView(false)
  }
  function handleAddSale(isbn: string, quantity: number, price: number){
    if(isbn && quantity){
      addSale.mutate({
        saleReconciliationId: props.salesRecId,
        isbn: isbn,
        quantity: quantity.toString(),
        price: price.toString()
      })
      closeAddSaleRow()
    }
    else{
      toast.error("Cannot add sale. IDK WHY")
    }
  }

  return (
      <div className="px-4 sm:px-6 lg:px-8 rounded-lg shadow-lg py-8 bg-white">
        <div className="mb-8">
          <TableDetails tableName={header} tableDescription={"Viewing sales reconciliation with ID: " + props.salesRecId}>
          </TableDetails>
          <div className="pt-4">
            <MutableCardProp saveValue={setDate} heading="Change Date" required="True" dataType="date" defaultValue={date}></MutableCardProp>
          </div>
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300 table-auto">
                    <TableHeader>
                      <ColumnHeading firstEntry={true} label="Title"></ColumnHeading>
                      <ColumnHeading label="Sale Price"></ColumnHeading>
                      <ColumnHeading label="Quantity Sold"></ColumnHeading>
                      <ColumnHeading label="Subtotal"></ColumnHeading>
                      <ColumnHeading label="Edit/Save"></ColumnHeading>
                      <ColumnHeading label="Delete"></ColumnHeading>
                    </TableHeader>
                    <tbody className="divide-y divide-gray-200 bg-white">
                    {sales?.map((sale) => (<SaleTableRow isView={false} isAdding={false} sale={sale}></SaleTableRow>))}
                    {renderCSVRows()}
                    {renderAddSaleRow()}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-row mt-5">
                  <button
                      type="button"
                      className=" inline-flex w-1/4 justify-center gap-2 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                      onClick={openAddSaleRow}>
                    Add Sale <PlusIcon className="h-5 w-5"></PlusIcon>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <form method="post" onSubmit={handleCSV}>
          <div>
            <label>Import with a CSV: </label>
            <input type="file" id="saleCSV" name="saleCSV" accept=".csv"></input>
            <div>
              <button
              type="submit"
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm">
                Upload CSV
              </button>
            </div>
          </div>
        </form>
        <div className="px-4 py-2 sm:px-6">
          <SaveCardChanges saveModal={openConfirmationView} closeModal={props.closeOut}></SaveCardChanges>
        </div>
        
        {renderConfirmationView()}
      </div>
  )
}