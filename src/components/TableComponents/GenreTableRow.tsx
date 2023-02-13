import {Author, Book, Genre } from "@prisma/client";
import TableEntry from "./TableEntry";
import React from "react";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import EditGenreModal from "../EditGenreModal";
import { api } from "../../utils/api";

interface GenreTableRowProp{
  genre: Genre;
  setGenreFilter: any
}


export default function GenreTableRow(props:GenreTableRowProp) {

  const inventory = api.genre.getGenreInventory.useQuery(props.genre.name).data

  return (
      <tr>
        <button onClick={()=>props.setGenreFilter(props.genre.name)}><TableEntry firstEntry={true}>{props.genre.name}</TableEntry></button>
        <td><TableEntry>{inventory}</TableEntry></td>       
        <td><EditGenreModal itemIdentifier={props.genre.name} buttonText="Edit" submitText="Submit Edit"></EditGenreModal></td>
        <td><DeleteConfirmationModal disabled={inventory != 0} genre = {true} itemIdentifier={props.genre.name} buttonText="Delete" submitText="DELETE GENRE"></DeleteConfirmationModal></td>
        
      </tr>
  )
}
