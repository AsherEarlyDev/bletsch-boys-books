import {Author, Book, Genre } from "@prisma/client";
import TableEntry from "./TableEntry";
import React from "react";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import EditGenreModal from "../EditGenreModal";

interface GenreTableRowProp{
  genre: Genre;
  onEdit: (isbn:string) => void
}


export default function GenreTableRow(props:GenreTableRowProp) {
  function handleClick(){
    // props.onEdit(props.bookInfo.isbn)
  }

  return (
      <tr>
        <TableEntry firstEntry={true}>{props.genre.name}</TableEntry>       
        <td><EditGenreModal itemIdentifier={props.genre.name} buttonText="Edit" submitText="Submit Edit"></EditGenreModal></td>
        <td><DeleteConfirmationModal genre = {true} itemIdentifier={props.genre.name} buttonText="Delete" submitText="DELETE GENRE"></DeleteConfirmationModal></td>
        
      </tr>
  )
}
