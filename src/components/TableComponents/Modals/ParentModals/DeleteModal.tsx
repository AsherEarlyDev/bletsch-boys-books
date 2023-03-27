import CardTitle from "../../../CardComponents/CardTitle";
import {Dispatch, SetStateAction, useState} from 'react';
import { api } from '../../../../utils/api';
import {toast} from "react-toastify";
import SecondaryButton from "../../../BasicComponents/SecondaryButton";
import PrimaryButton from "../../../BasicComponents/PrimaryButton";


interface DeleteProp{
  id:  string
  type: string
  closeOut: ()=>void
  onDelete: Dispatch<SetStateAction<boolean>>
  bookTitle: string
  quantity: number
  price: number
  deleteMutation: any
}


export default function DeleteModal(props:DeleteProp) {
  const [open, setOpen] = useState(true)
  const message = (`Are you sure you want to delete the record associated with buying ${props.quantity} copies of ${props.bookTitle} at $${props.price.toFixed(2)} a copy? This action cannot be undone.`)

  function closeModal(){
    setOpen(false)
    props.closeOut()
  }

  function handleDeleteBuyback(){
    if(props.id && props.deleteMutation){
      props.deleteMutation.mutate({
        id: props.id
      })
      closeModal()
      props.onDelete(false)
    }
    else{
        toast.error(`Unable to find ${props.type}!`)
    }
  }


  return (
      <>
        {open ? (
            <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
              <CardTitle heading={"Delete "+props.type+"..."} subheading={message}></CardTitle>
              <div className="gap-5 flex flex-row justify-around px-4 py-4 sm:px-6">
                <SecondaryButton onClick={props.closeOut} buttonText="Cancel"></SecondaryButton>
                <PrimaryButton onClick={handleDeleteBuyback} buttonText={"Delete "+props.type}></PrimaryButton>
              </div>
            </div>) : null}
      </>
  )
}

