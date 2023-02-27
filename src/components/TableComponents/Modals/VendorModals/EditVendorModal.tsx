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
      let buybackVal: number = props.buyback
      if (typeof(buyback) === "string"){
        buybackVal = parseFloat(buyback)
      }
      try{
        editVendor.mutate({
          vendorId: props.vendorId,
          newName: name,
          buybackRate: buybackVal
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
              <MutableCardProp saveValue={setBuyback} heading="New Buyback Rate" required="True" dataType="number"></MutableCardProp>
            </CardGrid>
            <SaveCardChanges closeModal={closeModal} saveModal={handleEditVendor}></SaveCardChanges>
          </div>
          : null)
  )
}
