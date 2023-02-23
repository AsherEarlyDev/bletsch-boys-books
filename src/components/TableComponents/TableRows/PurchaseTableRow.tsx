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
import {Purchase} from "../../../types/purchaseTypes";

interface PurchaseTableRowProp {
  purchase: Purchase
  isAdding: boolean
  isView: boolean
  closeAdd?: () => void
  saveAdd?: (isbn: string, quantity: number, price: number) => void
}

export default function PurchaseTableRow(props: PurchaseTableRowProp) {
  const [isbn, setIsbn] = useState(props.purchase.bookId)
  const book = api.books.findInternalBook.useQuery({isbn: isbn}).data
  const defaultPrice = props.purchase?.price
  const [deletePurchaseView, setDeletePurchaseView] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [purchasePrice, setPurchasePrice] = useState<number>(defaultPrice)
  const [quantityPurchased, setQuantityPurchased] = useState(props.purchase.quantity)
  const [subtotal, setSubtotal] = useState(props.purchase.subtotal)
  const modPurchase = api.purchase.modifyPurchase.useMutation({
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success("Successfully modified purchase!")
    }
  })
  const [visible, setVisible] = useState(true)

  function handleRowEdit() {
    setIsEditing(true)
  }

  function editPurchase() {
    if (props.purchase) {
      modPurchase.mutate({
        id: props.purchase.id,
        purchaseOrderId: props.purchase.purchaseOrderId,
        isbn: isbn,
        quantity: quantityPurchased.toString(),
        price: purchasePrice.toString(),
      })
    } else {
      toast.error("Cannot edit purchase.")
    }
    setSubtotal(purchasePrice * quantityPurchased)
    setIsEditing(false)
  }

  function openDeletePurchaseView() {
    setDeletePurchaseView(true)
  }

  function renderDeletePurchaseView() {
    return <>
      {deletePurchaseView ?
          <CreateSaleEntries closeStateFunction={setDeletePurchaseView} submitText='Delete Sale'>
            <SaleDeleteCard price={purchasePrice} quantity={quantityPurchased}
                            bookTitle={(book) ? book.title : ""} onDelete={setVisible}
                            closeOut={closeDeletePurchaseView} salesId={props.purchase.id}></SaleDeleteCard>
          </CreateSaleEntries> : null}
    </>;
  }

  function closeDeletePurchaseView() {
    setDeletePurchaseView(false)
  }

  function saveNewPurchase() {
    alert("ready: " + isbn)
    props.saveAdd(isbn, quantityPurchased, purchasePrice)
  }

  return (
      <>
        {visible &&
        (props.isView ?
                <tr>
                  <TableEntry firstEntry={true}>{(book) ? book.title : ""}</TableEntry>
                  <TableEntry>${Number(purchasePrice).toFixed(2)}</TableEntry>
                  <TableEntry>{quantityPurchased}</TableEntry>
                  <TableEntry>${subtotal.toFixed(2)}</TableEntry>
                </tr>
                :
                (props.isAdding ?
                        <tr>
                          <MutableTableEntry firstEntry={true} saveValue={setIsbn} heading="book"
                                             datatype="string"
                                             defaultValue={""}></MutableTableEntry>
                          <MutableCurrencyTableEntry saveValue={setPurchasePrice} heading="Purchase Price"
                                                     required="True" dataType="number"
                                                     defaultValue=""></MutableCurrencyTableEntry>
                          <MutableTableEntry saveValue={setQuantityPurchased} heading="Quantity Purchased"
                                             required="True" dataType="number"
                                             defaultValue=""></MutableTableEntry>
                          <TableEntry>${subtotal.toFixed(2)}</TableEntry>
                          <SaveRowEntry onSave={saveNewPurchase}></SaveRowEntry>
                          <DeleteRowEntry onDelete={props.closeAdd}></DeleteRowEntry>
                        </tr>
                        :
                        (isEditing ?
                            <tr>
                              {/*<MutableTableEntry firstEntry={true} saveValue={} heading="book" datatype="string" defaultValue={(book) ? book.title : "" }></MutableTableEntry>*/}
                              <TableEntry firstEntry={true}>{(book) ? book.title : ""}</TableEntry>
                              <MutableCurrencyTableEntry saveValue={setPurchasePrice}
                                                         heading="Retail Price" required="True"
                                                         dataType="number"
                                                         defaultValue={purchasePrice}></MutableCurrencyTableEntry>
                              <MutableTableEntry saveValue={setQuantityPurchased} heading="Quantity Sold"
                                                 required="True" dataType="number"
                                                 defaultValue={quantityPurchased}></MutableTableEntry>
                              <TableEntry>${subtotal.toFixed(2)}</TableEntry>
                              <SaveRowEntry onSave={editPurchase}></SaveRowEntry>
                              <DeleteRowEntry onDelete={openDeletePurchaseView}></DeleteRowEntry>
                            </tr>
                            :
                            <tr>
                              <TableEntry firstEntry={true}>{(book) ? book.title : ""}</TableEntry>
                              <TableEntry>${Number(purchasePrice).toFixed(2)}</TableEntry>
                              <TableEntry>{quantityPurchased}</TableEntry>
                              <TableEntry>${subtotal.toFixed(2)}</TableEntry>
                              <EditRowEntry onEdit={handleRowEdit}></EditRowEntry>
                              <DeleteRowEntry onDelete={openDeletePurchaseView}></DeleteRowEntry>
                            </tr>)
                )
        )
        }
        {renderDeletePurchaseView()}
      </>
  )
}