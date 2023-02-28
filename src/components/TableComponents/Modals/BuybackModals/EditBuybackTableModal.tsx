import TableDetails from "../../TableDetails";
import { editableBook } from '../../../../types/bookTypes';
import NewBookEntryTableRow from "../../TableRows/NewBookEntryTableRow";
import TableHeader from "../../TableHeader";
import ColumnHeading from "../../TableColumnHeadings/ColumnHeading";
import React, {useRef, useState} from "react";
import SaveCardChanges from "../../../CardComponents/SaveCardChanges";
import {api} from "../../../../utils/api";
import MutableCardProp from "../../../CardComponents/MutableCardProp";
import CreateSaleEntries from "../../../CreateEntries";
import ConfirmCard from "../../../CardComponents/ConfirmationCard";
import {toast} from "react-toastify";
import {PlusIcon} from "@heroicons/react/24/solid";
import VendorSelect from "../../../CardComponents/VendorSelect";
import { Buyback } from "../../../../types/buybackTypes";
import BuybackTableRow from "../../TableRows/BuybackTableRow";
import BuybackVendorSelect from "../../../CardComponents/BuybackVendorSelect";
import { Vendor } from "../../../../types/vendorTypes";

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
  const [vendorName, setVendorName] = useState(props.data.vendor.name)
  const [vendorId, setVendorId] = useState(props.data.vendor.id)
  const [vendorBuyback, setVendorBuyback] = useState(props.data.vendor.bookBuybackPercentage)
  const [addBuybackRowView, setAddBuybackRowView] = useState(false)
  const [displayConfirmationView, setDisplayConfirmationView] = useState(false)
  const header = date + " Buyback"
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
      toast.error(error.message)
    },
    onSuccess: ()=>{
      toast.success("Successfully added buyback!")
    }
  })
  const buybacks: Buyback[] = api.buyback.getBuybacksByOrderId.useQuery({buybackOrderId: props.data.id}).data

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
    return (addBuybackRowView && (<BuybackTableRow vendorId={props.data.vendor.id} isView={false} saveAdd={handleAddBuyback} closeAdd={closeAddBuybackRow} isAdding={true} buyback={dummyBuyback}></BuybackTableRow>));
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
      <div className="px-4 sm:px-6 lg:px-8 rounded-lg shadow-lg py-8 bg-white">
        <div className="mb-8">
          <TableDetails tableName={header} tableDescription={"Viewing buyback with ID: " + props.data.id}>
          </TableDetails>
          <div className="flex flex-row gap-10 pt-4 justify-center">
            <MutableCardProp saveValue={setDate} heading="Change Date" required="True" dataType="date" defaultValue={date}></MutableCardProp>
            <div className="mt-1">
              <BuybackVendorSelect saveFunction={saveVendorInfo} defaultValue={props.data.vendor?.name}></BuybackVendorSelect>
            </div>
          </div>
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300 table-auto">
                    <TableHeader>
                      <ColumnHeading firstEntry={true} label="Title"></ColumnHeading>
                      <ColumnHeading label="Buyback Price"></ColumnHeading>
                      <ColumnHeading label="Quantity Bought"></ColumnHeading>
                      <ColumnHeading label="Subtotal"></ColumnHeading>
                      <ColumnHeading label="Edit/Save"></ColumnHeading>
                      <ColumnHeading label="Delete"></ColumnHeading>
                    </TableHeader>
                    <tbody className="divide-y divide-gray-200 bg-white">
                    {buybacks?.map((buyback) => (<BuybackTableRow vendorId={props.data.vendor.id} isView={false} isAdding={false} buyback={buyback}></BuybackTableRow>))}
                    {renderAddBuybackRow()}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-row mt-5">
                  <button
                      type="button"
                      className=" inline-flex w-1/4 justify-center gap-2 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                      onClick={openAddBuybackRow}>
                    Add Buyback <PlusIcon className="h-5 w-5"></PlusIcon>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 py-2 sm:px-6">
          <SaveCardChanges saveModal={openConfirmationView} closeModal={props.closeOut}></SaveCardChanges>
        </div>
        {renderConfirmationView()}
      </div>
  )
}