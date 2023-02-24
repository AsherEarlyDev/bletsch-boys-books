import {Author, Book, Genre } from "@prisma/client";
import TableEntry from "../TableEntries/TableEntry";
import React from "react";
import { CldImage, CldUploadButton, CldUploadWidget } from 'next-cloudinary'
import EditRowEntry from "../TableEntries/EditRowEntry";
import DeleteRowEntry from "../TableEntries/DeleteRowEntry";
import ViewTableEntry from "../TableEntries/ViewTableEntry";

interface BookTableRowProp{
  bookInfo: Book  & {
    genre: Genre;
    author: Author[];}
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
        <ViewTableEntry hasThumbnail={true} onView={handleView}>
          {props.bookInfo.title}
        </ViewTableEntry>
        <TableEntry>{props.bookInfo.isbn}</TableEntry>
        <TableEntry>{props.bookInfo.author.map((author) => author.name).join(", ")}</TableEntry>
        <TableEntry>{props.bookInfo.genre.name}</TableEntry>
        <TableEntry>${props.bookInfo.retailPrice.toFixed(2)}</TableEntry>
        <TableEntry>{props.bookInfo.inventory}</TableEntry>
        <EditRowEntry onEdit={handleEdit}></EditRowEntry>
        {isInStock ? null : <DeleteRowEntry onDelete={handleDelete}></DeleteRowEntry>}
      </tr>
  )
}
