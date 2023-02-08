import ImmutableCardProp from "../CardComponents/ImmutableCardProp";
import MutableCardProp from "../CardComponents/MutableCardProp";
import CardTitle from "../CardComponents/CardTitle";
import CardGrid from "../CardComponents/CardGrid";
import SaveCardChanges from "../CardComponents/SaveCardChanges";
import { useState } from 'react';
import { api } from '../../utils/api';
import { SalesRec } from "../../types/salesTypes";
import ConfirmCard from "../CardComponents/ConfirmationCard";
import CreateSaleEntries from '../CreateEntries';
import CreateEntries from "../CreateEntries";


interface EditVendorCardProp{
  vendorId:  string
  vendorName: string
  closeOut: () => void
  newName: (string) => void
}


export default function EditVendorCard(props:EditVendorCardProp) {
  const [open, setOpen] = useState(true)
  const [name, setName] = useState(props.vendorName)
  const editVendor = api.vendor.modifyVendor.useMutation();


  function closeModal(){
    setOpen(false)
    props.closeOut()
  }

  function saveVendor(){
    if(props.vendorId && props.vendorName){
      editVendor.mutate({
        vendorId: props.vendorId,
        newName: name
      })
      props.newName(name)
      closeModal()
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
            </CardGrid>
            <SaveCardChanges closeModal={closeModal} saveModal={saveVendor}></SaveCardChanges>
          </div>
          : null)
  )
}
