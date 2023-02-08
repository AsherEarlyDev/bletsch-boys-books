import ImmutableCardProp from "../CardComponents/ImmutableCardProp";
import MutableCardProp from "../CardComponents/MutableCardProp";
import CardTitle from "../CardComponents/CardTitle";
import CardGrid from "../CardComponents/CardGrid";
import SaveCardChanges from "../CardComponents/SaveCardChanges";
import { useState } from 'react';
import { api } from '../../utils/api';


interface PurchaseDeleteProp{
  purchaseId:  string
}


export default function PurchaseDeleteCard(props:PurchaseDeleteProp) {
  const [open, setOpen] = useState(true)
  const deletePurchase = api.purchase.deletePurchase.useMutation()


  function saveBook(){
    if(props.purchaseId){
      deletePurchase.mutate({
        id: props.purchaseId
      })
      closeModal()
    }
    else{
      alert("Error")
    }
  }

  function closeModal(){
    setOpen(false)
  }

  return (
      (open ? (props.purchaseId ?
      <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
        <CardTitle heading="Purchase" subheading="Confirm to delete this Purchase"></CardTitle>
        <SaveCardChanges closeModal={closeModal} saveBook={saveBook}></SaveCardChanges>
      </div>
      : null) : null)
  )
}
