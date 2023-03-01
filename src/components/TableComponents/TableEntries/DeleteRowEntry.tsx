import React from "react";
import {TrashIcon} from "@heroicons/react/20/solid";

interface DeleteRowEntryProp  {
  onDelete:any
  isbn?: string
}

export default function DeleteRowEntry(props: DeleteRowEntryProp) {
  return(
      <td className="relative whitespace-nowrap py-2 px-1 text-left text-sm font-sm sm:pr-6">
        <button onClick={props.isbn? () => {
          props.onDelete(props.isbn)
          console.log(props.isbn)
          } : props.onDelete} className="text-red-600 hover:text-red-900">
          <TrashIcon className="h-4 w-4"/>
        </button>
      </td>
  )
}
