import CardTitle from "../../../CardComponents/CardTitle";
import SaveCardChanges from "../../../CardComponents/SaveCardChanges";
import { api } from '../../../../utils/api';
import SecondaryButton from "../../../BasicComponents/SecondaryButton";
import PrimaryButton from "../../../BasicComponents/PrimaryButton";
import {useState} from "react";
import {editableBook} from "../../../../types/bookTypes";
import { toast } from "react-toastify";

interface DeleteCaseProp{
  bookCase;
  closeOut: () => void
}


export default function DeleteCaseModal(props:DeleteCaseProp) {
  const deleteBookCase = api.bookCase.deleteCase.useMutation({
    onSuccess: ()=>{
      window.location.reload()
    },
    onError: (error)=>{
      toast.error("Unable to delete book case!")
    }
  });
  const [open, setOpen] = useState(true)
  const message = ("Are you sure you want to delete " + props.bookCase.name + " from the book case database? This action cannot be undone.")

  function closeModal(){
    setOpen(false)
    props.closeOut()
  }

  function handleDeleteBookCase(){
    if(props.bookCase.name){
      deleteBookCase.mutate(props.bookCase.name)
      closeModal()
    }
    else{
        toast.error("error")
      }
  }

  return (
      <>
        {open ? (
            <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
              <CardTitle heading="Delete Book..." subheading={message}></CardTitle>
              <div className="gap-5 flex flex-row justify-around px-4 py-4 sm:px-6">
                <SecondaryButton onClick={props.closeOut} buttonText="Cancel"></SecondaryButton>
                <PrimaryButton onClick={handleDeleteBookCase}
                               buttonText="Delete BookCase"></PrimaryButton>
              </div>
            </div>) : null}
      </>
  )
}