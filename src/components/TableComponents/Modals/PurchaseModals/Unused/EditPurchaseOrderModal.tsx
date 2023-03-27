import ImmutableCardProp from "../../../../CardComponents/ImmutableCardProp";
import MutableCardProp from "../../../../CardComponents/MutableCardProp";
import CardTitle from "../../../../CardComponents/CardTitle";
import CardGrid from "../../../../CardComponents/CardGrid";
import SaveCardChanges from "../../../../CardComponents/SaveCardChanges";
import { useState } from 'react';
import { api } from '../../../../../utils/api';
import CreateEntries from "../../../../CreateEntries";
import ConfirmCard from "../../../../CardComponents/ConfirmationCard";
import CreateSaleEntries from "../../../../CreateEntries";
import VendorSelect from "../../../../CardComponents/VendorSelect";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



interface EditPurchaseOrderModalProp{
  purchaseOrderId: string
  vendorName:  string
  date: string
  closeOut: () => void
}


export default function EditPurchaseOrderModal(props:EditPurchaseOrderModalProp) {
  const [open, setOpen] = useState(true)
  const [vendorInfo, setVendorInfo] = useState({id: '', name: props.vendorName})
  const [date, setDate] = useState(props.date)
  const [displayConfirmationView, setDisplayConfirmationView] = useState(false)
  const modifyPurchaseOrder = api.purchaseOrder.modifyPurchaseOrder.useMutation({
    onError: (error)=>{
    toast.error(error.message)
  },
  onSuccess: ()=>{
    toast.success("Successfully modified Purchase Order!")
  }
})
  const vendors = api.vendor.getAllVendors.useQuery().data

  function closeModal(){
    setOpen(false)
    props.closeOut()
  }

  function editPurchaseOrder(){
      if(props.vendorName && props.date && props.purchaseOrderId){
        let vendorId
        for (const vendor of vendors){
          if (vendor.name === vendorInfo.name){
            
            vendorId = vendor.id
          }
        }
        if (vendorId){
          modifyPurchaseOrder.mutate({
            date: date,
            purchaseOrderId: props.purchaseOrderId,
            vendorId: vendorId
          })
        }
        else{
          toast.error("No vendor under that name")
        }
        closeModal()
      }
    
    
  }

  function openConfirmationView(){
    setDisplayConfirmationView(true)
  }
  function renderConfirmationView(){
    return <>
      {(displayConfirmationView) ?
          <CreateSaleEntries closeStateFunction={setDisplayConfirmationView} submitText="Confirm">
            <ConfirmCard onClose={closeConfirmationView} onConfirm={editPurchaseOrder} confirmHeading="Sales Reconciliation Edit Confirmation"
                         confirmMessage="Confirm and Resubmit to make changes to Sale Reconciliation"></ConfirmCard></CreateSaleEntries> : null}
    </>;
  }
  function closeConfirmationView(){
    setDisplayConfirmationView(false)
  }

  return (
      (open ?
      <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
        <CardTitle heading="Purchase Order Info" subheading="Confirm and validate purchase order information below..."></CardTitle>
        <CardGrid>
          <ImmutableCardProp heading="Purchase Order ID" data={props.purchaseOrderId}></ImmutableCardProp>
          <VendorSelect saveFunction={setVendorInfo} defaultValue={props.vendorName}></VendorSelect>
          <MutableCardProp saveValue={setDate} heading="Date" required="True" dataType="date" 
          defaultValue={props.date}></MutableCardProp>
        </CardGrid>
        <SaveCardChanges closeModal={closeModal} saveModal={editPurchaseOrder}></SaveCardChanges>
        <div>
          {renderConfirmationView()}
        </div>
      </div>
      : null)
  )
}
