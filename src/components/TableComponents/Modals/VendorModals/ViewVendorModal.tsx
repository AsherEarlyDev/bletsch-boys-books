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
import SecondaryButton from "../../../BasicComponents/SecondaryButton";
import PrimaryButton from "../../../BasicComponents/PrimaryButton";

interface ViewVendorModalProp{
  vendorId:  string
  vendorName: string
  closeOut: () => void
  openEdit: (id: string) => void
}

export default function ViewVendorModal(props:ViewVendorModalProp) {
  const [open, setOpen] = useState(true)


  function closeModal(){
    setOpen(false)
    props.closeOut()
  }

  function openEdit(){
    props.openEdit(props.vendorId)
    props.closeOut()
  }

  return (
      (open ?
          <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
            <CardTitle heading="Vendors" subheading="Confirm and validate vendor information below..."></CardTitle>
            <CardGrid>
              <ImmutableCardProp heading="Vendor ID" data={props.vendorId}></ImmutableCardProp>
              <ImmutableCardProp heading="Vendor Name" data={props.vendorName}></ImmutableCardProp>
            </CardGrid>
            <div className="gap-5 flex flex-row justify-around px-4 py-8 sm:px-6">
              <SecondaryButton onClick={closeModal} buttonText="Exit"></SecondaryButton>
              <PrimaryButton onClick={openEdit} buttonText="Edit Vendor"></PrimaryButton>
            </div>
          </div>
          : null)
  )
}
