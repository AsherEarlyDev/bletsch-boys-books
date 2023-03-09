import { useState } from 'react';
import { api } from '../../../../../utils/api';
import CreateSaleEntries from '../../../../CreateEntries';
import ConfirmCard from "../../../../CardComponents/ConfirmationCard";
import { Buyback } from "../../../../../types/buybackTypes";
import ViewModal from "../../ParentModals/Unused/ViewModal";



interface ViewBuybackModalProp {
  buyback: Buyback
  cardType: string
  closeOut: () => void
}


export default function ViewBuybackModal(props:ViewBuybackModalProp) {
  console.log("IM RIGHT HERE")
  const [open, setOpen] = useState(true)
  const [isbn, setIsbn] = useState(props.buyback.bookId)
  const book = api.books.findInternalBook.useQuery({isbn: props.buyback.bookId}).data
  let title = ''
  if (book){
    title = book.title
  }
  const [quantity, setQuantity] = useState(props.buyback.quantity)
  const [price, setPrice] = useState(props.buyback.buybackPrice)
  const [displayConfirmationView, setDisplayConfirmationView] = useState(false)
  const modBuyback = api.buyback.modifyBuyback.useMutation()
  const addBuyback = api.buyback.createBuyback.useMutation()

  function closeModal(){
    setOpen(false)
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

  return (
    <ViewModal
    item={props.buyback}
    type="Buyback"
    cardType={props.cardType}
    closeOut={props.closeOut}
    edit={editBuyback}
    openConfirmation={openConfirmationView}
    closeConfirmation={closeConfirmationView}
    renderConfirmation={renderConfirmationView}
    ></ViewModal>
  )
}
