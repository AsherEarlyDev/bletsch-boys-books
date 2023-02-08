import ImmutableCardProp from "../CardComponents/ImmutableCardProp";
import MutableCardProp from "../CardComponents/MutableCardProp";
import CardTitle from "../CardComponents/CardTitle";
import CardGrid from "../CardComponents/CardGrid";
import SaveCardChanges from "../CardComponents/SaveCardChanges";
import { useState } from 'react';
import { api } from '../../utils/api';
import { SalesRec } from "../../types/salesTypes";


interface SalesRecProp{
  salesRecId:  string
  cardType: string
  date: string
}


export default function SalesRecCard(props:SalesRecProp) {
  const [open, setOpen] = useState(true)
  const [date, setDate] = useState(props.date)
  const newSaleRec = api.salesRec.createSaleRec.useMutation()
  const modifySaleRec = api.salesRec.modifySaleRec.useMutation()


  function saveBook(){
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

  function closeModal(){
    setOpen(false)
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
        <SaveCardChanges closeModal={closeModal} saveBook={saveBook}></SaveCardChanges>
      </div>
      : null)
  )
}
