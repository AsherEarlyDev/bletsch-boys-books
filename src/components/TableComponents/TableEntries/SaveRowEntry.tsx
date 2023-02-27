import React from "react";
import {CheckIcon, PencilSquareIcon} from "@heroicons/react/24/solid";

interface SaveRowEntryProps{
  onSave: () =>void
}

export default function SaveRowEntry(props: SaveRowEntryProps) {
  return(
      <td className="relative whitespace-nowrap py-1 px-1 text-left text-sm font-bold sm:pr-6">
        <button onClick={props.onSave} className="text-green-600 hover:text-green-900">
          <CheckIcon className="h-5 w-5"/>
        </button>
      </td>
  )
}
