import TableEntry from "../TableEntries/TableEntry";
import React, {useState} from "react";
import {api} from "../../../utils/api";
import {Sale} from "../../../types/salesTypes";
import MutableCurrencyTableEntry from "../TableEntries/MutableCurrencyTableEntry";
import MutableTableEntry from "../TableEntries/MutableTableEntry";
import EditRowEntry from "../TableEntries/EditRowEntry";
import DeleteRowEntry from "../TableEntries/DeleteRowEntry";
import SaveRowEntry from "../TableEntries/SaveRowEntry";
import {toast} from "react-toastify";
import CreateSaleEntries from "../../CreateEntries";
import DeleteSaleModal from "../Modals/SalesModals/DeleteSaleModal";
import BookCardProp from "../../CardComponents/BookCardProp";
import { Buyback } from "../../../types/buybackTypes";
import DeleteBuybackModal from "../Modals/BuybackModals/DeleteBuybackModal";
import BuybackCardProp from "../../CardComponents/BuybackCardProp";

interface BuybackTableRowProp {
  buyback: Buyback
  vendorId: string
  isAdding: boolean
  isView: boolean
  isCSV?: boolean
  closeAdd?: any
  saveAdd?: (isbn: string, quantity: number, price: number) => void
}

export default function BuybackTableRow(props: BuybackTableRowProp) {
  const [isbn, setIsbn] = useState(props.buyback.bookId)
  const book = api.books.findInternalBook.useQuery({isbn: isbn}).data
  const defaultPrice = props.buyback?.buybackPrice
  const [deleteBuybackView, setDeleteBuybackView] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [buybackPrice, setBuybackPrice] = useState<number>(defaultPrice)
  const [quantityBuyback, setQuantityBuyback] = useState(props.buyback.quantity)
  const [subtotal, setSubtotal] = useState(props.buyback.subtotal)
  const modBuyback = api.buyback.modifyBuyback.useMutation({
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success("Successfully modified buyback!")
    }
  })
  const [visible, setVisible] = useState(true)

  function handleRowEdit() {
    setIsEditing(true)
  }

  function editBuyback() {
    if (props.buyback) {
      modBuyback.mutate({
        id: props.buyback.id,
        buybackOrderId: props.buyback.buybackOrderId,
        isbn: isbn,
        quantity: quantityBuyback.toString(),
        price: buybackPrice.toString(),
      })
    } else {
      toast.error("Cannot edit buyback.")
    }
    setSubtotal(buybackPrice * quantityBuyback)
    setIsEditing(false)
  }

  function openDeleteBuybackView() {
    setDeleteBuybackView(true)
  }

  function renderDeleteBuybackView() {
    return <>
      {deleteBuybackView ?
          <CreateSaleEntries closeStateFunction={setDeleteBuybackView} submitText='Delete Sale'>
            <DeleteBuybackModal price={buybackPrice} quantity={quantityBuyback}
                            bookTitle={(book) ? book.title : ""} onDelete={setVisible}
                            closeOut={closeDeleteBuybackView} buybackId={props.buyback.id}></DeleteBuybackModal>
          </CreateSaleEntries> : null}
    </>;
  }

  function closeDeleteBuybackView() {
    setDeleteBuybackView(false)
  }

  function saveNewBuyback() {
    props.saveAdd(isbn, quantityBuyback, buybackPrice)
  }

  return (
      <>
        {visible &&
        (props.isView ?
                <tr>
                  <TableEntry firstEntry={true}>{(book) ? book.title : ""}</TableEntry>
                  <TableEntry>${Number(buybackPrice).toFixed(2)}</TableEntry>
                  <TableEntry>{quantityBuyback}</TableEntry>
                  <TableEntry>${subtotal.toFixed(2)}</TableEntry>
                </tr>
                :
                (props.isAdding ? ((!props.isCSV || book) ?
                        <tr>

                          <BuybackCardProp vendorId={props.vendorId} saveFunction={setIsbn} defaultValue={props.isCSV ? ((book) ? book : {}) : {}} ></BuybackCardProp>
                          <MutableCurrencyTableEntry saveValue={setBuybackPrice} heading="Buyback Price"
                                                     required="True" dataType="number"
                                                     defaultValue={props.isCSV ? buybackPrice : ""}></MutableCurrencyTableEntry>
                          <MutableTableEntry saveValue={setQuantityBuyback} heading="Quantity Bought"
                                             required="True" dataType="number"
                                             defaultValue={props.isCSV ? quantityBuyback : ""}></MutableTableEntry>
                          <TableEntry>${subtotal.toFixed(2)}</TableEntry>
                          <SaveRowEntry onSave={saveNewBuyback}></SaveRowEntry>
                          <DeleteRowEntry onDelete={props.closeAdd} isbn={props.isCSV ? props.buyback.bookId : undefined}></DeleteRowEntry>
                        </tr> : null)
                        : 
                        (isEditing ?
                            <tr>
                              {/*<MutableTableEntry firstEntry={true} saveValue={} heading="book" datatype="string" defaultValue={(book) ? book.title : "" }></MutableTableEntry>*/}
                              <BuybackCardProp vendorId={props.vendorId} saveFunction={setIsbn} defaultValue={(book) ? book : {}} ></BuybackCardProp>
                              <MutableCurrencyTableEntry saveValue={setBuybackPrice}
                                                         heading="Buyback Price" required="True"
                                                         dataType="number"
                                                         defaultValue={buybackPrice}></MutableCurrencyTableEntry>
                              <MutableTableEntry saveValue={setQuantityBuyback} heading="Quantity Bought"
                                                 required="True" dataType="number"
                                                 defaultValue={quantityBuyback}></MutableTableEntry>
                              <TableEntry>${subtotal.toFixed(2)}</TableEntry>
                              <SaveRowEntry onSave={editBuyback}></SaveRowEntry>
                              <DeleteRowEntry onDelete={openDeleteBuybackView}></DeleteRowEntry>
                            </tr>
                            :
                            <tr>
                              <TableEntry firstEntry={true}>{(book) ? book.title : ""}</TableEntry>
                              <TableEntry>${Number(buybackPrice).toFixed(2)}</TableEntry>
                              <TableEntry>{quantityBuyback}</TableEntry>
                              <TableEntry>${subtotal.toFixed(2)}</TableEntry>
                              <EditRowEntry onEdit={handleRowEdit}></EditRowEntry>
                              <DeleteRowEntry onDelete={openDeleteBuybackView}></DeleteRowEntry>
                            </tr>)
                )
        )
        }
        {renderDeleteBuybackView()}
      </>
  )
}
