import TableEntry from "../../TableEntries/TableEntry";
import React from "react";
import { PurchaseOrder } from "../../../../types/purchaseTypes";
import ViewTableEntry from "../../TableEntries/ViewTableEntry";
import DeleteRowEntry from "../../TableEntries/DeleteRowEntry";
import EditRowEntry from "../../TableEntries/EditRowEntry";
import {useSession} from "next-auth/react";

interface OrderTableRowProp{
    OrderInfo: {
        id: string,
        date: string,
        items: any[],
        totalBooks: number,
        uniqueBooks: number,
        vendor?: {id: string, name: string, bookBuybackPercentage: number},
        cost?: number,
        revenue?: number,
        userName: string
    },
    type: string,
    onEdit: (id:string) => void,
    onDelete: (id: string) =>void,
    onView: (id: string) =>void,
  }


export default function OrderTableRow(props:OrderTableRowProp) {
    const {data, status} = useSession()
    const isAdmin = (data?.user.role == "ADMIN" || data?.user.role == "SUPERADMIN")
    console.log(props.OrderInfo)
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
    function handleDelete(){
      props.onDelete(props.OrderInfo.id)
      }
    function handleView(){
      props.onView(props.OrderInfo.id)
      }
  return (
      <tr>
        <ViewTableEntry onView={handleView}>{props.OrderInfo.date}</ViewTableEntry>
        {props.type === "Sale" ? null : <TableEntry>{props.OrderInfo.vendor.name}</TableEntry>}
        <TableEntry>{props.OrderInfo.uniqueBooks}</TableEntry>
        <TableEntry>{props.OrderInfo.totalBooks}</TableEntry>
        <TableEntry>${price}</TableEntry>
        {props.type != "Sale" && <TableEntry>{props.OrderInfo.userName}</TableEntry>}
        {isAdmin && (props.type === "Sale" ? <><DeleteRowEntry onDelete={handleDelete}></DeleteRowEntry></>
         : <><EditRowEntry onEdit={handleEdit}></EditRowEntry><DeleteRowEntry onDelete={handleDelete}></DeleteRowEntry></>)}
        
      </tr>
  )
}
