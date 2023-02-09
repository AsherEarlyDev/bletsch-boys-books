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


interface SalesRecProp{
  salesRecId:  string
  cardType: string
  date: string
}


export default function SalesRecCard(props:SalesRecProp) {
  const [open, setOpen] = useState(true)
  const [date, setDate] = useState(props.date)
  const [confirm, setConfirm] = useState(false)
  const [displayConfirm, setDisplayConfirm] = useState(false)
  const newSaleRec = api.salesRec.createSaleRec.useMutation()
  const modifySaleRec = api.salesRec.modifySaleRec.useMutation()


  function saveBook(){
    if (confirm){
      if(props.salesRecId && props.date){
        if (props.cardType === "entry"){
          newSaleRec.mutate({date: props.date})
        }
        else{
          modifySaleRec.mutate({
              date: date,
              saleRecId: props.salesRecId
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

  function closeModal(){
    setOpen(false)
  }

  function renderConfirmation(){
    return <>
    {(displayConfirm) ?
        <CreateSaleEntries closeStateFunction={setDisplayConfirm} submitText="Confirm"> 
          <ConfirmCard onConfirm={setConfirm} confirmHeading="Sales Reconciliation Edit Confirmation"
          confirmMessage="Confirm and Resubmit to make changes to Sale Reconciliation"></ConfirmCard></CreateSaleEntries> : null}
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
          {props.cardType === 'edit' ? renderConfirmation(): null}
        </div>
      </div>
      : null)
  )
}
