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


interface BuybackDeleteProp{
  buybackId:  string,
  closeOut: ()=>void
  onDelete: Dispatch<SetStateAction<boolean>>
  bookTitle: string
  quantity: number
  price: number
}


export default function DeleteBuybackModal(props:BuybackDeleteProp) {
  const [open, setOpen] = useState(true)
  const message = ("Are you sure you want to delete the record associated with buying " + props.quantity + " copies of " + props.bookTitle + " at $" + props.price.toFixed(2) + " a copy? This action cannot be undone.")
  const deletePurchase = api.buyback.deleteBuyback.useMutation({
    onError: (error)=>{
      toast.error(error.message)
    },
    onSuccess: ()=>{
      toast.success("Successfully deleted Buyback!")
    }})

  function handleDeleteBuyback(){
    if(props.buybackId){
      deletePurchase.mutate({
        id: props.buybackId
      })
      closeModal()
      props.onDelete(false)
    }
    else{
        toast.error("Unable to find buyback!")
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
              <CardTitle heading="Delete Buyback..." subheading={message}></CardTitle>
              <div className="gap-5 flex flex-row justify-around px-4 py-4 sm:px-6">
                <SecondaryButton onClick={props.closeOut} buttonText="Cancel"></SecondaryButton>
                <PrimaryButton onClick={handleDeleteBuyback} buttonText="Delete Buyback"></PrimaryButton>
              </div>
            </div>) : null}
      </>
  )
}

