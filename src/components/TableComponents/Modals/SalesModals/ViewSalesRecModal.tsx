import ImmutableCardProp from "../../../CardComponents/ImmutableCardProp";
import MutableCardProp from "../../../CardComponents/MutableCardProp";
import CardTitle from "../../../CardComponents/CardTitle";
import CardGrid from "../../../CardComponents/CardGrid";
import SaveCardChanges from "../../../CardComponents/SaveCardChanges";
import { useState } from 'react';
import { api } from '../../../../utils/api';
import { Sale} from "../../../../types/salesTypes";
import SaleDeleteCard from "../../../SalesComponents/SaleDeleteCard";
import CreateSaleEntries from '../../../CreateEntries';
import PrimaryButton from '../../../BasicComponents/PrimaryButton';
import ConfirmCard from "../../../CardComponents/ConfirmationCard";



interface SalesProp{
  sale:  Sale
  cardType: string
  closeOut?: () => void
}

export default function ViewSalesRecModal(props:SalesProp) {
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
  const modSale = api.sales.modifySale.useMutation()
  const addSale = api.sales.createSale.useMutation()

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
        <SaleDeleteCard onClose={closeDeleteSaleView} salesId={props.sale.id}></SaleDeleteCard>
      </CreateSaleEntries>: null}
    </>;
  }
  function closeDeleteSaleView(){
    setDeleteSaleView(false)
  }



  return (
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
              <MutableCardProp saveValue={setIsbn} heading="Book ISBN" required="True" dataType="string"
                               defaultValue={props.sale.bookId}></MutableCardProp>
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
              <MutableCardProp saveValue={setIsbn} heading="Book ISBN" required="True" dataType="string"
                               defaultValue={props.sale.bookId}></MutableCardProp>
              <MutableCardProp saveValue={setQuantity} heading="Quantity" required="True" dataType="string"
                               defaultValue={props.sale.quantity}></MutableCardProp>
              <MutableCardProp saveValue={setPrice} heading="Price (Defaults to book retail price)" required="True" dataType="string"
                               defaultValue={props.sale.price}></MutableCardProp>
            </CardGrid>
            <SaveCardChanges closeModal={closeModal} saveModal={openConfirmationView}></SaveCardChanges>
            <div>
              {renderConfirmationView()}
            </div>
          </div>) : null)
  )
}