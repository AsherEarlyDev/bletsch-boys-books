import ImmutableCardProp from "../CardComponents/ImmutableCardProp";
import MutableCardProp from "../CardComponents/MutableCardProp";
import CardTitle from "../CardComponents/CardTitle";
import CardGrid from "../CardComponents/CardGrid";
import SaveCardChanges from "../CardComponents/SaveCardChanges";
import { useState } from 'react';
import { api } from '../../utils/api';
import { SalesRec } from "../../types/salesTypes";


interface SaleDeleteProp{
  salesId:  string,
  onClose: (close: boolean)=>void
}


export default function SaleDeleteCard(props:SaleDeleteProp) {
  const [open, setOpen] = useState(true)
  const deleteSale = api.sales.deleteSale.useMutation()


  function saveBook(){
    if(props.salesId){
      deleteSale.mutate({
        id: props.salesId
      })
      closeModal()
      props.onClose(false)
    }
    else{
      alert("Error")
    }
  }

  function closeModal(){
    setOpen(false)
  }

  return (
      (open ? (props.salesId ?
      <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
        <CardTitle heading="Sale" subheading="Confirm to delete this Sale"></CardTitle>
        <SaveCardChanges closeModal={closeModal} saveModal={saveBook}></SaveCardChanges>
      </div>
      : null) : null)
  )
}
