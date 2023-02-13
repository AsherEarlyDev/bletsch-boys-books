import {Author, Book, Genre } from "@prisma/client";
import TableEntry from "../TableEntries/TableEntry";
import React from "react";
import DeleteConfirmationModal from "../../DeleteConfirmationModal";
import ViewTableEntry from "../TableEntries/ViewTableEntry";
import EditRowEntry from "../TableEntries/EditRowEntry";
import DeleteRowEntry from "../TableEntries/DeleteRowEntry";
import ViewTableEnt from "../TableEntries/ViewTableEnt";

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
        <ViewTableEnt onView={handleView}>{props.bookInfo.title}</ViewTableEnt>
        {/*<TableEntry firstEntry={true}>*/}
        {/*    <ViewTableEntry openEdit={handleEdit} bookInfo={props.bookInfo} buttonText={props.bookInfo.title} submitText="Edit Book"></ViewTableEntry>*/}
        {/*</TableEntry>*/}
        <TableEntry>{props.bookInfo.isbn}</TableEntry>
        <TableEntry>{props.bookInfo.author.map((author) => author.name).join(", ")}</TableEntry>
        <TableEntry>{props.bookInfo.retailPrice}</TableEntry>
        <TableEntry>{props.bookInfo.genre.name}</TableEntry>
        <TableEntry>{props.bookInfo.inventory}</TableEntry>
        <EditRowEntry onEdit={handleEdit}></EditRowEntry>
        {isInStock ? null : <DeleteRowEntry onDelete={handleDelete}></DeleteRowEntry>}
        {/*<td>*/}
        {/*  {isInStock ? null : <DeleteConfirmationModal disabled={props.bookInfo.inventory != 0} itemIdentifier={props.bookInfo.isbn} buttonText="Delete" submitText="DELETE BOOK"></DeleteConfirmationModal>}*/}
        {/*</td>*/}
      </tr>
  )
}
