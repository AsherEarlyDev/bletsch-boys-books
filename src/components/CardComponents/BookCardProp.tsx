import { PaperClipIcon } from '@heroicons/react/20/solid'
import { Dispatch, SetStateAction } from 'react';
import BookSelect from "./BookSelect";

export default function BookCardProp(props:{saveFunction: any | undefined, defaultValue?:any}) {
  return (
      <div className="sm:col-span-1">
        <td className="whitespace-nowrap px-2 py-4 text-sm text-gray-500">
          <BookSelect saveFunction = {props.saveFunction} defaultValue={props.defaultValue}></BookSelect>
        </td>
      </div>
  )
}
