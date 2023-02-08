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


interface VendorProp{
  vendorId:  string
  cardType: string
  vendorName: string
}


export default function VendorCard(props:VendorProp) {
  const [open, setOpen] = useState(true)
  const [name, setName] = useState(props.vendorName)
  const [confirm, setConfirm] = useState(false)
  const [displayConfirm, setDisplayConfirm] = useState(false)
  const editVendor = api.vendor.modifyVendor.useMutation();
  const deleteVendor = api.vendor.deleteVendor.useMutation();



  function saveBook(){
    if (confirm){

      if(props.vendorId && props.vendorName){
        if (props.cardType === 'edit'){
          editVendor.mutate({
            vendorId: props.vendorId,
            newName: name
          })
        }
        else{
          deleteVendor.mutate({
            vendorId: props.vendorId
          })
        }
        closeModal()
      }
      else{
        alert("error")
      }
    }
    else{
      setDisplayConfirm(true)
    }
  }

  function renderConfirmation(){
    return <>
    {(displayConfirm) ?
        <CreateEntries closeStateFunction={setDisplayConfirm} submitText="Confirm"> 
          <ConfirmCard onConfirm={setConfirm} confirmHeading="Vendor Edit Confirmation"
          confirmMessage="Confirm and Resubmit to make changes to Vendor"></ConfirmCard></CreateEntries> : null}
    </>;
      }


  function closeModal(){
    setOpen(false)
  }

  return (
      (open ? ( props.cardType === 'edit' ?
      <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
        <CardTitle heading="Vendors" subheading="Confirm and validate vendor information below..."></CardTitle>
        <CardGrid>
          <ImmutableCardProp heading="Vendor ID" data={props.vendorId}></ImmutableCardProp>
          <MutableCardProp saveValue={setName} heading="Name" required="True" dataType="string" 
          defaultValue={props.vendorName}></MutableCardProp>
        </CardGrid>
        <SaveCardChanges closeModal={closeModal} saveBook={saveBook}></SaveCardChanges>
        <div>
          {renderConfirmation()}
        </div>
      </div>
      : 
      <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
        <CardTitle heading="Vendors" subheading="Confirm to delete this vendor."></CardTitle>
        <SaveCardChanges closeModal={closeModal} saveBook={saveBook}></SaveCardChanges>
      </div>
      
      ): null)
  )
}
