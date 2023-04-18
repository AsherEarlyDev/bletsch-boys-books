import React, {useState} from "react";
import {api} from "../../../../utils/api";
import CreateSaleEntries from "../../../CreateEntries";
import ConfirmCard from "../../../CardComponents/ConfirmationCard";
import {toast} from "react-toastify";
import {Purchase} from "../../../../types/purchaseTypes";
import { Vendor } from "../../../../types/vendorTypes";
import Papa from "papaparse";
import EditModal from "../ParentModals/EditModal";
import TableRow from "../../TableRows/Parent/TableRow";
import { PlusIcon } from "@heroicons/react/24/outline";
import { TableHeader } from "semantic-ui-react";
import MutableCardProp from "../../../CardComponents/MutableCardProp";
import SaveCardChanges from "../../../CardComponents/SaveCardChanges";
import VendorSelect from "../../../CardComponents/VendorSelect";
import ColumnHeading from "../../TableColumnHeadings/ColumnHeading";
import TableDetails from "../../TableDetails";

interface EditPurchaseTableModalProps{
  purchaseOrderId: string
  purchaseDate: string
  purchaseVendor: Vendor
  closeOut: () => void
}

export default function EditPurchaseTableModal(props: EditPurchaseTableModalProps) {
  const [date, setDate] = useState(props.purchaseDate)
  const tableHeading = ["Title", "Retail Price", "Quantity Bought", "Subtotal", "Edit/Save", "Delete"]
  const [vendorName, setVendorName] = useState(props.purchaseVendor.name)
  const [purchaseOrderId, setPurchaseOrderId] = useState(props.purchaseOrderId)
  const [vendorId, setVendorId] = useState(props.purchaseVendor.id)
  const [vendorBuyback, setVendorBuyback] = useState(props.purchaseVendor.bookBuybackPercentage)
  const [addPurchaseRowView, setAddPurchaseRowView] = useState(false)
  const [displayConfirmationView, setDisplayConfirmationView] = useState(false)
  const [purchaseCSV, setPurchaseCSV] = useState<any[]>()
  const header = date + " Purchase Order"
  const modifyPurchaseOrder = api.purchaseOrder.modifyPurchaseOrder.useMutation({
    onError: (error)=>{
      toast.error(error.message)
    },
    onSuccess: ()=>{
      toast.success("Successfully modified purchase order!")
    }
  })
  const addPurchase = api.purchase.createPurchase.useMutation({
    onError: (error)=>{
      toast.error(error.message)
    },
    onSuccess: ()=>{
      toast.success("Successfully added purchase!")
    }
  })
  const modPurchase = api.purchase.modifyPurchase.useMutation({
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success("Successfully modified purchase!")
    }
  })
  const purchases: Purchase[] = api.purchase.getPurchasesByOrderId.useQuery({purchaseOrderId: purchaseOrderId}).data
  const vendors: Vendor[] = api.vendor.getAllVendors.useQuery().data

  function saveVendorInfo(vendor: Vendor){
    setVendorBuyback(vendor.bookBuybackPercentage)
    setVendorId(vendor.id)
    setVendorName(vendor.name)
  }

  function openConfirmationView(){
    setDisplayConfirmationView(true)
  }
  function renderConfirmationView(){
    return <>
      {(displayConfirmationView) ?
          <CreateSaleEntries closeStateFunction={setDisplayConfirmationView} submitText="Confirm">
            <ConfirmCard onClose={closeConfirmationView} onConfirm={handleEditSubmission} confirmHeading="Are You Sure You Want To Edit This Purchase Order..."
                         confirmMessage="The current purchase order information will be updated."></ConfirmCard></CreateSaleEntries> : null}
    </>;
  }
  function closeConfirmationView(){
    setDisplayConfirmationView(false)
  }

  function handleEditSubmission(){
    //Need to add vendor to modification but need to fetch vendor id from vendor name
    setDisplayConfirmationView(false)
    const newVendorId = vendorId ? vendorId : props.purchaseVendor.id
    if(props.purchaseOrderId && date && newVendorId){
      modifyPurchaseOrder.mutate({
        date: date,
        purchaseOrderId: props.purchaseOrderId,
        vendorId: newVendorId
      })
      props.closeOut()
    }
    else{
      toast.error("Input Details Undefined!")
    }
  }
  async function handleCSV(e: React.FormEvent<HTMLInputElement>){
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const csvVal = (formData.get("purchaseCSV"))
    Papa.parse(csvVal, {
      header:true,
      complete: function(results) {
        const csv = results.data.map((result) => transformCSV(result))
        setPurchaseCSV(csv);
      }
  })}

  function transformCSV(csv){
    const quant = parseInt(csv.quantity)
    const price = parseFloat(csv.unit_price.replaceAll('$', ''))
    return ({
      bookId:(csv.isbn).replaceAll('-',''),
      quantity:quant,
      price: price,
      subtotal: quant* price,
    })
  }

  function renderCSVRows(){
    const purchases = purchaseCSV ? purchaseCSV?.map((purchase) => purchase != null ?  (<TableRow vendorId={props.purchaseVendor.id} type="Purchase" saveAdd={handleAddPurchase} closeAdd={removeCSVRow} isView={false} isAdding={true} isCSV={true} item={purchase}></TableRow>): null) : null
    return purchases
  }

  function removeCSVRow(isbn:string){
    console.log(isbn)
    console.log(purchaseCSV.map((value) =>value==null ? null : (value.bookId !== isbn ? value : null)))
    setPurchaseCSV(purchaseCSV.map((value) =>value==null ? null : (value.bookId !== isbn ? value : null)))

  }

  function openAddPurchaseRow(){
    setAddPurchaseRowView(true)
  }
  function renderAddPurchaseRow(){
    const dummyPurchase = {
      id: '',
      purchaseOrderId: props.purchaseOrderId,
      price: 0,
      quantity: 0,
      bookId: '',
      subtotal: 0
    }
    return (addPurchaseRowView && (<TableRow vendorId={props.purchaseVendor.id} type="Purchase" isView={false} saveAdd={handleAddPurchase} closeAdd={closeAddPurchaseRow} isAdding={true} item={dummyPurchase}></TableRow>));
  }
  function closeAddPurchaseRow(){
    setAddPurchaseRowView(false)
  }
  function handleAddPurchase(isbn: string, quantity: number, price: number, isCSV?:boolean){
    if(isbn && quantity && price){
      addPurchase.mutate({
        id: props.purchaseOrderId,
        isbn: isbn,
        quantity: quantity.toString(),
        price: price.toString()
      })
      isCSV ? removeCSVRow(isbn) : closeAddPurchaseRow()
      
    }
    else{
      toast.error("Cannot add purchase.")
    }
  }

  return (
    <EditModal
    header={header}
    type="Purchase"
    id={props.purchaseOrderId}
    vendor={props.purchaseVendor}
    date={props.purchaseDate}
    tableHeadings={tableHeading}
    items={purchases}
    setDate={setDate}
    saveVendor={saveVendorInfo}
    closeOut={props.closeOut}
    openRow={openAddPurchaseRow}
    openConfirmation={openConfirmationView}
    handleCSV={handleCSV}
    confirmationView={renderConfirmationView}
    renderCSV={renderCSVRows}
    renderAdd={renderAddPurchaseRow}
    vendors={vendors}
    edit={modPurchase}
    ></EditModal>
  )
}