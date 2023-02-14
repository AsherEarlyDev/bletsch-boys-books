import CardTitle from "../../../CardComponents/CardTitle";
import SaveCardChanges from "../../../CardComponents/SaveCardChanges";
import { api } from '../../../../utils/api';
import SecondaryButton from "../../../BasicComponents/SecondaryButton";
import PrimaryButton from "../../../BasicComponents/PrimaryButton";
import {useState} from "react";
import {editableBook} from "../../../../types/bookTypes";


interface DeleteBookProp{
  bookInfo:  editableBook | undefined
  closeOut: () => void
}


export default function DeleteBookModal(props:DeleteBookProp) {
  const deleteBook = api.books.deleteBookByISBN.useMutation();
  const [open, setOpen] = useState(true)
  const message = ("Are you sure you want to delete " + props.bookInfo.title + " from the book database? This action cannot be undone.")

  function closeModal(){
    setOpen(false)
    props.closeOut()
  }

  function handleDeleteVendor(){
    if(props.bookInfo.isbn){
      deleteBook.mutate(props.bookInfo.isbn)
      closeModal()
    }
    else{
        alert("error")
      }
  }

  return (
      <>
        {open ? (
            <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
              <CardTitle heading="Delete Vendor..." subheading={message}></CardTitle>
              <div className="gap-5 flex flex-row justify-around px-4 py-4 sm:px-6">
                <SecondaryButton onClick={props.closeOut} buttonText="Cancel"></SecondaryButton>
                <PrimaryButton onClick={handleDeleteVendor}
                               buttonText="Delete Vendor"></PrimaryButton>
              </div>
            </div>) : null}
      </>
  )
}
