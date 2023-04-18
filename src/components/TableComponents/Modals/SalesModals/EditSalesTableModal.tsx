import TableDetails from "../../TableDetails";
import TableHeader from "../../TableHeader";
import ColumnHeading from "../../TableColumnHeadings/ColumnHeading";
import React, {useState} from "react";
import {api} from "../../../../utils/api";
import {Sale} from "../../../../types/salesTypes";
import SaleTableRow from "../../TableRows/SaleTableRow";
import MutableCardProp from "../../../CardComponents/MutableCardProp";
import CreateSaleEntries from "../../../CreateEntries";
import ConfirmCard from "../../../CardComponents/ConfirmationCard";
import {toast} from "react-toastify";
import Papa from "papaparse";
import EditModal from "../ParentModals/EditModal";
import TableRow from "../../TableRows/Parent/TableRow";

interface EditSalesTableModalProps{
  salesRecId: string
  salesRecDate: string
  closeOut: () => void
}

export default function EditSalesTableModal(props: EditSalesTableModalProps) {
  const [date, setDate] = useState(props.salesRecDate)
  const tableHeading = ["Title", "Retail Price", "Quantity Bought", "Subtotal", "Edit/Save", "Delete"]
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
  const modSale = api.sales.modifySale.useMutation({
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success("Successfully modified sale!")
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

  async function handleCSV(e: React.FormEvent<HTMLInputElement>){
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
    const price = parseFloat(csv.unit_price.replaceAll('$', ''))
    return ({
      bookId:(csv.isbn).replaceAll('-',''),
      quantity:quant,
      price: price,
      subtotal: quant * price,
    })
  }

  function renderCSVRows(){
    const sales = saleCSV ? saleCSV?.map((sale) => sale!=null ? (<TableRow vendorId={null} type="Sale" saveAdd={handleAddSale} closeAdd={removeCSVRow} isView={false} isAdding={true} isCSV={true} item={sale}></TableRow>):null) : null
    return sales
  }
  
  function removeCSVRow(isbn:string){
    setSaleCSV(saleCSV.map((value) =>value==null ? null : (value.bookId !== isbn ? value : null)))
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
    return (addSaleRowView && (<TableRow vendorId={null} type="Sale" isView={false} saveAdd={handleAddSale} closeAdd={closeAddSaleRow} isAdding={true} item={dummySale}></TableRow>));
  }
  function closeAddSaleRow(){
    setAddSaleRowView(false)
  }
  function handleAddSale(isbn: string, quantity: number, price: number, isCSV?:boolean){
    if(isbn && quantity){
      addSale.mutate({
        saleReconciliationId: props.salesRecId,
        isbn: isbn,
        quantity: quantity.toString(),
        price: price.toString()
      })
      closeAddSaleRow()
      isCSV ? removeCSVRow(isbn) : closeAddSaleRow()
    }
    else{
      toast.error("Cannot add sale.")
    }
  }

  return (
    <EditModal
    header={header}
    type="Sale"
    id={props.salesRecId}
    vendor={null}
    date={props.salesRecDate}
    tableHeadings={tableHeading}
    items={sales}
    setDate={setDate}
    saveVendor={null}
    closeOut={props.closeOut}
    openRow={openAddSaleRow}
    openConfirmation={openConfirmationView}
    handleCSV={handleCSV}
    confirmationView={renderConfirmationView}
    renderCSV={renderCSVRows}
    renderAdd={renderAddSaleRow}
    vendors={null}
    edit={modSale}
    ></EditModal>
  )
}