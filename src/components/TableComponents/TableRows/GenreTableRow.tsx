import {Author, Book, Genre } from "@prisma/client";
import TableEntry from "../TableEntries/TableEntry";
import React from "react";
import DeleteConfirmationModal from "../Modals/GenreModals/DeleteConfirmationModal";
import EditGenreModal from "../Modals/GenreModals/EditGenreModal";
import { api } from "../../../utils/api";

interface GenreTableRowProp{
  genre: Genre;
}


export default function GenreTableRow(props:GenreTableRowProp) {
  const genreInventory = api.genre.getGenreInventory.useQuery(props.genre.name).data
  const genreHasBooks = (genreInventory != 0)

  return (
      <tr>
        <button><TableEntry firstEntry={true}>{props.genre.name}</TableEntry></button>
        <TableEntry>{genreInventory}</TableEntry>
        <EditGenreModal itemIdentifier={props.genre.name} buttonText="Edit" submitText="Submit Edit"></EditGenreModal>
        {genreHasBooks ? null : <DeleteConfirmationModal genre = {true} itemIdentifier={props.genre.name} submitText="Delete Genre"></DeleteConfirmationModal>}
      </tr>
  )
}
