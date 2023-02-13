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


interface SalesRecProp{
  salesRecId:  string
  date: string
  closeOut: () => void
}


export default function EditSalesRecModal(props:SalesRecProp) {
  const [open, setOpen] = useState(true)
  const [date, setDate] = useState(props.date)
  const [displayConfirmationView, setDisplayConfirmationView] = useState(false)
  const modifySaleRec = api.salesRec.modifySaleRec.useMutation()

  function closeModal(){
    setOpen(false)
    props.closeOut()
  }


  function editBook(){
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


  function openConfirmationView(){
    setDisplayConfirmationView(true)
  }

  function renderConfirmationView(){
    return <>
    {(displayConfirmationView) ?
        <CreateSaleEntries closeStateFunction={setDisplayConfirmationView} submitText="Confirm">
          <ConfirmCard onClose={closeConfirmationView} onConfirm={editBook} confirmHeading="Sales Reconciliation Edit Confirmation"
          confirmMessage="Confirm and Resubmit to make changes to Sale Reconciliation"></ConfirmCard></CreateSaleEntries> : null}
    </>;
  }
  function closeConfirmationView(){
    setDisplayConfirmationView(false)
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
        <SaveCardChanges closeModal={closeModal} saveModal={openConfirmationView}></SaveCardChanges>
        <div>
          {renderConfirmationView()}
        </div>
      </div>
      : null)
  )
}
