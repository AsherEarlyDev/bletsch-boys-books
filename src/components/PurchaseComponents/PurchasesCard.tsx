import ImmutableCardProp from "../CardComponents/ImmutableCardProp";
import MutableCardProp from "../CardComponents/MutableCardProp";
import CardTitle from "../CardComponents/CardTitle";
import CardGrid from "../CardComponents/CardGrid";
import SaveCardChanges from "../CardComponents/SaveCardChanges";
import { useState } from 'react';
import { api } from '../../utils/api';



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
  const editOrder = api.purchaseOrder.modifyPurchaseOrder.useMutation()
  const deleteOrder = api.purchaseOrder.deletePurchaseOrder.useMutation()
  const vendors = api.vendor.getVendors.useQuery().data




  function saveBook(){
    if(props.vendorName && props.date && props.purchaseOrderId){
      if (props.cardType === 'edit'){
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
        
      }
      else{
        deleteOrder.mutate({
          purchaseOrderId: props.purchaseOrderId
        })
      }
      closeModal()
    }
    else{
      alert("error")
    }
  }

  function closeModal(){
    setOpen(false)
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
      </div>
      : 
      <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
        <CardTitle heading="Purchase Order Info" subheading="Are you sure you want to delete this purchase order?"></CardTitle>
        <CardGrid>
          <ImmutableCardProp heading="Purchase Order ID" data={props.purchaseOrderId}></ImmutableCardProp>
          <ImmutableCardProp heading="Vendor Name" data={props.vendorName}></ImmutableCardProp>
          <ImmutableCardProp heading="Date" data={props.date}></ImmutableCardProp>
        </CardGrid>
        <SaveCardChanges closeModal={closeModal} saveBook={saveBook}></SaveCardChanges>
      </div>
      
      ): null)
  )
}
