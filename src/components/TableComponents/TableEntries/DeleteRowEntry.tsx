import React from "react";
import {TrashIcon} from "@heroicons/react/20/solid";

interface DeleteRowEntryProp  {
  onDelete: () =>void
}

export default function DeleteRowEntry(props: DeleteRowEntryProp) {
  return(
      <td className="relative whitespace-nowrap py-2 px-1 text-right text-sm font-sm sm:pr-6">
        <button onClick={props.onDelete} className="text-indigo-600 hover:text-indigo-900">
          <TrashIcon className="h-4 w-4"/>
        </button>
      </td>
  )
}
