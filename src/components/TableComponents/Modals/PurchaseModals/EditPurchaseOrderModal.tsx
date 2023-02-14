import ImmutableCardProp from "../../../CardComponents/ImmutableCardProp";
import MutableCardProp from "../../../CardComponents/MutableCardProp";
import CardTitle from "../../../CardComponents/CardTitle";
import CardGrid from "../../../CardComponents/CardGrid";
import SaveCardChanges from "../../../CardComponents/SaveCardChanges";
import { useState } from 'react';
import { api } from '../../../../utils/api';
import CreateEntries from "../../../CreateEntries";
import ConfirmCard from "../../../CardComponents/ConfirmationCard";
import CreateSaleEntries from "../../../CreateEntries";
import VendorSelect from "../../../CardComponents/VendorSelect";



interface EditPurchaseOrderModalProp{
  purchaseOrderId: string
  vendorName:  string
  date: string
  closeOut: () => void
}


export default function EditPurchaseOrderModal(props:EditPurchaseOrderModalProp) {
  const [open, setOpen] = useState(true)
  const [vendorName, setVendorName] = useState(props.vendorName)
  const [date, setDate] = useState(props.date)
  const [displayConfirmationView, setDisplayConfirmationView] = useState(false)
  const modifySalesRec = api.purchaseOrder.modifyPurchaseOrder.useMutation()
  const vendors = api.vendor.getVendors.useQuery().data

  function closeModal(){
    setOpen(false)
    props.closeOut()
  }

  function editPurchaseOrder(){
      if(props.vendorName && props.date && props.purchaseOrderId){
        let vendorId
        for (const vendor of vendors){
          if (vendor.name === vendorName){
            vendorId = vendor.id
          }
        }
        if (vendorId){
          modifySalesRec.mutate({
            date: date,
            purchaseOrderId: props.purchaseOrderId,
            vendorId: vendorId
          })
        }
        else{
          alert("No vendor under that name")
        }
        closeModal()
      }
      else{
        alert("error")
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
          <VendorSelect saveFunction={setVendorName} defaultValue={props.vendorName}></VendorSelect>
          <MutableCardProp saveValue={setDate} heading="Date" required="True" dataType="string" 
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
