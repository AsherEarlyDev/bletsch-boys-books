import ImmutableCardProp from "../../../CardComponents/ImmutableCardProp";
import MutableCardProp from "../../../CardComponents/MutableCardProp";
import CardTitle from "../../../CardComponents/CardTitle";
import CardGrid from "../../../CardComponents/CardGrid";
import SaveCardChanges from "../../../CardComponents/SaveCardChanges";
import {Dispatch, SetStateAction, useState} from 'react';
import { api } from '../../../../utils/api';
import { SalesRec } from "../../../../types/salesTypes";
import {toast} from "react-toastify";
import SecondaryButton from "../../../BasicComponents/SecondaryButton";
import PrimaryButton from "../../../BasicComponents/PrimaryButton";


interface PurchaseDeleteProp{
  purchaseId:  string,
  closeOut: ()=>void
  onDelete: Dispatch<SetStateAction<boolean>>
  bookTitle: string
  quantity: number
  price: number
}


export default function DeletePurchaseModal(props:PurchaseDeleteProp) {
  const [open, setOpen] = useState(true)
  const message = ("Are you sure you want to delete the record associated with purchasing " + props.quantity + " copies of " + props.bookTitle + " at $" + props.price.toFixed(2) + " a copy? This action cannot be undone.")
  const deletePurchase = api.purchase.deletePurchase.useMutation({
    onError: (error)=>{
      toast.error(error.message)
    },
    onSuccess: ()=>{
      toast.success("Successfully deleted Purchase!")
    }})

  function handleDeletePurchase(){
    if(props.purchaseId){
      deletePurchase.mutate({
        id: props.purchaseId
      })
      closeModal()
      props.onDelete(false)
    }
    else{
        toast.error("Unable to find purchase!")
    }
  }

  function closeModal(){
    setOpen(false)
    props.closeOut()
  }

  return (
      <>
        {open ? (
            <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
              <CardTitle heading="Delete Purchase..." subheading={message}></CardTitle>
              <div className="gap-5 flex flex-row justify-around px-4 py-4 sm:px-6">
                <SecondaryButton onClick={props.closeOut} buttonText="Cancel"></SecondaryButton>
                <PrimaryButton onClick={handleDeletePurchase} buttonText="Delete Purchase"></PrimaryButton>
              </div>
            </div>) : null}
      </>
  )
}

