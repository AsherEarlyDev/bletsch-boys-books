import TableEntry from "../TableEntries/TableEntry";
import React, {useEffect, useState} from "react";
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
import LinkedBookTitle from "../../BasicComponents/DynamicRouting/LinkedBookTitle";

interface SaleTableRowProp {
  sale: Sale
  isAdding: boolean
  isView: boolean
  isCSV?: boolean
  closeAdd?: any
  saveAdd?: (isbn: string, quantity: number, price: number) => void
}

export default function SaleTableRow(props: SaleTableRowProp) {
  const [isbn, setIsbn] = useState(props.sale.bookId)
  const book = api.books.findInternalBook.useQuery({isbn:props.sale.bookId}).data
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
            <DeleteSaleModal price={salePrice} quantity={quantitySold}
                            bookTitle={(book) ? book.title : ""} onDelete={setVisible}
                            closeOut={closeDeleteSaleView} salesId={props.sale.id}></DeleteSaleModal>
          </CreateSaleEntries> : null}
    </>;
  }

  function closeDeleteSaleView() {
    setDeleteSaleView(false)

  }

  function saveNewSale() {
    toast.success("ready: " + isbn)
    props.saveAdd(isbn, quantitySold, salePrice)
  }

  return (
      <>
        {visible &&
        (props.isView ?
                <tr>
                  <LinkedBookTitle firstEntry={true} book={book}></LinkedBookTitle>
                  <TableEntry>${Number(salePrice).toFixed(2)}</TableEntry>
                  <TableEntry>{quantitySold}</TableEntry>
                  <TableEntry>${subtotal.toFixed(2)}</TableEntry>
                </tr>
                :
                (props.isAdding ? ((!props.isCSV || book) ?
                        <tr>
                          <BookCardProp saveFunction={setIsbn} defaultValue={props.isCSV ? ((book) ? book : {}) : {}}></BookCardProp>
                          <MutableCurrencyTableEntry saveValue={setSalePrice} heading="Retail Price"
                                                     required="True" dataType="number"
                                                     defaultValue={props.isCSV ? salePrice : ""}></MutableCurrencyTableEntry>
                          <MutableTableEntry saveValue={setQuantitySold} heading="Quantity Sold"
                                             required="True" dataType="number"
                                             defaultValue={props.isCSV ? quantitySold : ""}></MutableTableEntry>
                          <TableEntry>${subtotal.toFixed(2)}</TableEntry>
                          <SaveRowEntry onSave={saveNewSale}></SaveRowEntry>
                          <DeleteRowEntry onDelete={props.closeAdd} isbn={props.isCSV ? props.sale.bookId : undefined}></DeleteRowEntry>
                        </tr> : null )
                        :
                        (isEditing ?
                            <tr>
                              {/*<MutableTableEntry firstEntry={true} saveValue={} heading="book" datatype="string" defaultValue={(book) ? book.title : "" }></MutableTableEntry>*/}
                              <BookCardProp saveFunction={setIsbn} defaultValue={(book) ? book : {}} ></BookCardProp>
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
