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

interface SaleTableRowProp {
  sale: Sale
  isAdding: boolean
  isView: boolean
  closeAdd?: () => void
  saveAdd?: (isbn: string, quantity: number, price: number) => void
}

export default function SaleTableRow(props: SaleTableRowProp) {
  const [isbn, setIsbn] = useState(props.sale.bookId)
  const book = api.books.findInternalBook.useQuery({isbn: isbn}).data
  const defaultPrice = props.sale?.price
  const [deleteSaleView, setDeleteSaleView] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [salePrice, setSalePrice] = useState<number>(defaultPrice)
  const [quantitySold, setQuantitySold] = useState(props.sale.quantity)
  const [subtotal, setSubtotal] = useState(props.sale.subtotal)
  const modSale = api.sales.modifySale.useMutation({
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success("Successfully modified sale!")
    }
  })
  const [visible, setVisible] = useState(true)

  function handleRowEdit() {
    setIsEditing(true)
  }

  function editSale() {
    if (props.sale) {
      modSale.mutate({
        id: props.sale.id,
        saleReconciliationId: props.sale.saleReconciliationId,
        isbn: isbn,
        quantity: quantitySold.toString(),
        price: salePrice.toString(),
      })
    } else {
      toast.error("Cannot edit sale.")
    }
    setSubtotal(salePrice * quantitySold)
    setIsEditing(false)
  }

  function openDeleteSaleView() {
    setDeleteSaleView(true)
  }

  function renderDeleteSaleView() {
    return <>
      {deleteSaleView ?
          <CreateSaleEntries closeStateFunction={setDeleteSaleView} submitText='Delete Sale'>
            <SaleDeleteCard price={salePrice} quantity={quantitySold}
                            bookTitle={(book) ? book.title : ""} onDelete={setVisible}
                            closeOut={closeDeleteSaleView} salesId={props.sale.id}></SaleDeleteCard>
          </CreateSaleEntries> : null}
    </>;
  }

  function closeDeleteSaleView() {
    setDeleteSaleView(false)

  }

  function saveNewSale() {
    alert("ready: " + isbn)
    props.saveAdd(isbn, quantitySold, salePrice)
  }

  return (
      <>
        {visible &&
        (props.isView ?
                <tr>
                  <TableEntry firstEntry={true}>{(book) ? book.title : ""}</TableEntry>
                  <TableEntry>${Number(salePrice).toFixed(2)}</TableEntry>
                  <TableEntry>{quantitySold}</TableEntry>
                  <TableEntry>${subtotal.toFixed(2)}</TableEntry>
                </tr>
                :
                (props.isAdding ?
                        <tr>
                          <MutableTableEntry firstEntry={true} saveValue={setIsbn} heading="book"
                                             datatype="string"
                                             defaultValue={""}></MutableTableEntry>
                          <MutableCurrencyTableEntry saveValue={setSalePrice} heading="Retail Price"
                                                     required="True" dataType="number"
                                                     defaultValue=""></MutableCurrencyTableEntry>
                          <MutableTableEntry saveValue={setQuantitySold} heading="Quantity Sold"
                                             required="True" dataType="number"
                                             defaultValue=""></MutableTableEntry>
                          <TableEntry>${subtotal.toFixed(2)}</TableEntry>
                          <SaveRowEntry onSave={saveNewSale}></SaveRowEntry>
                          <DeleteRowEntry onDelete={props.closeAdd}></DeleteRowEntry>
                        </tr>
                        :
                        (isEditing ?
                            <tr>
                              {/*<MutableTableEntry firstEntry={true} saveValue={} heading="book" datatype="string" defaultValue={(book) ? book.title : "" }></MutableTableEntry>*/}
                              <TableEntry firstEntry={true}>{(book) ? book.title : ""}</TableEntry>
                              <MutableCurrencyTableEntry saveValue={setSalePrice}
                                                         heading="Retail Price" required="True"
                                                         dataType="number"
                                                         defaultValue={salePrice}></MutableCurrencyTableEntry>
                              <MutableTableEntry saveValue={setQuantitySold} heading="Quantity Sold"
                                                 required="True" dataType="number"
                                                 defaultValue={quantitySold}></MutableTableEntry>
                              <TableEntry>${subtotal.toFixed(2)}</TableEntry>
                              <SaveRowEntry onSave={editSale}></SaveRowEntry>
                              <DeleteRowEntry onDelete={openDeleteSaleView}></DeleteRowEntry>
                            </tr>
                            :
                            <tr>
                              <TableEntry firstEntry={true}>{(book) ? book.title : ""}</TableEntry>
                              <TableEntry>${Number(salePrice).toFixed(2)}</TableEntry>
                              <TableEntry>{quantitySold}</TableEntry>
                              <TableEntry>${subtotal.toFixed(2)}</TableEntry>
                              <EditRowEntry onEdit={handleRowEdit}></EditRowEntry>
                              <DeleteRowEntry onDelete={openDeleteSaleView}></DeleteRowEntry>
                            </tr>)
                )
        )
        }
        {renderDeleteSaleView()}
      </>
  )
}
