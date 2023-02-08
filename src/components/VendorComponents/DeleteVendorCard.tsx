import CardTitle from "../CardComponents/CardTitle";
import SaveCardChanges from "../CardComponents/SaveCardChanges";
import { api } from '../../utils/api';
import SecondaryButton from "../BasicComponents/SecondaryButton";
import PrimaryButton from "../BasicComponents/PrimaryButton";
import {useState} from "react";


interface DeleteVendorProp{
  vendorId:  string
  vendorName: string
  closeOut: () => void
}


export default function DeleteVendorCard(props:DeleteVendorProp) {
  const deleteVendor = api.vendor.deleteVendor.useMutation();
  const [open, setOpen] = useState(true)
  const message = ("Are you sure you want to delete " + props.vendorName + " from the vendor database? This action cannot be undone.")

  function closeModal(){
    setOpen(false)
    props.closeOut()
  }

  function handleDeleteVendor(){
    if(props.vendorId){
      deleteVendor.mutate({
        vendorId: props.vendorId
      })
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
