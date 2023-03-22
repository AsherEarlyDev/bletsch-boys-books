import React, {useRef, useState} from "react";
import {api} from "../../../../utils/api";
import CreateSaleEntries from "../../../CreateEntries";
import ConfirmCard from "../../../CardComponents/ConfirmationCard";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Buyback } from "../../../../types/buybackTypes";
import Papa from "papaparse";
import { Vendor } from "../../../../types/vendorTypes";
import EditModal from "../ParentModals/EditModal";
import TableRow from "../../TableRows/Parent/TableRow";

interface EditBuybackTableModalProps{
  data: {
    id: string
    vendor: Vendor
    date: string
  }
  closeOut: () => void
}

export default function EditBuybackTableModal(props: EditBuybackTableModalProps) {
  const [date, setDate] = useState(props.data.date)
  const tableHeading = ["Title", "Buyback Price", "Quantity Bought", "Subtotal", "Edit/Save", "Delete"]
  const [vendorName, setVendorName] = useState(props.data.vendor.name)
  const [vendorId, setVendorId] = useState(props.data.vendor.id)
  const [vendorBuyback, setVendorBuyback] = useState(props.data.vendor.bookBuybackPercentage)
  const [addBuybackRowView, setAddBuybackRowView] = useState(false)
  const [displayConfirmationView, setDisplayConfirmationView] = useState(false)
  const header: string = date + " Buyback"
  const [buybackCSV, setBuybackCSV] = useState<any[]>()
  const modifyBuybackOrder = api.buybackOrder.modifyBuybackOrder.useMutation({
    onError: (error)=>{
      toast.error(error.message)
    },
    onSuccess: ()=>{
      toast.success("Successfully modified Book Buyback!")
    }
  })
  const addBuyback = api.buyback.createBuyback.useMutation({
    onError: (error)=>{
      toast.error("Failed to add buyback!")
    },
    onSuccess: ()=>{
      toast.success("Successfully added buyback!")
    }
  })
  const buybacks: Buyback[] = api.buyback.getBuybacksByOrderId.useQuery({buybackOrderId: props.data.id}).data
  const vendors: Vendor[] = api.vendor.getVendorsWithBuyback.useQuery().data

  function openConfirmationView(){
    setDisplayConfirmationView(true)
  }
  function renderConfirmationView(){
    return <>
      {(displayConfirmationView) ?
          <CreateSaleEntries closeStateFunction={setDisplayConfirmationView} submitText="Confirm">
            <ConfirmCard onClose={closeConfirmationView} onConfirm={handleEditSubmission} confirmHeading="Are You Sure You Want To Edit This Buyback..."
                         confirmMessage="The current buyback information will be updated."></ConfirmCard></CreateSaleEntries> : null}
    </>;
  }
  function closeConfirmationView(){
    setDisplayConfirmationView(false)
  }


  async function handleCSV(e: React.FormEvent<HTMLInputElement>){
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const csvVal = (formData.get("buybackCSV"))
    Papa.parse(csvVal, {
      header:true,
      complete: function(results) {

        const csv = results.data.map((result) => transformCSV(result))
        setBuybackCSV(csv);
      }
  })}

  function transformCSV(csv){
    const quant = parseInt(csv.quantity)
    const price = parseFloat(csv.unit_buyback_price.replaceAll('$', ''))
    return ({
      bookId:(csv.isbn).replaceAll('-',''),
      quantity:quant,
      buybackPrice: price,
      subtotal: quant* price,
    })
  }

  function renderCSVRows(){

    return buybackCSV ? buybackCSV?.map((buyback) => (<TableRow type="Buyback" saveAdd={handleAddBuyback} closeAdd={removeCSVRow} isView={false} isAdding={true} isCSV={true} item={buyback} vendorId={props.data.vendor.id}></TableRow>)) : null
  }
  
  function removeCSVRow(isbn:string){
    setBuybackCSV(buybackCSV.filter((value) => value.bookId !== isbn))
  }

  function saveVendorInfo(vendor: Vendor){
    setVendorBuyback(vendor.bookBuybackPercentage)
    setVendorId(vendor.id)
    setVendorName(vendor.name)
  }

  function handleEditSubmission(){
    //Need to add vendor to modification but need to fetch vendor id from vendor name
    setDisplayConfirmationView(false)
    const newVendorId = vendorId ? vendorId : props.data.vendor.id
    if(props.data.id && date && newVendorId){
      modifyBuybackOrder.mutate({
        date: date,
        buybackOrderId: props.data.id,
        vendorId: newVendorId
      })
      props.closeOut()
      window.location.reload()
    }
    else{
      toast.error("Input Details Undefined!")
    }
  }

  function openAddBuybackRow(){
    setAddBuybackRowView(true)
  }

  function renderAddBuybackRow(){
    const dummyBuyback = {
      id: '',
      buybackOrderId: props.data.id,
      buybackPrice: 0,
      quantity: 0,
      bookId: '',
      subtotal: 0
    }
    return (addBuybackRowView && (<TableRow type="Buyback" vendorId={props.data.vendor.id} isView={false} saveAdd={handleAddBuyback} closeAdd={closeAddBuybackRow} isAdding={true} item={dummyBuyback}></TableRow>));
  }

  function closeAddBuybackRow(){
    setAddBuybackRowView(false)
  }

  function handleAddBuyback(isbn: string, quantity: number, price: number){
    if(isbn && quantity && props.data.id){
      let buybackPrice
      if (price === undefined){
        buybackPrice = 0
      }
      else{
        buybackPrice = price
      }
      addBuyback.mutate({
        buybackOrderId: props.data.id,
        isbn: isbn,
        quantity: quantity.toString(),
        price: buybackPrice.toString()
      })
      closeAddBuybackRow()
    }
    else{
      toast.error("Cannot add buyback.")
    }
  }

  return (
    <EditModal
    header={header}
    type="Buyback"
    id={props.data.id}
    vendor={props.data.vendor}
    date={props.data.date}
    tableHeadings={tableHeading}
    items={buybacks}
    setDate={setDate}
    saveVendor={saveVendorInfo}
    closeOut={props.closeOut}
    openRow={openAddBuybackRow}
    openConfirmation={openConfirmationView}
    handleCSV={handleCSV}
    confirmationView={renderConfirmationView}
    renderCSV={renderCSVRows}
    renderAdd={renderAddBuybackRow}
    vendors={vendors}
    ></EditModal>
  )
}