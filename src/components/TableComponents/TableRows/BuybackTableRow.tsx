import React, {useState} from "react";
import {api} from "../../../utils/api";
import {toast} from "react-toastify";
import { Buyback } from "../../../types/buybackTypes";
import TableRow from "./Parent/TableRow";

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
  const defaultPrice = props.buyback?.buybackPrice
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
  
  function editBuyback() {
    if (props.buyback) {
      modBuyback.mutate({
        id: props.buyback.id,
        orderId: props.buyback.buybackOrderId,
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

 

  return (
      <TableRow
      type="Buyback"
      item={props.buyback}
      vendorId={props.vendorId}
      isAdding={props.isAdding}
      isView={props.isView}
      isCSV={props.isCSV ? props.isCSV : null}
      closeAdd={props.closeAdd ? props.closeAdd : null}
      saveAdd={props.saveAdd ? props.saveAdd : null}
      mod={editBuyback}
      ></TableRow>
  )
}
