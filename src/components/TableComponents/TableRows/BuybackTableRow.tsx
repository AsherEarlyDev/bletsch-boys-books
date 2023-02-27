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
import SaleDeleteCard from "../../SalesComponents/SaleDeleteCard";
import BookCardProp from "../../CardComponents/BookCardProp";
import { Buyback } from "../../../types/buybackTypes";

interface BuybackTableRowProp {
  buyback: Buyback
  isAdding: boolean
  isView: boolean
  closeAdd?: () => void
  saveAdd?: (isbn: string, quantity: number, price: number) => void
}

export default function BuybackTableRow(props: BuybackTableRowProp) {
  const [isbn, setIsbn] = useState(props.buyback.bookId)
  const book = api.books.findInternalBook.useQuery({isbn: isbn}).data
  const defaultPrice = props.buyback?.price
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
            <SaleDeleteCard price={buybackPrice} quantity={quantityBuyback}
                            bookTitle={(book) ? book.title : ""} onDelete={setVisible}
                            closeOut={closeDeleteBuybackView} salesId={props.buyback.id}></SaleDeleteCard>
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
                (props.isAdding ?
                        <tr>
                          <BookCardProp saveFunction={setIsbn} defaultValue={{}} ></BookCardProp>
                          <MutableCurrencyTableEntry saveValue={setBuybackPrice} heading="Buyback Price"
                                                     required="True" dataType="number"
                                                     defaultValue=""></MutableCurrencyTableEntry>
                          <MutableTableEntry saveValue={setQuantityBuyback} heading="Quantity Bought"
                                             required="True" dataType="number"
                                             defaultValue=""></MutableTableEntry>
                          <TableEntry>${subtotal.toFixed(2)}</TableEntry>
                          <SaveRowEntry onSave={saveNewBuyback}></SaveRowEntry>
                          <DeleteRowEntry onDelete={props.closeAdd}></DeleteRowEntry>
                        </tr>
                        :
                        (isEditing ?
                            <tr>
                              {/*<MutableTableEntry firstEntry={true} saveValue={} heading="book" datatype="string" defaultValue={(book) ? book.title : "" }></MutableTableEntry>*/}
                              <BookCardProp saveFunction={setIsbn} defaultValue={(book) ? book : {}} ></BookCardProp>
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
