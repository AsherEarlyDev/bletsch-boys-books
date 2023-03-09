import CardTitle from "../../../CardComponents/CardTitle";
import { useState } from 'react';
import { api } from '../../../../utils/api';
import SecondaryButton from "../../../BasicComponents/SecondaryButton";
import PrimaryButton from "../../../BasicComponents/PrimaryButton";
import {toast} from "react-toastify";


interface DeleteOrderModalProp{
  id:  string
  deleteMutation: any
  type: string
  closeOut: () => void
}


export default function DeleteOrderModal(props:DeleteOrderModalProp) {
  let deleteMutation = props.deleteMutation.useMutation({
    onError: (error)=>{
      toast.error(`Unable to delete ${props.type}! ${error.message}!`)
    },
    onSuccess: ()=>{
      window.location.reload()
    }})
  const [open, setOpen] = useState(true)
  
  const message = (`Are you sure you want to delete this ${props.type} Order from the database? This action cannot be undone. All associated ${props.type.toLowerCase()}s will be deleted.`)

  function closeModal(){
    setOpen(false)
    props.closeOut()
  }

  function handleDeleteOrder(){
    if(props.id){
      deleteMutation.mutate({
        id: props.id
      })
      closeModal()
    }
    else{
      toast.error("No "+props.type+" found!")
    }
  }

  return (
      ((open && props.id) ?
      <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
        <CardTitle heading={"Delete "+props.type+" Order..."} subheading={message}></CardTitle>
        <div className="gap-5 flex flex-row justify-around px-4 py-4 sm:px-6">
          <SecondaryButton onClick={props.closeOut} buttonText="Cancel"></SecondaryButton>
          <PrimaryButton onClick={handleDeleteOrder} buttonText={"Delete "+props.type+" Order..."}></PrimaryButton>
        </div>
      </div>
      : null)
  )
}
