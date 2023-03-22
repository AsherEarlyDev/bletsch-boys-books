import TableEntry from "../TableEntries/TableEntry";
import React, {useState} from "react";
import {api} from "../../../utils/api";
import {Purchase} from "../../../types/purchaseTypes";
import LinkedBookTitle from "../../BasicComponents/DynamicRouting/LinkedBookTitle";

interface PurchaseTableRowProp {
  purchase: Purchase
  isCSV?: boolean
  closeAdd?: any
  saveAdd?: (isbn: string, quantity: number, price: number) => void
}

export default function PurchaseTableViewRow(props: PurchaseTableRowProp) {
  const book = api.books.findInternalBook.useQuery({isbn: props.purchase.bookId}).data
  const defaultPrice = props.purchase?.price
  const subtotal = (props.purchase.subtotal ?? props.purchase.quantity * props.purchase.price)
  return (
      <>
        <tr>
          <LinkedBookTitle firstEntry={true} book={book}></LinkedBookTitle>
          <TableEntry>${Number(defaultPrice).toFixed(2)}</TableEntry>
          <TableEntry>{props.purchase.quantity}</TableEntry>
          <TableEntry>${subtotal.toFixed(2)}</TableEntry>
        </tr>
      </>
  )
}
