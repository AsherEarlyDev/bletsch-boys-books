import ImmutableCardProp from "../CardComponents/ImmutableCardProp";
import MutableCardProp from "../CardComponents/MutableCardProp";
import CardTitle from "../CardComponents/CardTitle";
import CardGrid from "../CardComponents/CardGrid";
import SaveCardChanges from "../CardComponents/SaveCardChanges";
import { useState } from 'react';
import { api } from '../../utils/api';
import CreateEntries from "../CreateEntries";
import ConfirmCard from "../CardComponents/ConfirmationCard";



interface PurchasesProp{
  purchaseOrderId: string
  vendorName:  string
  date: string
  cardType: string
}


export default function PurchasesCard(props:PurchasesProp) {
  const [open, setOpen] = useState(true)
  const [vendorName, setVendorName] = useState(props.vendorName)
  const [date, setDate] = useState(props.date)
  const [displayConfirm, setDisplayConfirm] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const editOrder = api.purchaseOrder.modifyPurchaseOrder.useMutation()
  const deleteOrder = api.purchaseOrder.deletePurchaseOrder.useMutation()
  const vendors = api.vendor.getVendors.useQuery().data

  function saveBook(){
    
      if(props.vendorName && props.date && props.purchaseOrderId){
        if (props.cardType === 'edit'){
          if(confirm){
              let vendorId
              
              for (const vendor of vendors){
                  if (vendor.name === vendorName){
                      vendorId = vendor.id
                  }
              }
              if (vendorId){
                  editOrder.mutate({
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
            setDisplayConfirm(true)
          }
          
        }
        else{
          deleteOrder.mutate({
            purchaseOrderId: props.purchaseOrderId
          })
          closeModal()
        }
        
      }
      else{
        alert("error")
      }
    
    
  }

  function closeModal(){
    setOpen(false)
  }

  function renderConfirmation(){
    return <>
    {(displayConfirm) ?
        <CreateEntries closeStateFunction={setDisplayConfirm} submitText="Edit Purchase Order"> 
          <ConfirmCard onConfirm={setConfirm} confirmHeading="Purchase Order Edit Confirmation"
          confirmMessage="Confirm and Resubmit to make changes to Purchase Order"></ConfirmCard></CreateEntries> : null}
    </>;
      }

  return (
      (open ? ( props.cardType === 'edit' ?
      <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
        <CardTitle heading="Purchase Order Info" subheading="Confirm and validate purchase order information below..."></CardTitle>
        <CardGrid>
          <ImmutableCardProp heading="Purchase Order ID" data={props.purchaseOrderId}></ImmutableCardProp>
          <MutableCardProp saveValue={setVendorName} heading="Vendor Name" required="True" dataType="string" 
          defaultValue={props.vendorName}></MutableCardProp>
          <MutableCardProp saveValue={setDate} heading="Date" required="True" dataType="string" 
          defaultValue={props.date}></MutableCardProp>
        </CardGrid>
        <SaveCardChanges closeModal={closeModal} saveBook={saveBook}></SaveCardChanges>
        <div>
          {renderConfirmation()}
        </div>
      </div>
      : 
      <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
        <CardTitle heading="Purchase Order Confirmation" subheading="Confirm to delete this purchase order."></CardTitle>
        <SaveCardChanges closeModal={closeModal} saveBook={saveBook}></SaveCardChanges>
      </div>
      
      ): null)
  )
}
