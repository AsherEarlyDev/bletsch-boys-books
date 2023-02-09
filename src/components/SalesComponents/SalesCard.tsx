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
import ConfirmCard from "../CardComponents/ConfirmationCard";



interface SalesProp{
  sale:  Sale
  cardType: string
}


export default function SaleDetailsCard(props:SalesProp) {
  const [open, setOpen] = useState(true)
  const [isbn, setIsbn] = useState(props.sale.bookId)
  const book = api.books.findInternalBook.useQuery({isbn: props.sale.bookId}).data
  let title = ''
  if (book){
    title = book.title
  }
  const [quantity, setQuantity] = useState(props.sale.quantity)
  const [price, setPrice] = useState(props.sale.price)
  const [displayDelete, setDelete] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [displayConfirm, setDisplayConfirm] = useState(false)
  const modSale = api.sales.modifySale.useMutation()
  const addSale = api.sales.createSale.useMutation()


  function saveBook(){
    if (confirm){
      if(props.sale){
        if (props.cardType === 'edit'){
          modSale.mutate({
            id: props.sale.id,
            saleReconciliationId: props.sale.saleReconciliationId,
            isbn: isbn,
            quantity: quantity.toString(),
            price: price.toString()
          })
        }
        else{
          addSale.mutate({
            saleReconciliationId: props.sale.saleReconciliationId,
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
        <SaleDeleteCard onClose={setOpen} salesId={props.sale.id}></SaleDeleteCard>
      </CreateSaleEntries>: null}
    </>;
  }

  function renderConfirmation(){
    return <>
      {(displayConfirm) ?
          <CreateSaleEntries closeStateFunction={setDisplayConfirm} submitText="Confirm">
            <ConfirmCard onConfirm={setConfirm} confirmHeading="Sale Confirmation"
                         confirmMessage="Confirm and Resubmit to make changes to Sale"></ConfirmCard></CreateSaleEntries> : null}
    </>;
  }

  function handleDelete() {
    setDelete(true)
  }

  function closeModal(){
    setOpen(false)
  }

  return (
      (open ? (props.sale ? (props.cardType==='edit' ?
          <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
            <div className="flex-row ">
              <CardTitle heading="Sale" subheading="Edit sale below..."></CardTitle>
              <PrimaryButton buttonText="Delete Sale" onClick={handleDelete}></PrimaryButton>
            </div>
            <CardGrid>
              <ImmutableCardProp heading="Sale ID" data={props.sale.id}></ImmutableCardProp>
              <ImmutableCardProp heading="Subtotal" data={props.sale.subtotal}></ImmutableCardProp>
              <ImmutableCardProp heading="Book Title" data={title}></ImmutableCardProp>
              <MutableCardProp saveValue={setIsbn} heading="Book ISBN" required="True" dataType="string"
                               defaultValue={props.sale.bookId}></MutableCardProp>
              <MutableCardProp saveValue={setQuantity} heading="Quantity" required="True" dataType="string"
                               defaultValue={props.sale.quantity}></MutableCardProp>
              <MutableCardProp saveValue={setPrice} heading="Price" required="True" dataType="string"
                               defaultValue={props.sale.price}></MutableCardProp>
            </CardGrid>
            <SaveCardChanges closeModal={closeModal} saveBook={saveBook}></SaveCardChanges>
            <div>
              {renderDelete()}
              {renderConfirmation()}
            </div>
          </div>
          : <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
            <div className="flex-row ">
              <CardTitle heading="Sale" subheading="Add sale information below..."></CardTitle>
            </div>
            <CardGrid>
              <ImmutableCardProp heading="Sale ID" data={props.sale.id}></ImmutableCardProp>
              <ImmutableCardProp heading="Subtotal" data={props.sale.subtotal}></ImmutableCardProp>
              <ImmutableCardProp heading="Book Title" data={title}></ImmutableCardProp>
              <MutableCardProp saveValue={setIsbn} heading="Book ISBN" required="True" dataType="string"
                               defaultValue={props.sale.bookId}></MutableCardProp>
              <MutableCardProp saveValue={setQuantity} heading="Quantity" required="True" dataType="string"
                               defaultValue={props.sale.quantity}></MutableCardProp>
              <MutableCardProp saveValue={setPrice} heading="Price" required="True" dataType="string"
                               defaultValue={props.sale.price}></MutableCardProp>
            </CardGrid>
            <SaveCardChanges closeModal={closeModal} saveModal={saveBook}></SaveCardChanges>
            <div>
              {renderConfirmation()}
            </div>
          </div>) : null): null)
  )
}