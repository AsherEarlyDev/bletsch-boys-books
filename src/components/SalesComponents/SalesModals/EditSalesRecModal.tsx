import ImmutableCardProp from "../../CardComponents/ImmutableCardProp";
import MutableCardProp from "../../CardComponents/MutableCardProp";
import CardTitle from "../../CardComponents/CardTitle";
import CardGrid from "../../CardComponents/CardGrid";
import SaveCardChanges from "../../CardComponents/SaveCardChanges";
import { useState } from 'react';
import { api } from '../../../utils/api';
import { SalesRec } from "../../../types/salesTypes";
import ConfirmCard from "../../CardComponents/ConfirmationCard";
import CreateSaleEntries from '../../CreateEntries';
import CreateEntries from "../../CreateEntries";


interface SalesRecProp{
  salesRecId:  string
  date: string
  closeOut: () => void
}


export default function EditSalesRecModal(props:SalesRecProp) {
  const [open, setOpen] = useState(true)
  const [date, setDate] = useState(props.date)
  const [confirm, setConfirm] = useState(false)
  const [displayConfirm, setDisplayConfirm] = useState(false)
  const modifySaleRec = api.salesRec.modifySaleRec.useMutation()


  function saveBook(){
    if (confirm){
      if(props.salesRecId && props.date){
        modifySaleRec.mutate({
          date: date,
          saleRecId: props.salesRecId
        })
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

  function closeModal(){
    setOpen(false)
    props.closeOut
  }

  function renderConfirmation(){
    return <>
    {(displayConfirm) ?
        <CreateEntries closeStateFunction={setDisplayConfirm} submitText="Confirm"> 
          <ConfirmCard onConfirm={setConfirm} confirmHeading="Sales Reconciliation Edit Confirmation"
          confirmMessage="Confirm and Resubmit to make changes to Sale Reconciliation"></ConfirmCard></CreateEntries> : null}
    </>;
      }

  return (
      (open ?
      <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
        <CardTitle heading="Sale Reconciliation" subheading="Confirm and validate Sales Reconciliation information below..."></CardTitle>
        <CardGrid>
          <ImmutableCardProp heading="Sale Reconciliation ID" data={props.salesRecId}></ImmutableCardProp>
          <MutableCardProp saveValue={setDate} heading="Date" required="True" dataType="string" 
          defaultValue={props.date}></MutableCardProp>
        </CardGrid>
        <SaveCardChanges closeModal={closeModal} saveModal={saveBook}></SaveCardChanges>
        <div>
          {renderConfirmation()}
        </div>
      </div>
      : null)
  )
}
