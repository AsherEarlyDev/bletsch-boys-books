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
  const purchases: Purchase[] = api.purchase.getPurchasesByOrderId.useQuery({purchaseOrderId: props.purchaseOrderId}).data
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
    console.log(formData.get("purchaseCSV"))
    const csvVal = (formData.get("purchaseCSV"))
    Papa.parse(csvVal, {
      header:true,
      complete: function(results) {
        console.log(results.data)
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
    const purchases = purchaseCSV ? purchaseCSV?.map((purchase) => (<TableRow vendorId={props.purchaseVendor.id} type="Purchase" saveAdd={handleAddPurchase} closeAdd={removeCSVRow} isView={false} isAdding={true} isCSV={true} item={purchase}></TableRow>)) : null
    return purchases
  }

  function removeCSVRow(isbn:string){
    setPurchaseCSV(purchaseCSV.filter((value) => value.bookId !== isbn))
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
  function handleAddPurchase(isbn: string, quantity: number, price: number){
    if(isbn && quantity && price){
      addPurchase.mutate({
        id: props.purchaseOrderId,
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

    // <div className="px-4 sm:px-6 lg:px-8 rounded-lg shadow-lg py-8 bg-white">
    //       <div className="mb-8">
    //         <TableDetails tableName={header} tableDescription={"Viewing Purchase with ID: " + props.purchaseOrderId}>
    //         </TableDetails>
    //         <div className="flex flex-row gap-10 pt-4 justify-center">
    //           <MutableCardProp saveValue={setDate} heading="Change Date" required="True" dataType="date" defaultValue={props.purchaseDate}></MutableCardProp>
    //           <div className="mt-1">
    //             {(props.purchaseVendor && saveVendorInfo)? <VendorSelect vendors={vendors} saveFunction={saveVendorInfo} defaultValue={props.purchaseVendor?.name}></VendorSelect>: null}
    //           </div>
    //         </div>
    //         <div className="mt-8 flex flex-col">
    //           <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
    //             <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
    //               <div className="overflow-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
    //                 <table className="min-w-full divide-y divide-gray-300 table-auto">
    //                   <TableHeader>
    //                     <ColumnHeading firstEntry={true} label={tableHeading[0]}></ColumnHeading>
    //                     {tableHeading.slice(1).map((head)=>(<ColumnHeading label={head}></ColumnHeading>))}
    //                   </TableHeader>
    //                   <tbody className="divide-y divide-gray-200 bg-white">
  
    //                   {purchases?.map((item) => (<TableRow type={"Purchase"} vendorId={props.purchaseVendor?.id} isView={false} isAdding={false} item={item} mod={modPurchase}></TableRow>))}
    //                   {renderCSVRows()}
    //                   {renderAddPurchaseRow()}
    //                   </tbody>
    //                 </table>
    //               </div>
    //               <div className="flex flex-row mt-5">
    //                 <button
    //                     type="button"
    //                     className=" inline-flex w-1/4 justify-center gap-2 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
    //                     onClick={openAddPurchaseRow}>
    //                   {"Add Purchase"} <PlusIcon className="h-5 w-5"></PlusIcon>
    //                 </button>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //       <form method="post" onSubmit={handleCSV}>
    //         <div>
    //           <label>Import with a CSV: </label>
    //           <input type="file" id={`${props.type.toLowerCase().slice(0, props.type.length - 1)}CSV`} name={`${props.type.toLowerCase().slice(0, props.type.length - 1)}CSV`} accept=".csv"></input>
    //           <div>
    //             <button
    //             type="submit"
    //             className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm">
    //               Upload CSV
    //             </button>
    //           </div>
    //         </div>
    //       </form>
    //       <div className="px-4 py-2 sm:px-6">
    //         <SaveCardChanges saveModal={props.openConfirmation} closeModal={props.closeOut}></SaveCardChanges>
    //       </div>
    //       {props.confirmationView()}
  
    //     </div>
  )
}