import TableDetails from "../../TableDetails";
import { editableBook } from '../../../../types/bookTypes';
import NewBookEntryTableRow from "../../TableRows/NewBookEntryTableRow";
import TableHeader from "../../TableHeader";
import ColumnHeading from "../../TableColumnHeadings/ColumnHeading";
import React, {useState} from "react";
import SaveCardChanges from "../../../CardComponents/SaveCardChanges";
import {api} from "../../../../utils/api";
import SaleTableRow from "../../TableRows/SaleTableRow";
import MutableCardProp from "../../../CardComponents/MutableCardProp";
import CreateSaleEntries from "../../../CreateEntries";
import ConfirmCard from "../../../CardComponents/ConfirmationCard";
import {toast} from "react-toastify";
import {PlusIcon} from "@heroicons/react/24/solid";
import {Purchase} from "../../../../types/purchaseTypes";
import PurchaseTableRow from "../../TableRows/PurchaseTableRow";
import VendorSelect from "../../../CardComponents/VendorSelect";
import { Vendor } from "../../../../types/vendorTypes";

interface EditPurchaseTableModalProps{
  purchaseOrderId: string
  purchaseDate: string
  purchaseVendor: Vendor
  closeOut: () => void
}

export default function EditPurchaseTableModal(props: EditPurchaseTableModalProps) {
  const [date, setDate] = useState(props.purchaseDate)
  const [vendorName, setVendorName] = useState(props.purchaseVendor.name)
  const [vendorId, setVendorId] = useState(props.purchaseVendor.id)
  const [vendorBuyback, setVendorBuyback] = useState(props.purchaseVendor.bookBuybackPercentage)
  const [addPurchaseRowView, setAddPurchaseRowView] = useState(false)
  const [displayConfirmationView, setDisplayConfirmationView] = useState(false)
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
  const purchases: Purchase[] = api.purchase.getPurchasesByOrderId.useQuery({purchaseOrderId: props.purchaseOrderId}).data

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
    return (addPurchaseRowView && (<PurchaseTableRow isView={false} saveAdd={handleAddPurchase} closeAdd={closeAddPurchaseRow} isAdding={true} purchase={dummyPurchase}></PurchaseTableRow>));
  }
  function closeAddPurchaseRow(){
    setAddPurchaseRowView(false)
  }
  function handleAddPurchase(isbn: string, quantity: number, price: number){
    if(isbn && quantity && price){
      addPurchase.mutate({
        purchaseOrderId: props.purchaseOrderId,
        isbn: isbn,
        quantity: quantity.toString(),
        price: price.toString()
      })
      closeAddPurchaseRow()
    }
    else{
      toast.error("Cannot add purchase.")
    }
  }

  return (
      <div className="px-4 sm:px-6 lg:px-8 rounded-lg shadow-lg py-8 bg-white">
        <div className="mb-8">
          <TableDetails tableName={header} tableDescription={"Viewing purchase order with ID: " + props.purchaseOrderId}>
          </TableDetails>
          <div className="flex flex-row gap-10 pt-4 justify-center">
            <MutableCardProp saveValue={setDate} heading="Change Date" required="True" dataType="date" defaultValue={date}></MutableCardProp>
            <div className="mt-1">
              <VendorSelect saveFunction={saveVendorInfo} defaultValue={props.purchaseVendor?.name}></VendorSelect>
            </div>
          </div>
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300 table-auto">
                    <TableHeader>
                      <ColumnHeading firstEntry={true} label="Title"></ColumnHeading>
                      <ColumnHeading label="Purchase Price"></ColumnHeading>
                      <ColumnHeading label="Quantity Bought"></ColumnHeading>
                      <ColumnHeading label="Subtotal"></ColumnHeading>
                      <ColumnHeading label="Edit/Save"></ColumnHeading>
                      <ColumnHeading label="Delete"></ColumnHeading>
                    </TableHeader>
                    <tbody className="divide-y divide-gray-200 bg-white">
                    {purchases?.map((purchase) => (<PurchaseTableRow isView={false} isAdding={false} purchase={purchase}></PurchaseTableRow>))}
                    {renderAddPurchaseRow()}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-row mt-5">
                  <button
                      type="button"
                      className=" inline-flex w-1/4 justify-center gap-2 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                      onClick={openAddPurchaseRow}>
                    Add Purchase <PlusIcon className="h-5 w-5"></PlusIcon>
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