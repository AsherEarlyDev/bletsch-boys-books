import ImmutableCardProp from "../../../CardComponents/ImmutableCardProp";
import MutableCardProp from "../../../CardComponents/MutableCardProp";
import CardTitle from "../../../CardComponents/CardTitle";
import CardGrid from "../../../CardComponents/CardGrid";
import SaveCardChanges from "../../../CardComponents/SaveCardChanges";
import { SetStateAction, useState } from 'react';
import { api } from '../../../../utils/api';
import CreateSaleEntries from '../../../CreateEntries';
import PrimaryButton from '../../../BasicComponents/PrimaryButton';
import { Purchase } from "../../../../types/purchaseTypes";
import DeletePurchaseOrderModal from "./DeletePurchaseOrderModal";
import ConfirmCard from "../../../CardComponents/ConfirmationCard";
import CreateEntries from "../../../CreateEntries";
import SaleDeleteCard from "../../../SalesComponents/SaleDeleteCard";
import BookCardProp from "../../../CardComponents/BookCardProp";



interface ViewPurchaseModalProp {
  purchase: Purchase
  cardType: string
  closeOut: () => void
}


export default function ViewPurchaseModal(props:ViewPurchaseModalProp) {
  const [open, setOpen] = useState(true)
  const [isbn, setIsbn] = useState(props.purchase.bookId)
  const book = api.books.findInternalBook.useQuery({isbn: props.purchase.bookId}).data
  let title = ''
  if (book){
    title = book.title
  }
  const [quantity, setQuantity] = useState(props.purchase.quantity)
  const [price, setPrice] = useState(props.purchase.price)
  const [displayDeletePurchaseView, setDisplayDeletePurchaseView] = useState(false)
  const [displayConfirmationView, setDisplayConfirmationView] = useState(false)
  const modPurchase = api.purchase.modifyPurchase.useMutation()
  const addPurchase = api.purchase.createPurchase.useMutation()

  function closeModal(){
    setOpen(false)
    // props.closeOut()
  }

  function editPurchase(){
    if(props.purchase){
      if (props.cardType === 'edit'){
        modPurchase.mutate({
          id: props.purchase.id,
          purchaseOrderId: props.purchase.purchaseOrderId,
          isbn: isbn,
          quantity: quantity.toString(),
          price: price.toString()
        })
      }
      else{
        addPurchase.mutate({
          purchaseOrderId: props.purchase.purchaseOrderId,
          isbn: isbn,
          quantity: quantity.toString(),
          price: price.toString()
        })
      }
      closeModal()
    }
  }

  function openConfirmationView(){
    setDisplayConfirmationView(true)
  }
  function renderConfirmationView(){
    return <>
      {(displayConfirmationView) ?
          <CreateSaleEntries closeStateFunction={setDisplayConfirmationView} submitText="Confirm">
            <ConfirmCard onClose={closeConfirmationView} onConfirm={editPurchase} confirmHeading="Purchase Edit Confirmation"
                         confirmMessage="Confirm to make changes to a Purchase"></ConfirmCard></CreateSaleEntries> : null}
    </>;
  }
  function closeConfirmationView(){
    setDisplayConfirmationView(false)
  }

  function openDeletePurchaseView() {
    setDisplayDeletePurchaseView(true)
  }
  function renderDeleteSaleView() {
    return <>
      {displayDeletePurchaseView ? <CreateEntries closeStateFunction={setDisplayDeletePurchaseView} submitText='Delete Sale'>
        <DeletePurchaseOrderModal closeOut={closeDeletePurchaseView} purchaseId={props.purchase.id}></DeletePurchaseOrderModal>
      </CreateEntries>: null}
    </>;
  }
  function closeDeletePurchaseView(){
    setDisplayDeletePurchaseView(false)
  }


  return (
    ((open && props.purchase) ? (props.cardType === 'edit' ?
    <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
      <div className="flex-row ">
      <CardTitle heading="Purchase" subheading="Edit purchase below..."></CardTitle>
      <PrimaryButton buttonText="Delete Purchase" onClick={openDeletePurchaseView}></PrimaryButton>
      </div>
      <CardGrid>
        <ImmutableCardProp heading="Purchase ID" data={props.purchase.id}></ImmutableCardProp>
        <ImmutableCardProp heading="Subtotal" data={props.purchase.subtotal}></ImmutableCardProp>
        <ImmutableCardProp heading="Book Title" data={title}></ImmutableCardProp>
        <BookCardProp saveFunction={setIsbn} defaultValue={""}></BookCardProp>
        <MutableCardProp saveValue={setQuantity} heading="Quantity" required="True" dataType="string" 
        defaultValue={props.purchase.quantity}></MutableCardProp>
        <MutableCardProp saveValue={setPrice} heading="Price" required="True" dataType="string" 
        defaultValue={props.purchase.price}></MutableCardProp>
      </CardGrid>
      <SaveCardChanges closeModal={closeModal} saveModal={openConfirmationView}></SaveCardChanges>
      <div>
        {renderDeleteSaleView()}
        {renderConfirmationView()}
      </div>
    </div>
    : <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
    <div className="flex-row ">
    <CardTitle heading="Purchase" subheading="Add purchase information below..."></CardTitle>
    </div>
    <CardGrid>
      <BookCardProp saveFunction={setIsbn} defaultValue={""}></BookCardProp>
      <MutableCardProp saveValue={setQuantity} heading="Quantity" required="True" dataType="string" 
      defaultValue={props.purchase.quantity}></MutableCardProp>
      <MutableCardProp saveValue={setPrice} heading="Price" required="True" dataType="string" 
      defaultValue={props.purchase.price}></MutableCardProp>
    </CardGrid>
    <SaveCardChanges closeModal={closeModal} saveModal={openConfirmationView}></SaveCardChanges>
    <div>
        {renderConfirmationView()}
      </div>
    <div>
    </div>
  </div>) : null)
)
}
