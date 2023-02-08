import ImmutableCardProp from "../CardComponents/ImmutableCardProp";
import MutableCardProp from "../CardComponents/MutableCardProp";
import CardTitle from "../CardComponents/CardTitle";
import CardGrid from "../CardComponents/CardGrid";
import SaveCardChanges from "../CardComponents/SaveCardChanges";
import { useState } from 'react';
import { api } from '../../utils/api';
import { SalesRec } from "../../types/salesTypes";
import PrimaryButton from "../BasicComponents/PrimaryButton";
import SecondaryButton from "../BasicComponents/SecondaryButton";


interface ConfirmCardProp{
    onConfirm: (confirm: boolean) => void
    confirmMessage: string
    confirmHeading: string
  }


export default function ConfirmCard(props:ConfirmCardProp) {
  const [open, setOpen] = useState(true)


  function handleClick(){
    props.onConfirm(true)
    closeModal()
  }


  function closeModal(){
    setOpen(false)
  }

  return (
      (open ? (props.onConfirm ?
      <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
        <CardTitle heading={props.confirmHeading} subheading={props.confirmMessage}></CardTitle>
        <div className="gap-5 flex flex-row justify-around px-4 py-8 sm:px-6">
        <SecondaryButton onClick={closeModal} buttonText="Cancel Changes"></SecondaryButton>
        <PrimaryButton onClick={handleClick} buttonText='Save Changes'></PrimaryButton>
      </div>
      </div>
      : null) : null)
  )
}
