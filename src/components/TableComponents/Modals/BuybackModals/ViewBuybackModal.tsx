import ImmutableCardProp from "../../../CardComponents/ImmutableCardProp";
import MutableCardProp from "../../../CardComponents/MutableCardProp";
import CardTitle from "../../../CardComponents/CardTitle";
import CardGrid from "../../../CardComponents/CardGrid";
import SaveCardChanges from "../../../CardComponents/SaveCardChanges";
import { SetStateAction, useState } from 'react';
import { api } from '../../../../utils/api';
import CreateSaleEntries from '../../../CreateEntries';
import PrimaryButton from '../../../BasicComponents/PrimaryButton';
import DeleteBuybackOrderModal from "./DeleteBuybackOrderModal";
import ConfirmCard from "../../../CardComponents/ConfirmationCard";
import CreateEntries from "../../../CreateEntries";
import BookCardProp from "../../../CardComponents/BookCardProp";
import { Buyback } from "../../../../types/buybackTypes";



interface ViewBuybackModalProp {
  buyback: Buyback
  cardType: string
  closeOut: () => void
}


export default function ViewBuybackModal(props:ViewBuybackModalProp) {
  const [open, setOpen] = useState(true)
  const [isbn, setIsbn] = useState(props.buyback.bookId)
  const book = api.books.findInternalBook.useQuery({isbn: props.buyback.bookId}).data
  let title = ''
  if (book){
    title = book.title
  }
  const [quantity, setQuantity] = useState(props.buyback.quantity)
  const [price, setPrice] = useState(props.buyback.buybackPrice)
  const [displayDeleteBuybackView, setDisplayDeleteBuybackView] = useState(false)
  const [displayConfirmationView, setDisplayConfirmationView] = useState(false)
  const modBuyback = api.buyback.modifyBuyback.useMutation()
  const addBuyback = api.buyback.createBuyback.useMutation()

  function closeModal(){
    setOpen(false)
    // props.closeOut()
  }

  function editBuyback(){
    if(props.buyback){
      if (props.cardType === 'edit'){
        modBuyback.mutate({
          id: props.buyback.id,
          buybackOrderId: props.buyback.buybackOrderId,
          isbn: isbn,
          quantity: quantity.toString(),
          price: price.toString()
        })
      }
      else{
        addBuyback.mutate({
          buybackOrderId: props.buyback.buybackOrderId,
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
            <ConfirmCard onClose={closeConfirmationView} onConfirm={editBuyback} confirmHeading="Buyback Edit Confirmation"
                         confirmMessage="Confirm to make changes to a Buyback"></ConfirmCard></CreateSaleEntries> : null}
    </>;
  }
  function closeConfirmationView(){
    setDisplayConfirmationView(false)
  }

  function openDeleteBuybackView() {
    setDisplayDeleteBuybackView(true)
  }

  function renderDeleteSaleView() {
    return <>
      {displayDeleteBuybackView ? <CreateEntries closeStateFunction={setDisplayDeleteBuybackView} submitText='Delete Buyback'>
        <DeleteBuybackOrderModal closeOut={closeDeleteBuybackView} buybackId={props.buyback.id}></DeleteBuybackOrderModal>
      </CreateEntries>: null}
    </>;
  }
  
  function closeDeleteBuybackView(){
    setDisplayDeleteBuybackView(false)
  }


  return (
    book ?
    ((open && props.buyback) ? (props.cardType === 'edit' ?
    <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
      <div className="flex-row ">
      <CardTitle heading="Buyback" subheading="Edit Buyback below..."></CardTitle>
      <PrimaryButton buttonText="Delete Buyback" onClick={openDeleteBuybackView}></PrimaryButton>
      </div>
      <CardGrid>
        <ImmutableCardProp heading="Buyback ID" data={props.buyback.id}></ImmutableCardProp>
        <ImmutableCardProp heading="Subtotal" data={props.buyback.subtotal}></ImmutableCardProp>
        <ImmutableCardProp heading="Book Title" data={title}></ImmutableCardProp>
        <BookCardProp saveFunction={setIsbn} defaultValue={book.isbn} displayTitleOrISBN={"isbn"}></BookCardProp>
        <MutableCardProp saveValue={setQuantity} heading="Quantity" required="True" dataType="string" 
        defaultValue={props.buyback.quantity}></MutableCardProp>
        <MutableCardProp saveValue={setPrice} heading="Price" required="True" dataType="string" 
        defaultValue={props.buyback.buybackPrice}></MutableCardProp>
      </CardGrid>
      <SaveCardChanges closeModal={closeModal} saveModal={openConfirmationView}></SaveCardChanges>
      <div>
        {renderDeleteSaleView()}
        {renderConfirmationView()}
      </div>
    </div>
    : <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
    <div className="flex-row ">
    <CardTitle heading="Buyback" subheading="Add Buyback information below..."></CardTitle>
    </div>
    <CardGrid>
      <BookCardProp saveFunction={setIsbn} defaultValue={book.isbn } displayTitleOrISBN={"isbn"}></BookCardProp>
      <MutableCardProp saveValue={setQuantity} heading="Quantity" required="True" dataType="string" 
      defaultValue={props.buyback.quantity}></MutableCardProp>
      <MutableCardProp saveValue={setPrice} heading="Price" required="True" dataType="string" 
      defaultValue={props.buyback.buybackPrice}></MutableCardProp>
    </CardGrid>
    <SaveCardChanges closeModal={closeModal} saveModal={openConfirmationView}></SaveCardChanges>
    <div>
        {renderConfirmationView()}
      </div>
    <div>
    </div>
  </div>) : null):null
)
}
