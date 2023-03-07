import ImmutableCardProp from "../../../../CardComponents/ImmutableCardProp";
import MutableCardProp from "../../../../CardComponents/MutableCardProp";
import CardTitle from "../../../../CardComponents/CardTitle";
import CardGrid from "../../../../CardComponents/CardGrid";
import SaveCardChanges from "../../../../CardComponents/SaveCardChanges";
import { SetStateAction, useState } from 'react';
import { api } from '../../../../../utils/api';
import CreateSaleEntries from '../../../../CreateEntries';
import PrimaryButton from '../../../../BasicComponents/PrimaryButton';
import ConfirmCard from "../../../../CardComponents/ConfirmationCard";
import CreateEntries from "../../../../CreateEntries";
import BookCardProp from "../../../../CardComponents/BookCardProp";
import { Buyback } from "../../../../../types/buybackTypes";
import DeleteBuybackOrderModal from "../../BuybackModals/DeleteBuybackOrderModal";
import { genericItem } from "../../../../../types/generalTypes";



interface ViewModalProp {
  item: genericItem
  cardType: string
  type: string
  closeOut: () => void
  edit: ()=>void
  openConfirmation: ()=>void
  closeConfirmation: ()=>void
  renderConfirmation: any
}


export default function ViewModal(props:ViewModalProp) {
  const [open, setOpen] = useState(true)
  const [isbn, setIsbn] = useState(props.item.bookId)
  const book = api.books.findInternalBook.useQuery({isbn: props.item.bookId}).data
  let title = ''
  if (book){
    title = book.title
  }
  const [quantity, setQuantity] = useState(props.item.quantity)
  const [price, setPrice] = useState(props.item.buybackPrice ? props.item.buybackPrice : props.item.price)
  const [displayDeleteView, setDisplayDeleteView] = useState(false)

  function closeModal(){
    setOpen(false)
  }


  function openDeleteView() {
    setDisplayDeleteView(true)
  }

  function renderDeleteView() {
    return <>
      {displayDeleteView ? <CreateEntries closeStateFunction={setDisplayDeleteView} submitText={'Delete' + props.type}>
        <DeleteBuybackOrderModal closeOut={closeDeleteView} buybackId={props.item.id}></DeleteBuybackOrderModal>
      </CreateEntries>: null}
    </>;
  }
  
  function closeDeleteView(){
    setDisplayDeleteView(false)
  }


  return (
    book ?
    ((open && props.item) ? (props.cardType === 'edit' ?
    <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
      <div className="flex-row ">
      <CardTitle heading={props.type} subheading={"Edit "+props.type+ " below..."}></CardTitle>
      <PrimaryButton buttonText={'Delete' + props.type} onClick={openDeleteView}></PrimaryButton>
      </div>
      <CardGrid>
        <ImmutableCardProp heading={props.type + " ID"} data={props.item.id}></ImmutableCardProp>
        <ImmutableCardProp heading="Subtotal" data={props.item.subtotal}></ImmutableCardProp>
        <ImmutableCardProp heading="Book Title" data={title}></ImmutableCardProp>
        <BookCardProp saveFunction={setIsbn} defaultValue={book.isbn} ></BookCardProp>
        <MutableCardProp saveValue={setQuantity} heading="Quantity" required="True" dataType="string" 
        defaultValue={props.item.quantity}></MutableCardProp>
        <MutableCardProp saveValue={setPrice} heading="Price" required="True" dataType="string" 
        defaultValue={props.item.buybackPrice ? props.item.buybackPrice : props.item.price}></MutableCardProp>
      </CardGrid>
      <SaveCardChanges closeModal={closeModal} saveModal={props.openConfirmation}></SaveCardChanges>
      <div>
        {renderDeleteView()}
        {props.renderConfirmation()}
      </div>
    </div>
    : <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
    <div className="flex-row ">
    <CardTitle heading={props.type} subheading={"Add "+props.type+" information below..."}></CardTitle>
    </div>
    <CardGrid>
      <BookCardProp saveFunction={setIsbn} defaultValue={book.isbn } ></BookCardProp>
      <MutableCardProp saveValue={setQuantity} heading="Quantity" required="True" dataType="string" 
      defaultValue={props.item.quantity}></MutableCardProp>
      <MutableCardProp saveValue={setPrice} heading="Price" required="True" dataType="string" 
      defaultValue={props.item.buybackPrice ? props.item.buybackPrice : props.item.price}></MutableCardProp>
    </CardGrid>
    <SaveCardChanges closeModal={closeModal} saveModal={props.openConfirmation}></SaveCardChanges>
    <div>
        {props.renderConfirmation()}
      </div>
    <div>
    </div>
  </div>) : null):null
)
}
