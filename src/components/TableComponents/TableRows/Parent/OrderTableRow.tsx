import TableEntry from "../../TableEntries/TableEntry";
import React from "react";
import { PurchaseOrder } from "../../../../types/purchaseTypes";
import ViewTableEntry from "../../TableEntries/ViewTableEntry";
import DeleteRowEntry from "../../TableEntries/DeleteRowEntry";
import EditRowEntry from "../../TableEntries/EditRowEntry";
import DeleteEntryModal from "../../Modals/MasterModals/DeleteEntryModal";
import {api} from "../../../../utils/api";

interface OrderTableRowProp{
    OrderInfo: {
        id: string,
        date: string,
        vendor: {id: string, name: string, bookBuybackPercentage: number}
        items: any[],
        totalBooks: number,
        uniqueBooks: number,
        cost?: number
        revenue?: number
        userName: string
    },
    item: string,
    onEdit: (id:string) => void,
    onView: (id: string) =>void,
  }


export default function OrderTableRow(props:OrderTableRowProp) {
    let price: any = props.OrderInfo.cost ? props.OrderInfo.cost : props.OrderInfo.revenue
    if (price === undefined){
      price = "0.00"
    }
    else{
      price = price.toFixed(2)
    }
    function handleEdit(){
        props.onEdit(props.OrderInfo.id)
      }
    function handleView(){
      props.onView(props.OrderInfo.id)
      }
  return (
      <tr>
        <ViewTableEntry onView={handleView}>{props.OrderInfo.date}</ViewTableEntry>
        <TableEntry>{props.OrderInfo.vendor.name}</TableEntry>
        <TableEntry>{props.OrderInfo.uniqueBooks}</TableEntry>
        <TableEntry>{props.OrderInfo.totalBooks}</TableEntry>
        <TableEntry>${price}</TableEntry>
        <TableEntry>{props.OrderInfo.userName}</TableEntry>
        <EditRowEntry onEdit={handleEdit}></EditRowEntry>
        <DeleteEntryModal id={props.OrderInfo.id} item={props.item} router={(props.item=="Buyback Order" ? api.buybackOrder.deleteBuybackOrder : api.purchaseOrder.deletePurchaseOrder)}></DeleteEntryModal>
      </tr>
  )
}
