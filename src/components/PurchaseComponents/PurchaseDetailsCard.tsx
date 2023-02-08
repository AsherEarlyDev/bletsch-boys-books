import ImmutableCardProp from "../CardComponents/ImmutableCardProp";
import MutableCardProp from "../CardComponents/MutableCardProp";
import CardTitle from "../CardComponents/CardTitle";
import CardGrid from "../CardComponents/CardGrid";
import SaveCardChanges from "../CardComponents/SaveCardChanges";
import { useState } from 'react';
import { api } from '../../utils/api';
import CreateSaleEntries from '../CreateEntries';
import PrimaryButton from '../BasicComponents/PrimaryButton';
import { Purchase } from "../../types/purchaseTypes";
import PurchaseDeleteCard from "./PurchaseDeleteCard";
import ConfirmCard from "../CardComponents/ConfirmationCard";



interface PurchaseProp{
  purchaseComplete:  {
    purchase: Purchase
    subtotal: number
  }
  cardType: string
}


export default function PurchaseDetailsCard(props:PurchaseProp) {
  const [open, setOpen] = useState(true)
  const [isbn, setIsbn] = useState(props.purchaseComplete.purchase.bookId)
  const book = api.books.findInternalBook.useQuery({isbn: props.purchaseComplete.purchase.bookId}).data
  let title = ''
  if (book){
    title = book.title
  }
  const [quantity, setQuantity] = useState(props.purchaseComplete.purchase.quantity)
  const [price, setPrice] = useState(props.purchaseComplete.purchase.price)
  const [displayDelete, setDelete] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [displayConfirm, setDisplayConfirm] = useState(false)
  const modPurchase = api.purchase.modifyPurchase.useMutation()
  const addPurchase = api.purchase.createPurchase.useMutation()


  function saveBook(){
    if (confirm){
      if(props.purchaseComplete){
        if (props.cardType === 'edit'){
          modPurchase.mutate({
              id: props.purchaseComplete.purchase.id,
              purchaseOrderId: props.purchaseComplete.purchase.purchaseOrderId,
              isbn: isbn,
              quantity: quantity.toString(),
              price: price.toString()
          })
        }
        else{
          addPurchase.mutate({
              purchaseOrderId: props.purchaseComplete.purchase.purchaseOrderId,
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
    else{
      setDisplayConfirm(true)
    }
    
  }


  function renderDelete() {
    return <>
      {displayDelete ? <CreateSaleEntries closeStateFunction={setDelete} submitText='Delete Sale'>
            <PurchaseDeleteCard purchaseId={props.purchaseComplete.purchase.id}></PurchaseDeleteCard>
      </CreateSaleEntries>: null}
  </>;
  }

  function renderConfirmation(){
    return <>
    {(displayConfirm) ?
        <CreateSaleEntries closeStateFunction={setDisplayConfirm} submitText="Confirm"> 
          <ConfirmCard onConfirm={setConfirm} confirmHeading="Purchase Confirmation"
          confirmMessage="Confirm and Resubmit to make changes to Purchase"></ConfirmCard></CreateSaleEntries> : null}
    </>;
      }

  function handleDelete() {
    setDelete(true)
  }

  function closeModal(){
    setOpen(false)
  }

  return (
    (open ? (props.purchaseComplete ? (props.cardType === 'edit' ?
    <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
      <div className="flex-row ">
      <CardTitle heading="Purchase" subheading="Edit purchase below..."></CardTitle>
      <PrimaryButton buttonText="Delete Purchase" onClick={handleDelete}></PrimaryButton>
      </div>
      <CardGrid>
        <ImmutableCardProp heading="Purchase ID" data={props.purchaseComplete.purchase.id}></ImmutableCardProp>
        <ImmutableCardProp heading="Subtotal" data={props.purchaseComplete.subtotal}></ImmutableCardProp>
        <ImmutableCardProp heading="Book Title" data={title}></ImmutableCardProp>
        <MutableCardProp saveValue={setIsbn} heading="Book ISBN" required="True" dataType="string" 
        defaultValue={props.purchaseComplete.purchase.bookId}></MutableCardProp>
        <MutableCardProp saveValue={setQuantity} heading="Quantity" required="True" dataType="string" 
        defaultValue={props.purchaseComplete.purchase.quantity}></MutableCardProp>
        <MutableCardProp saveValue={setPrice} heading="Price" required="True" dataType="string" 
        defaultValue={props.purchaseComplete.purchase.price}></MutableCardProp>
      </CardGrid>
      <SaveCardChanges closeModal={closeModal} saveBook={saveBook}></SaveCardChanges>
      <div>
        {renderDelete()}
        {renderConfirmation()}
      </div>
    </div>
    : <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
    <div className="flex-row ">
    <CardTitle heading="Purchase" subheading="Add purchase information below..."></CardTitle>
    </div>
    <CardGrid>
      <ImmutableCardProp heading="Purchase ID" data={props.purchaseComplete.purchase.id}></ImmutableCardProp>
      <ImmutableCardProp heading="Subtotal" data={props.purchaseComplete.subtotal}></ImmutableCardProp>
      <ImmutableCardProp heading="Book Title" data={title}></ImmutableCardProp>
      <MutableCardProp saveValue={setIsbn} heading="Book ISBN" required="True" dataType="string" 
      defaultValue={props.purchaseComplete.purchase.bookId}></MutableCardProp>
      <MutableCardProp saveValue={setQuantity} heading="Quantity" required="True" dataType="string" 
      defaultValue={props.purchaseComplete.purchase.quantity}></MutableCardProp>
      <MutableCardProp saveValue={setPrice} heading="Price" required="True" dataType="string" 
      defaultValue={props.purchaseComplete.purchase.price}></MutableCardProp>
    </CardGrid>
    <SaveCardChanges closeModal={closeModal} saveBook={saveBook}></SaveCardChanges>
    <div>
        {renderConfirmation()}
      </div>
    <div>
    </div>
  </div>) : null) : null)
)
}
