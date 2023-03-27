import {Author, Book, Genre } from "@prisma/client";
import TableEntry from "../TableEntries/TableEntry";
import React from "react";
import DeleteConfirmationModal from "../Modals/GenreModals/DeleteConfirmationModal";
import EditGenreModal from "../Modals/GenreModals/EditGenreModal";
import { api } from "../../../utils/api";
import { useRouter } from 'next/router'
import Link from "next/link";
import {useSession} from "next-auth/react";

interface GenreTableRowProp{
  genre: Genre;
}


export default function GenreTableRow(props:GenreTableRowProp) {
  const genreInventory = api.genre.getGenreInventory.useQuery(props.genre.name).data
  const genreHasBooks = (genreInventory != 0)
  const {data, status} = useSession()
  const isAdmin = (data?.user.role == "ADMIN" || data?.user.role == "SUPERADMIN")
  const router = useRouter()
  
  return (
      <tr>
        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
        <div>
          <Link href={{pathname: '/books', query:{genre:props.genre.name}}}>
          <button  className = "italic text-indigo-600 hover:text-indigo-900 inline-flex group w-80">
              <div className="text-left overflow-hidden truncate w-60">
                {props.genre.name}
              </div>
            </button>
          </Link>
        </div>
        </td>
        <TableEntry>{genreInventory}</TableEntry>
        {isAdmin && <EditGenreModal itemIdentifier={props.genre.name} buttonText="Edit" submitText="Submit Edit"></EditGenreModal>}
        {isAdmin && (genreHasBooks ? null : <DeleteConfirmationModal genre = {true} itemIdentifier={props.genre.name} submitText="Delete Genre"></DeleteConfirmationModal>)}
      </tr>
  )
}
