import ImmutableCardProp from "../../../CardComponents/ImmutableCardProp";
import MutableCardProp from "../../../CardComponents/MutableCardProp";
import CardTitle from "../../../CardComponents/CardTitle";
import CardGrid from "../../../CardComponents/CardGrid";
import SaveCardChanges from "../../../CardComponents/SaveCardChanges";
import { useState } from 'react';
import { api } from '../../../../utils/api';
import { Sale} from "../../../../types/salesTypes";
import DeleteSaleModal from "./DeleteSaleModal";
import CreateSaleEntries from '../../../CreateEntries';
import PrimaryButton from '../../../BasicComponents/PrimaryButton';
import ConfirmCard from "../../../CardComponents/ConfirmationCard";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BookCardProp from "../../../CardComponents/BookCardProp";
import DeleteSalesRecModal from "./DeleteSalesRecModal";


interface SalesProp{
  sale:  Sale
  cardType: string
  closeOut?: () => void
}

export default function ViewSalesRecModal(props:SalesProp) {
  console.log("SALE REC MODAL")
  const [open, setOpen] = useState(true)
  const [isbn, setIsbn] = useState(props.sale.bookId)
  const book = api.books.findInternalBook.useQuery({isbn: props.sale.bookId}).data
  let title = ''
  if (book){
    title = book.title
  }
  const [quantity, setQuantity] = useState(props.sale.quantity)
  const [price, setPrice] = useState(props.sale.price)
  const [displayDeleteSaleView, setDeleteSaleView] = useState(false)
  const [displayConfirmationView, setDisplayConfirmationView] = useState(false)
  const modSale = api.sales.modifySale.useMutation({
    onError: (error)=>{
    toast.error(error.message)
  },
  onSuccess: ()=>{
    toast.success("Successfully modified sale!")
  }
})
  const addSale = api.sales.createSale.useMutation({
    onError: (error)=>{
    toast.error(error.message)
  },
  onSuccess: ()=>{
    toast.success("Successfully added sale!")
  }
})

  function closeModal(){
    setOpen(false)
    // props.closeOut()
  }

  function editSale(){
    if(props.sale){
      if (props.cardType === 'edit'){
        modSale.mutate({
          id: props.sale.id,
          saleReconciliationId: props.sale.saleReconciliationId,
          isbn: isbn,
          quantity: quantity.toString(),
          price: price.toString(),
          
        })
      }
      else{
          console.log(isbn)
          addSale.mutate({
            saleReconciliationId: props.sale.saleReconciliationId,
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
            <ConfirmCard onClose={closeConfirmationView} onConfirm={editSale} confirmHeading="Sale Edit Confirmation"
                         confirmMessage="Confirm to make changes to a Sale"></ConfirmCard></CreateSaleEntries> : null}
    </>;
  }
  function closeConfirmationView(){
    setDisplayConfirmationView(false)
  }

  function openDeleteSaleView() {
    setDeleteSaleView(true)
  }
  function renderDeleteSaleView() {
    return <>
      {displayDeleteSaleView ? <CreateSaleEntries closeStateFunction={setDeleteSaleView} submitText='Delete Sale'>
        <DeleteSalesRecModal closeOut={closeDeleteSaleView} salesRecId={props.sale.id}></DeleteSalesRecModal>
      </CreateSaleEntries>: null}
    </>;
  }
  function closeDeleteSaleView(){
    setDeleteSaleView(false)
  }



  return (
    book ?
      ((open && props.sale) ? (props.cardType==='edit' ?
          <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
            <div className="flex-row ">
              <CardTitle heading="Sale" subheading="Edit sale below..."></CardTitle>
              <PrimaryButton buttonText="Delete Sale" onClick={openDeleteSaleView}></PrimaryButton>
            </div>
            <CardGrid>
              <ImmutableCardProp heading="Sale ID" data={props.sale.id}></ImmutableCardProp>
              <ImmutableCardProp heading="Subtotal" data={props.sale.subtotal}></ImmutableCardProp>
              <ImmutableCardProp heading="Book Title" data={title}></ImmutableCardProp>
              <BookCardProp saveFunction={setIsbn} defaultValue={book.isbn} ></BookCardProp>
              <MutableCardProp saveValue={setQuantity} heading="Quantity" required="True" dataType="string"
                               defaultValue={props.sale.quantity}></MutableCardProp>
              <MutableCardProp saveValue={setPrice} heading="Price" required="True" dataType="string"
                               defaultValue={props.sale.price}></MutableCardProp>
            </CardGrid>
            <SaveCardChanges closeModal={closeModal} saveModal={openConfirmationView}></SaveCardChanges>
            <div>
              {renderDeleteSaleView()}
              {renderConfirmationView()}
            </div>
          </div>
          : <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
            <div className="flex-row ">
              <CardTitle heading="Sale" subheading="Add sale information below..."></CardTitle>
            </div>
            <CardGrid>
              <BookCardProp saveFunction={setIsbn} defaultValue={book.isbn} ></BookCardProp>
              <MutableCardProp saveValue={setQuantity} heading="Quantity" required="True" dataType="string"
                               defaultValue={props.sale.quantity}></MutableCardProp>
              <MutableCardProp saveValue={setPrice} heading="Price (Defaults to book retail price)" required="True" dataType="string"
                               defaultValue={props.sale.price}></MutableCardProp>
            </CardGrid>
            <SaveCardChanges closeModal={closeModal} saveModal={openConfirmationView}></SaveCardChanges>
            <div>
              {renderConfirmationView()}
            </div>
          </div>) : null): null
  )
}