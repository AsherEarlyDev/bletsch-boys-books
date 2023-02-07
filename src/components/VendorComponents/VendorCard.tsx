import ImmutableCardProp from "../CardComponents/ImmutableCardProp";
import MutableCardProp from "../CardComponents/MutableCardProp";
import CardTitle from "../CardComponents/CardTitle";
import CardGrid from "../CardComponents/CardGrid";
import SaveCardChanges from "../CardComponents/SaveCardChanges";
import { useState } from 'react';
import { api } from '../../utils/api';
import { SalesRec } from "../../types/salesTypes";


interface VendorProp{
  vendorId:  string
  cardType: string
  vendorName: string
}


export default function VendorCard(props:VendorProp) {
  const [open, setOpen] = useState(true)
  const [name, setName] = useState(props.vendorName)
  const editVendor = api.vendor.modifyVendor.useMutation();
  const deleteVendor = api.vendor.deleteVendor.useMutation();



  function saveBook(){
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
      </div>
      : 
      <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
        <CardTitle heading="Vendors" subheading="Are you sure you want to delete this vendor?"></CardTitle>
        <CardGrid>
          <ImmutableCardProp heading="Vendor ID" data={props.vendorId}></ImmutableCardProp>
          <ImmutableCardProp heading="Vendor Name" data={props.vendorName}></ImmutableCardProp>
        </CardGrid>
        <SaveCardChanges closeModal={closeModal} saveBook={saveBook}></SaveCardChanges>
      </div>
      
      ): null)
  )
}
