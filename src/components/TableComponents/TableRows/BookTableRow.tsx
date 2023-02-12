import {Author, Book, Genre } from "@prisma/client";
import TableEntry from "../TableEntries/TableEntry";
import React from "react";
import DeleteConfirmationModal from "../../DeleteConfirmationModal";
import ViewBookModal from "../ViewBookModal";
import {ArrowsPointingOutIcon} from "@heroicons/react/20/solid";
import ViewTableEntry from "../TableEntries/ViewTableEntry";
import EditRowEntry from "../TableEntries/EditRowEntry";
import DeleteRowEntry from "../TableEntries/DeleteRowEntry";

interface BookTableRowProp{
  bookInfo: Book  & {
  genre: Genre;
  author: Author[];}
  onEdit: (isbn:string) => void
  onDelete: (isbn:string)=> void
}


export default function BookTableRow(props:BookTableRowProp) {
  function handleEdit(){
    props.onEdit(props.bookInfo.isbn)
  }
  function confirmDelete(){
  }

  function handleDelete(){
    props.onDelete(props.bookInfo.isbn)
  }
  const isInStock: boolean = (props.bookInfo.inventory != 0)

  return (
      <tr>
        <TableEntry firstEntry={true}>
            <ViewTableEntry openEdit={handleEdit} bookInfo={props.bookInfo} buttonText={props.bookInfo.title} submitText="Edit Book"></ViewTableEntry>
        </TableEntry>
        <TableEntry>{props.bookInfo.isbn}</TableEntry>
        <TableEntry>{props.bookInfo.author.map((author) => author.name).join(", ")}</TableEntry>
        <TableEntry>{props.bookInfo.retailPrice}</TableEntry>
        <TableEntry>{props.bookInfo.genre.name}</TableEntry>
        <TableEntry>{props.bookInfo.inventory}</TableEntry>
        <EditRowEntry onEdit={handleEdit}></EditRowEntry>
        {isInStock ? null : <DeleteRowEntry onDelete={confirmDelete}></DeleteRowEntry>}
        <td>
          {isInStock ? null : <DeleteConfirmationModal disabled={props.bookInfo.inventory != 0} itemIdentifier={props.bookInfo.isbn} buttonText="Delete" submitText="DELETE BOOK"></DeleteConfirmationModal>}
        </td>
      </tr>
  )
}
