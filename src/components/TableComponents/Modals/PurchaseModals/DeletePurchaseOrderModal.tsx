import ImmutableCardProp from "../../../CardComponents/ImmutableCardProp";
import MutableCardProp from "../../../CardComponents/MutableCardProp";
import CardTitle from "../../../CardComponents/CardTitle";
import CardGrid from "../../../CardComponents/CardGrid";
import SaveCardChanges from "../../../CardComponents/SaveCardChanges";
import { useState } from 'react';
import { api } from '../../../../utils/api';
import SecondaryButton from "../../../BasicComponents/SecondaryButton";
import PrimaryButton from "../../../BasicComponents/PrimaryButton";


interface DeletePurchaseOrderModalProp{
  purchaseId:  string,
  closeOut: () => void
}


export default function DeletePurchaseOrderModal(props:DeletePurchaseOrderModalProp) {
  const [open, setOpen] = useState(true)
  const deletePurchaseOrder = api.purchaseOrder.deletePurchaseOrder.useMutation()
  const message = ("Are you sure you want to delete this purchase order from the database? This action cannot be undone.")

  function closeModal(){
    setOpen(false)
    props.closeOut()
  }

  function handleDeletePurchaseOrder(){
    if(props.purchaseId){
      deletePurchaseOrder.mutate({
        purchaseOrderId: props.purchaseId
      })
      closeModal()
    }
    else{
      alert("Error")
    }
  }

  return (
      ((open && props.purchaseId) ?
      <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
        <CardTitle heading="Delete Purchase Order..." subheading={message}></CardTitle>
        <div className="gap-5 flex flex-row justify-around px-4 py-4 sm:px-6">
          <SecondaryButton onClick={props.closeOut} buttonText="Cancel"></SecondaryButton>
          <PrimaryButton onClick={handleDeletePurchaseOrder} buttonText="Delete Purchase Order"></PrimaryButton>
        </div>
      </div>
      : null)
  )
}
