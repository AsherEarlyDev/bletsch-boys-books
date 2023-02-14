import React from "react";
import {TrashIcon} from "@heroicons/react/20/solid";

interface EditRowEntryProp  {
  onEdit: () =>void
}

export default function EditRowEntry(props: EditRowEntryProp) {
  return(
      <td className="relative whitespace-nowrap py-4 pl-1 text-right text-sm font-medium sm:pr-6">
        <button onClick={props.onEdit} className="text-indigo-600 hover:text-indigo-900">
          Edit
        </button>
      </td>
  )
}
