import {Dispatch, SetStateAction, useState} from 'react';
import { api } from '../../../../../utils/api';
import {toast} from "react-toastify";
import DeleteModal from "../../ParentModals/DeleteModal";


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
      <DeleteModal 
      id={props.buybackId} 
      type={"Buyback"} 
      closeOut={props.closeOut} 
      onDelete={props.onDelete} 
      bookTitle={props.bookTitle} 
      quantity={props.quantity} 
      price={props.price} 
      handleDelete={handleDeleteBuyback} 
      open={open}      
      ></DeleteModal>
  )
}

