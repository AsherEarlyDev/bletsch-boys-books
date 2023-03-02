import CardTitle from "../../../CardComponents/CardTitle";
import SaveCardChanges from "../../../CardComponents/SaveCardChanges";
import { api } from '../../../../utils/api';
import SecondaryButton from "../../../BasicComponents/SecondaryButton";
import PrimaryButton from "../../../BasicComponents/PrimaryButton";
import {useState} from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface DeleteSalesRecProp{
  salesRecId:  string
  closeOut: () => void
}


export default function DeleteSalesRecModal(props:DeleteSalesRecProp) {
  const [open, setOpen] = useState(true)
  const deleteSaleRec = api.salesRec.deleteSaleRec.useMutation({
    onError: (error)=>{
    toast.error(error.message)
  },
  onSuccess: ()=>{
    toast.success("Successfully deleted Sale Reconciliation!")
  }})
  const message = ("Are you sure you want to delete this Sales Reconciliation? This action cannot be undone. All associated sales will be deleted.")

  function closeModal(){
    setOpen(false)
    props.closeOut()
  }

  function handleDeleteSalesRec(){
    if(props.salesRecId){
      deleteSaleRec.mutate({
        saleRecId: props.salesRecId
      })
      closeModal()
    }
    else{
      window.location.reload()
    }
  }

  return (
      <>
        {open ? (
            <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
              <CardTitle heading="Delete Sales Reconciliation..." subheading={message}></CardTitle>
              <div className="gap-5 flex flex-row justify-around px-4 py-4 sm:px-6">
                <SecondaryButton onClick={props.closeOut} buttonText="Cancel"></SecondaryButton>
                <PrimaryButton onClick={handleDeleteSalesRec} buttonText="Delete Sales Rec."></PrimaryButton>
              </div>
            </div>) : null}
      </>
  )
}
