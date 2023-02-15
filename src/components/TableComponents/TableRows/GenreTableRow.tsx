import {Author, Book, Genre } from "@prisma/client";
import TableEntry from "../TableEntries/TableEntry";
import React from "react";
import DeleteConfirmationModal from "../../DeleteConfirmationModal";
import EditGenreModal from "../../EditGenreModal";
import { api } from "../../../utils/api";
import EditRowEntry from "../TableEntries/EditRowEntry";
import DeleteRowEntry from "../TableEntries/DeleteRowEntry";

interface GenreTableRowProp{
  genre: Genre;
  setGenreFilter: any
  onEdit: () => void
  onDelete: () => void
}


export default function GenreTableRow(props:GenreTableRowProp) {
  const inventory = api.genre.getGenreInventory.useQuery(props.genre.name).data

  return (
      <tr>
        <button onClick={()=>props.setGenreFilter(props.genre.name)}><TableEntry firstEntry={true}>{props.genre.name}</TableEntry></button>
        <TableEntry>{inventory}</TableEntry>
        <EditGenreModal itemIdentifier={props.genre.name} buttonText="Edit" submitText="Submit Edit"></EditGenreModal>
        {(inventory != 0) ? null : <DeleteConfirmationModal genre = {true} itemIdentifier={props.genre.name} submitText="Delete Genre"></DeleteConfirmationModal>}
        
      </tr>
  )
}
