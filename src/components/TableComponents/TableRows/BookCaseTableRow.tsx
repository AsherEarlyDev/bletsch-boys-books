import {Author, Book, Genre } from "@prisma/client";
import TableEntry from "../TableEntries/TableEntry";
import React from "react";
import { CldImage, CldUploadButton, CldUploadWidget } from 'next-cloudinary'
import EditRowEntry from "../TableEntries/EditRowEntry";
import DeleteRowEntry from "../TableEntries/DeleteRowEntry";
import ViewTableEntry from "../TableEntries/ViewTableEntry";

interface BookCaseTableRowProp{
  bookCaseInfo: any
  onDelete?: (isbn:string)=> void
  onView: (isbn:any)=> void
}


export default function BookCaseTableRow(props:BookCaseTableRowProp) {

  function handleDelete(){
    props.onDelete(props.bookCaseInfo)
  }
  function handleView(){
    props.onView(props.bookCaseInfo)
  }

  return (
      <tr>
        <TableEntry firstEntry={true}>{props.bookCaseInfo.name}</TableEntry>
        <TableEntry >{props.bookCaseInfo.width}</TableEntry>
        <TableEntry >{props.bookCaseInfo.numShelves}</TableEntry>
        <EditRowEntry onEdit={handleView}></EditRowEntry>
        <DeleteRowEntry onDelete={handleDelete}></DeleteRowEntry>
      </tr>
  )
}
