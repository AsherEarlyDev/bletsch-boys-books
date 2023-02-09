import {Author, Book, Genre } from "@prisma/client";
import TableEntry from "./TableEntry";
import React from "react";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import ViewBookModal from "./ViewBookModal";
import {ArrowsPointingOutIcon} from "@heroicons/react/20/solid";

interface BookTableRowProp{
  bookInfo: Book  & {
  genre: Genre;
  author: Author[];}
  onEdit: (isbn:string) => void
}


export default function BookTableRow(props:BookTableRowProp) {
  function handleClick(){
    props.onEdit(props.bookInfo.isbn)
  }

  return (
      <tr>
        <TableEntry firstEntry={true}>
            <ViewBookModal openEdit={handleClick} bookInfo={props.bookInfo} buttonText={props.bookInfo.title} submitText="Edit Book"></ViewBookModal>
        </TableEntry>
        <TableEntry>{props.bookInfo.isbn}</TableEntry>
        <TableEntry>{props.bookInfo.author.map((author) => author.name).join(", ")}</TableEntry>
        <TableEntry>{props.bookInfo.retailPrice}</TableEntry>
        <TableEntry>{props.bookInfo.genre.name}</TableEntry>
        <TableEntry>{props.bookInfo.inventory}</TableEntry>
        
        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
          <button onClick={handleClick} className="text-indigo-600 hover:text-indigo-900">
            Edit<span className="sr-only">, {props.bookInfo.title}</span>
          </button>
        </td>
        <td>
          <DeleteConfirmationModal itemIdentifier={props.bookInfo.isbn} buttonText="Delete" submitText="DELETE BOOK"></DeleteConfirmationModal>
        </td>
      </tr>
  )
}
