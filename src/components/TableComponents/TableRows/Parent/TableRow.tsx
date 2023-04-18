import TableEntry from "../../TableEntries/TableEntry";
import React, {useState} from "react";
import {api} from "../../../../utils/api";
import MutableCurrencyTableEntry from "../../TableEntries/MutableCurrencyTableEntry";
import MutableTableEntry from "../../TableEntries/MutableTableEntry";
import EditRowEntry from "../../TableEntries/EditRowEntry";
import DeleteRowEntry from "../../TableEntries/DeleteRowEntry";
import SaveRowEntry from "../../TableEntries/SaveRowEntry";
import {toast} from "react-toastify";
import CreateSaleEntries from "../../../CreateEntries";
import BuybackCardProp from "../../../CardComponents/BuybackCardProp";
import DeleteModal from "../../Modals/ParentModals/DeleteModal";
import BookCardProp from "../../../CardComponents/BookCardProp";
import LinkedBookTitle from "../../../BasicComponents/DynamicRouting/LinkedBookTitle";

interface TableRowProp {
  type: string
  item: {
    id: string,
    bookId: string,
    buybackOrderId?: string,
    purchaseOrderId?: string,
    saleReconciliationId?: string,
    quantity: number,
    price?: number,
    buybackPrice?: number
    subtotal: number
  }
  vendorId: string
  isAdding: boolean
  isView: boolean
  isCSV?: boolean
  closeAdd?: any
  saveAdd?: (isbn: string, quantity: number, price: number, isCSV:boolean) => void
  mod?: any
}

export default function TableRow(props: TableRowProp) {
  const [isbn, setIsbn] = useState(props.item.bookId)
  const buybackCost = api.buyback.getCostMostRecent.useQuery({isbn: isbn, vendorId: props.vendorId}).data
  const book = api.books.findInternalBook.useQuery({isbn: isbn}).data
  const defaultPrice = props.type === "Buyback" ? buybackCost : ((book.isbn===props.item.bookId || book.isbn10===props.item.bookId)? props.item.price : book?.retailPrice)
  let currentItemPrice
  let deleteMutation
  let id: string
  if (props.type === "Buyback"){
    id = props.item?.buybackOrderId
    deleteMutation = api.buyback.deleteBuyback.useMutation({
      onError: (error)=>{
        toast.error(error.message)
      },
      onSuccess: ()=>{
        toast.success("Successfully deleted Buyback!")
      }})
      currentItemPrice = props.item.price
  }
  else if (props.type === "Purchase"){
    id = props.item?.purchaseOrderId
    deleteMutation = api.purchase.deletePurchase.useMutation({
      onError: (error)=>{
        toast.error(error.message)
      },
      onSuccess: ()=>{
        toast.success("Successfully deleted Purchase!")
      }})
      currentItemPrice = props.item.price
  }
  else{
    id = props.item?.saleReconciliationId
    deleteMutation = api.sales.deleteSale.useMutation({
      onError: (error)=>{
        toast.error(error.message)
      },
      onSuccess: ()=>{
        toast.success("Successfully deleted Sale!")
      }})
      currentItemPrice = props.item.price
  }
  const [deleteView, setDeleteView] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [price, setPrice] = useState<number>(defaultPrice)
  const [quantity, setQuantity] = useState(props.item.quantity)
  const [subtotal, setSubtotal] = useState(props.item.subtotal)
  const [visible, setVisible] = useState(true)
  const [isAdding, setIsAdding] = useState(props.isAdding)

  function handleRowEdit() {
    setIsEditing(true)
  }

  function handleBookSelect(bookId: string){
    setIsbn(bookId)
    if(bookId !== props.item.bookId){
      let displayPrice: number
      if (book){
        displayPrice = book?.retailPrice
      }
      setPrice(displayPrice)
    }
  }

  function renderDeleteView() {
    
    return <>
      {deleteView ?
          <CreateSaleEntries closeStateFunction={setDeleteView} submitText={"Delete "+props.type}>
            <DeleteModal type={props.type} deleteMutation={deleteMutation} price={currentItemPrice.toFixed(2)} quantity={quantity}
                            bookTitle={(book) ? book.title : ""} onDelete={setVisible}
                            closeOut={closeDeleteView} id={props.item.id}></DeleteModal>
          </CreateSaleEntries> : null}
    </>;
  }

  function closeDeleteView() {
    setDeleteView(false)
  }

  function openDeleteView() {
    setDeleteView(true)
  }

  function saveNew() {
    if (!price && book && props.type != "Buyback"){
      props.saveAdd(props.item.bookId, quantity, book.retailPrice, props.isCSV)
    }
    else{
      props.saveAdd(props.item.bookId, quantity, price, props.isCSV)
    }
    
  }
  

  function edit() {
    if (props.item) {
      console.log(price + "1")
      props.mod.mutate({
        id: props.item.id,
        orderId: id,
        isbn: isbn,
        quantity: quantity.toString(),
        price: price.toString(),
      })
    } else {
      toast.error("Cannot edit buyback.")
    }
    setSubtotal(price * quantity)
    setIsEditing(false)
  }

  return (
      <>
        {visible && 
        (props.isView ?
                <tr>
                  <LinkedBookTitle firstEntry={true} book={book}></LinkedBookTitle>
                  <TableEntry>${currentItemPrice.toFixed(2)}</TableEntry>
                  <TableEntry>{quantity}</TableEntry>
                  <TableEntry>${subtotal.toFixed(2)}</TableEntry>
                </tr>
                :
                (isAdding ? ((!props.isCSV || book) ?
                        <tr>
                          {props.type ==="Buyback" ? <BuybackCardProp vendorId={props.vendorId} saveFunction={setIsbn} defaultValue={props.isCSV ? ((book) ? book : {}) : {} } ></BuybackCardProp> : <BookCardProp type={props.type} vendorId={props.vendorId} saveFunction={handleBookSelect} defaultValue={props.isCSV ? ((book) ? book : {}) : {} } ></BookCardProp>}
                          <MutableCurrencyTableEntry saveValue={setPrice} heading={`${props.type} Price`}
                                                     required="True" dataType="number"
                                                     defaultValue={props.isCSV ? props.item.price : defaultPrice}></MutableCurrencyTableEntry>
                          <MutableTableEntry saveValue={setQuantity} heading="Quantity Bought"
                                             required="True" dataType="number"
                                             defaultValue={quantity}></MutableTableEntry>
                          <TableEntry>${subtotal.toFixed(2)}</TableEntry>
                          <SaveRowEntry onSave={saveNew}></SaveRowEntry>
                          <DeleteRowEntry onDelete={props.closeAdd} isbn={props.isCSV ? props.item.bookId : undefined}></DeleteRowEntry>
                        </tr> : null)
                        : 
                        (isEditing ?
                            <tr>
                              {props.type ==="Buyback" ? <BuybackCardProp vendorId={props.vendorId} saveFunction={setIsbn} defaultValue={(book) ? book : {}} ></BuybackCardProp> : <BookCardProp type={props.type} vendorId={props.vendorId} saveFunction={handleBookSelect} defaultValue={(book) ? book : {}} ></BookCardProp>}
                              <MutableCurrencyTableEntry saveValue={setPrice}
                                                         heading={props.type+" Price"} required="True"
                                                         dataType="number"
                                                         defaultValue={currentItemPrice.toFixed(2)}></MutableCurrencyTableEntry>
                              <MutableTableEntry saveValue={setQuantity} heading="Quantity"
                                                 required="True" dataType="number"
                                                 defaultValue={quantity}></MutableTableEntry>
                              <TableEntry>${subtotal.toFixed(2)}</TableEntry>
                              <SaveRowEntry onSave={edit}></SaveRowEntry>
                              <DeleteRowEntry onDelete={openDeleteView}></DeleteRowEntry>
                            </tr>
                            :
                            (book ? <tr>
                              <TableEntry firstEntry={true}>{(book) ? book.title : ""}</TableEntry>
                              <TableEntry>${currentItemPrice.toFixed(2)}</TableEntry>
                              <TableEntry>{quantity}</TableEntry>
                              <TableEntry>${subtotal.toFixed(2)}</TableEntry>
                              {book ? <EditRowEntry onEdit={handleRowEdit}></EditRowEntry>: null}
                              {book ? <DeleteRowEntry onDelete={openDeleteView}></DeleteRowEntry>: null}
                            </tr>:null))
                )
        )
        }
        {renderDeleteView()}
      </>
  )
}
