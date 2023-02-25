import ImmutableCardProp from "../../../CardComponents/ImmutableCardProp";
import MutableCardProp from "../../../CardComponents/MutableCardProp";
import CardTitle from "../../../CardComponents/CardTitle";
import CardGrid from "../../../CardComponents/CardGrid";
import SaveCardChanges from "../../../CardComponents/SaveCardChanges";
import { useState } from 'react';
import { api } from '../../../../utils/api';
import { SalesRec } from "../../../../types/salesTypes";
import ConfirmCard from "../../../CardComponents/ConfirmationCard";
import CreateSaleEntries from '../../../CreateEntries';
import CreateEntries from "../../../CreateEntries";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface EditVendorCardProp{
  vendorId:  string
  vendorName: string
  buyback: number
  closeOut: () => void
}

export default function EditVendorModal(props:EditVendorCardProp) {
  const [open, setOpen] = useState(true)
  const [name, setName] = useState(props.vendorName)
  const [buyback, setBuyback] = useState(props.buyback)
  const editVendor = api.vendor.modifyVendor.useMutation({
    onError: (error)=>{
      toast.error(error.message)
    },
    onSuccess: ()=>{
      closeModal()
      toast.success("Successfully Modified Vendor!")
    }
  });


  function closeModal(){
    setOpen(false)
    props.closeOut()
  }

  function handleEditVendor(){
    if(props.vendorId && props.vendorName){
      try{
        editVendor.mutate({
          vendorId: props.vendorId,
          newName: name,
          buybackRate: buyback
        })
      }
      catch(error){
        console.log(error)
      }
    }
    else{
      alert("error")
    }
  }

  return (
      (open ?
          <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
            <CardTitle heading="Vendors" subheading="Confirm and validate vendor information below..."></CardTitle>
            <CardGrid>
              <ImmutableCardProp heading="Vendor ID" data={props.vendorId}></ImmutableCardProp>
              <ImmutableCardProp heading="Old Vendor Name" data={props.vendorName}></ImmutableCardProp>
              <MutableCardProp saveValue={setName} heading="New Vendor Name" required="True" dataType="string"></MutableCardProp>
              <ImmutableCardProp heading="Old Buyback Rate" data={props.buyback}></ImmutableCardProp>
              <div className="sm:col-span-1">
                <dt className="text-md font-medium text-gray-500">
                  <label htmlFor="New Buyback Rate">
                  New Buyback Rate
                  </label>
                </dt>
                <dd className="flex mt-1 text-sm text-gray-900 justify-center">
                  <input
                      placeholder={props.buyback.toString()}
                      type="number"
                      name="New Buyback Rate"
                      id="New Buyback Rate"
                      onChange={(e)=>setBuyback(parseFloat(e.currentTarget.value))}
                      min={0.0}
                      max={1.0}
                      step={0.1}
                      className="mt-1 p-1 block w-44 text-sm text-gray-900 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </dd>
              </div>
            </CardGrid>
            <SaveCardChanges closeModal={closeModal} saveModal={handleEditVendor}></SaveCardChanges>
          </div>
          : null)
  )
}
