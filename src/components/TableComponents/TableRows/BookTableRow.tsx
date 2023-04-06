import {Author, Book, Genre } from "@prisma/client";
import TableEntry from "../TableEntries/TableEntry";
import React from "react";
import { CldImage, CldUploadButton, CldUploadWidget } from 'next-cloudinary'
import EditRowEntry from "../TableEntries/EditRowEntry";
import DeleteRowEntry from "../TableEntries/DeleteRowEntry";
import ViewTableEntry from "../TableEntries/ViewTableEntry";
import {useSession} from "next-auth/react";

interface BookTableRowProp{
  bookInfo: any
  onEdit: (isbn:string) => void
  onDelete: (isbn:string)=> void
  onView: (isbn:string)=> void
}


export default function BookTableRow(props:BookTableRowProp) {
  const {data, status} = useSession()
  const isAdmin = (data.user?.role == "ADMIN" || data.user?.role == "SUPERADMIN")
  const isInStock: boolean = (props.bookInfo.inventory != 0)
  function handleEdit(){
    props.onEdit(props.bookInfo.isbn)
  }
  function handleDelete(){
    props.onDelete(props.bookInfo.isbn)
  }
  function handleView(){
    props.onView(props.bookInfo.isbn)
  }

  return (
      <tr>
        <ViewTableEntry imageUrl={props.bookInfo?.imageLink} hasThumbnail={true} onView={handleView}>
          {props.bookInfo.title}
        </ViewTableEntry>
        <TableEntry>{props.bookInfo.isbn}</TableEntry>
        <TableEntry>{props.bookInfo.author.map((author) => author.name).join(", ")}</TableEntry>
        <TableEntry width={28}>{props.bookInfo.genre.name}</TableEntry>
        <TableEntry width={20}>${props.bookInfo.retailPrice.toFixed(2)}</TableEntry>
        <TableEntry width={20}>{props.bookInfo.inventory}</TableEntry>
        <TableEntry width={20}>{props.bookInfo.lastMonthSales}</TableEntry>
        <TableEntry width={16}>{(props.bookInfo.dimensions[1] ?? props.bookInfo.shelfSpace==0)? props.bookInfo.shelfSpace.toFixed(1) + "\"" : (props.bookInfo.shelfSpace)?.toFixed(1)+"\" (est)"}</TableEntry>
        <TableEntry width={12}>{(props.bookInfo.daysOfSupply == Infinity ? "Inf." : props.bookInfo.daysOfSupply?.toFixed(2) )}</TableEntry>
        <TableEntry width={12}>{props.bookInfo.bestBuybackPrice==0 ? "-" : "$" + props.bookInfo.bestBuybackPrice.toFixed(2)}</TableEntry>
        <TableEntry width={12}>{props.bookInfo.numberRelatedBooks}</TableEntry>
        <TableEntry width={20}>{props.bookInfo.subsidaryBook ? props.bookInfo.subsidaryBook.inventoryCount : "-"}</TableEntry>
        <TableEntry width={20}>${props.bookInfo.subsidaryBook ? (props.bookInfo.subsidaryBook.retailPrice).toFixed(2) : "-"}</TableEntry>
        {(isAdmin && <EditRowEntry onEdit={handleEdit}></EditRowEntry>)}
        {isAdmin && (isInStock ? null : <DeleteRowEntry onDelete={handleDelete}></DeleteRowEntry>)}
      </tr>
  )
}
