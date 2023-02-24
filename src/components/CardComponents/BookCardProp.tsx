import { PaperClipIcon } from '@heroicons/react/20/solid'
import { Dispatch, SetStateAction } from 'react';
import BookSelect from "./BookSelect";

export default function BookCardProp(props:{saveFunction: any | undefined, defaultValue?:string, displayTitleOrISBN:"title" | "isbn"}) {
  return (
      <div className="sm:col-span-1">
        <dt className="text-md font-medium text-gray-500">Book/ISBN</dt>
        <div className="flex justify-center">
          <BookSelect saveFunction = {props.saveFunction} defaultValue={props.defaultValue} displayTitleOrISBN={props.displayTitleOrISBN}></BookSelect>
        </div>
      </div>
  )
}
