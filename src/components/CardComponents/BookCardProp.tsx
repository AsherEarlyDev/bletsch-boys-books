import { PaperClipIcon } from '@heroicons/react/20/solid'
import { Dispatch, SetStateAction } from 'react';
import BookSelect from "./BookSelect";

export default function GenreCardProp(props:{saveFunction: any | undefined, defaultValue?:string}) {
  return (
      <div className="sm:col-span-1">
        <dt className="text-md font-medium text-gray-500">Book/ISBN</dt>
        <div className="flex justify-center">
          <BookSelect saveFunction = {props.saveFunction} defaultValue={props.defaultValue}></BookSelect>
        </div>
      </div>
  )
}
