import React from "react";
import {PencilSquareIcon} from "@heroicons/react/20/solid";

interface EditRowEntryProp  {
  onEdit: () =>void
}

export default function EditRowEntry(props: EditRowEntryProp) {
  return(
      <td className="relative whitespace-nowrap py-2 px-1 text-left text-sm font-medium sm:pr-6">
        <button onClick={props.onEdit} className="text-indigo-600 hover:text-indigo-900">
          <PencilSquareIcon className="h-4 w-4"/>
        </button>
      </td>
  )
}
