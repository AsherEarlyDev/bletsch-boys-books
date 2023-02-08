import ImmutableCardProp from "../CardComponents/ImmutableCardProp";
import MutableCardProp from "../CardComponents/MutableCardProp";
import CardTitle from "../CardComponents/CardTitle";
import CardGrid from "../CardComponents/CardGrid";
import SaveCardChanges from "../CardComponents/SaveCardChanges";
import { useState } from 'react';
import { api } from '../../utils/api';
import { Sale, SalesRec } from "../../types/salesTypes";
import SaleDeleteCard from "./SaleDeleteCard";
import CreateSaleEntries from '../CreateEntries';
import PrimaryButton from '../BasicComponents/PrimaryButton';



interface SalesProp{
  saleComplete:  {
    sale: Sale
    subtotal: number
  }
  cardType: string
}


export default function SaleDetailsCard(props:SalesProp) {
  const [open, setOpen] = useState(true)
  const [isbn, setIsbn] = useState(props.saleComplete.sale.bookId)
  const [quantity, setQuantity] = useState(props.saleComplete.sale.quantity)
  const [price, setPrice] = useState(props.saleComplete.sale.price)
  const [displayDelete, setDelete] = useState(false)
  const modSale = api.sales.modifySale.useMutation()
  const addSale = api.sales.createSale.useMutation()


  function saveBook(){
    if(props.saleComplete){
      if (props.cardType === 'edit'){
        modSale.mutate({
            id: props.saleComplete.sale.id,
            saleReconciliationId: props.saleComplete.sale.saleReconciliationId,
            isbn: isbn,
            quantity: quantity.toString(),
            price: price.toString()
        })
      }
      else{
        addSale.mutate({
            saleReconciliationId: props.saleComplete.sale.saleReconciliationId,
            isbn: isbn,
            quantity: quantity.toString(),
            price: price.toString()
        })
      }
      closeModal()
    }
    else{
      alert("Error")
    }
  }

  function renderDelete() {
    return <>
      {displayDelete ? <CreateSaleEntries submitText='Delete Sale'>
            <SaleDeleteCard salesId={props.saleComplete.sale.id}></SaleDeleteCard>
      </CreateSaleEntries>: null}
  </>;
  }

  function handleDelete() {
    setDelete(true)
  }

  function closeModal(){
    setOpen(false)
  }

  return (
    (open ? (props.saleComplete ?
    <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
      <div className="flex-row ">
      <CardTitle heading="Sale Reconciliation" subheading="Edit sale below..."></CardTitle>
      <PrimaryButton buttonText="Delete Sale" onClick={handleDelete}></PrimaryButton>
      </div>
      <CardGrid>
        <ImmutableCardProp heading="Sale ID" data={props.saleComplete.sale.id}></ImmutableCardProp>
        <ImmutableCardProp heading="Subtotal" data={props.saleComplete.subtotal}></ImmutableCardProp>
        <MutableCardProp saveValue={setIsbn} heading="Book ISBN" required="True" dataType="string" 
        defaultValue={props.saleComplete.sale.bookId}></MutableCardProp>
        <MutableCardProp saveValue={setQuantity} heading="Quantity" required="True" dataType="string" 
        defaultValue={props.saleComplete.sale.quantity}></MutableCardProp>
        <MutableCardProp saveValue={setPrice} heading="Price" required="True" dataType="string" 
        defaultValue={props.saleComplete.sale.price}></MutableCardProp>
      </CardGrid>
      <SaveCardChanges closeModal={closeModal} saveBook={saveBook}></SaveCardChanges>
      <div>
        {renderDelete()}
      </div>
    </div>
    : null) : null)
)
}
