import {Author, Book, Genre } from "@prisma/client";
import TableEntry from "../TableEntries/TableEntry";
import React from "react";
import { CldImage, CldUploadButton, CldUploadWidget } from 'next-cloudinary'
import EditRowEntry from "../TableEntries/EditRowEntry";
import DeleteRowEntry from "../TableEntries/DeleteRowEntry";
import ViewTableEntry from "../TableEntries/ViewTableEntry";

interface BookTableRowProp{
  bookInfo: any
  onEdit: (isbn:string) => void
  onDelete: (isbn:string)=> void
  onView: (isbn:string)=> void
}


export default function BookTableRow(props:BookTableRowProp) {
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
        <TableEntry>{props.bookInfo.genre.name}</TableEntry>
        <TableEntry>${props.bookInfo.retailPrice.toFixed(2)}</TableEntry>
        <TableEntry>{props.bookInfo.inventory}</TableEntry>
        <TableEntry>{props.bookInfo.lastMonthSales}</TableEntry>
        <TableEntry>{props.bookInfo.dimensions[1] || props.bookInfo.shelfSpace==0 ? props.bookInfo.shelfSpace : props.bookInfo.shelfSpace+" (est)"}</TableEntry>
        <TableEntry>{props.bookInfo.daysOfSupply}</TableEntry>
        <TableEntry>{props.bookInfo.bestBuybackPrice==0 ? "-" : props.bookInfo.bestBuybackPrice}</TableEntry>
        <EditRowEntry onEdit={handleEdit}></EditRowEntry>
        {isInStock ? null : <DeleteRowEntry onDelete={handleDelete}></DeleteRowEntry>}
      </tr>
  )
}
