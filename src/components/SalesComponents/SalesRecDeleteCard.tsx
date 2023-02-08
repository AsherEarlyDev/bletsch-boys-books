import ImmutableCardProp from "../CardComponents/ImmutableCardProp";
import MutableCardProp from "../CardComponents/MutableCardProp";
import CardTitle from "../CardComponents/CardTitle";
import CardGrid from "../CardComponents/CardGrid";
import SaveCardChanges from "../CardComponents/SaveCardChanges";
import { useState } from 'react';
import { api } from '../../utils/api';
import { SalesRec } from "../../types/salesTypes";


interface SalesRecDeleteProp{
  salesRecId:  string
  cardType: string
}


export default function SalesRecDeleteCard(props:SalesRecDeleteProp) {
  const [open, setOpen] = useState(true)
  const deleteSaleRec = api.salesRec.deleteSaleRec.useMutation()


  function saveBook(){
    if(props.salesRecId){
      deleteSaleRec.mutate({
        saleRecId: props.salesRecId
      })
      closeModal()
    }
    else{
      alert("Error")
    }
  }

  function closeModal(){
    setOpen(false)
  }

  return (
      (open ? (props.salesRecId ?
      <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
        <CardTitle heading="Sale Reconciliation" subheading="Confirm to delete this Sale Reconciliation"></CardTitle>
        <SaveCardChanges closeModal={closeModal} saveBook={saveBook}></SaveCardChanges>
      </div>
      : null) : null)
  )
}
