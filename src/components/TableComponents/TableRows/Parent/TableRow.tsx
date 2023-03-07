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
import DeleteBuybackModal from "../../Modals/BuybackModals/DeleteBuybackModal";
import BuybackCardProp from "../../../CardComponents/BuybackCardProp";

interface TableRowProp {
  type: string
  item: {
    id: string,
    bookId: string,
    buybackOrderId?: string,
    purchaseOrderId?: string,
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
  saveAdd?: (isbn: string, quantity: number, price: number) => void
  edit?: ()=>void
}

export default function TableRow(props: TableRowProp) {
  const [isbn, setIsbn] = useState(props.item.bookId)
  const book = api.books.findInternalBook.useQuery({isbn: isbn}).data
  const defaultPrice = props.item?.price ? props.item?.price : props.item?.buybackPrice
  const [deleteView, setDeleteView] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [price, setPrice] = useState<number>(defaultPrice)
  const [quantity, setQuantity] = useState(props.item.quantity)
  const [subtotal, setSubtotal] = useState(props.item.subtotal)
  const [visible, setVisible] = useState(true)


  function handleRowEdit() {
    setIsEditing(true)
  }


  function renderDeleteView() {
    return <>
      {deleteView ?
          <CreateSaleEntries closeStateFunction={setDeleteView} submitText={"Delete "+props.type}>
            <DeleteBuybackModal price={price} quantity={quantity}
                            bookTitle={(book) ? book.title : ""} onDelete={setVisible}
                            closeOut={closeDeleteView} buybackId={props.item.id}></DeleteBuybackModal>
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
    props.saveAdd(isbn, quantity, price)
  }

  return (
      <>
        {visible &&
        (props.isView ?
                <tr>
                  <TableEntry firstEntry={true}>{(book) ? book.title : ""}</TableEntry>
                  <TableEntry>${Number(price).toFixed(2)}</TableEntry>
                  <TableEntry>{quantity}</TableEntry>
                  <TableEntry>${subtotal.toFixed(2)}</TableEntry>
                </tr>
                :
                (props.isAdding ? ((!props.isCSV || book) ?
                        <tr>

                          <BuybackCardProp vendorId={props.vendorId} saveFunction={setIsbn} defaultValue={props.isCSV ? ((book) ? book : {}) : {}} ></BuybackCardProp>
                          <MutableCurrencyTableEntry saveValue={setPrice} heading="Buyback Price"
                                                     required="True" dataType="number"
                                                     defaultValue={props.isCSV ? price : ""}></MutableCurrencyTableEntry>
                          <MutableTableEntry saveValue={setQuantity} heading="Quantity Bought"
                                             required="True" dataType="number"
                                             defaultValue={props.isCSV ? quantity : ""}></MutableTableEntry>
                          <TableEntry>${subtotal.toFixed(2)}</TableEntry>
                          <SaveRowEntry onSave={saveNew}></SaveRowEntry>
                          <DeleteRowEntry onDelete={props.closeAdd} isbn={props.isCSV ? props.item.bookId : undefined}></DeleteRowEntry>
                        </tr> : null)
                        : 
                        (isEditing ?
                            <tr>
                              {/*<MutableTableEntry firstEntry={true} saveValue={} heading="book" datatype="string" defaultValue={(book) ? book.title : "" }></MutableTableEntry>*/}
                              <BuybackCardProp vendorId={props.vendorId} saveFunction={setIsbn} defaultValue={(book) ? book : {}} ></BuybackCardProp>
                              <MutableCurrencyTableEntry saveValue={setPrice}
                                                         heading={props.type+" Price"} required="True"
                                                         dataType="number"
                                                         defaultValue={setPrice}></MutableCurrencyTableEntry>
                              <MutableTableEntry saveValue={setQuantity} heading="Quantity"
                                                 required="True" dataType="number"
                                                 defaultValue={quantity}></MutableTableEntry>
                              <TableEntry>${subtotal.toFixed(2)}</TableEntry>
                              <SaveRowEntry onSave={props.edit}></SaveRowEntry>
                              <DeleteRowEntry onDelete={openDeleteView}></DeleteRowEntry>
                            </tr>
                            :
                            <tr>
                              <TableEntry firstEntry={true}>{(book) ? book.title : ""}</TableEntry>
                              <TableEntry>${Number(price).toFixed(2)}</TableEntry>
                              <TableEntry>{quantity}</TableEntry>
                              <TableEntry>${subtotal.toFixed(2)}</TableEntry>
                              <EditRowEntry onEdit={handleRowEdit}></EditRowEntry>
                              <DeleteRowEntry onDelete={openDeleteView}></DeleteRowEntry>
                            </tr>)
                )
        )
        }
        {renderDeleteView()}
      </>
  )
}
