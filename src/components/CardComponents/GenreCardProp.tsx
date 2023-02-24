import { PaperClipIcon } from '@heroicons/react/20/solid'
import { Dispatch, SetStateAction } from 'react';
import GenreSelect from "./GenreSelect";

export default function GenreCardProp(props:{saveFunction: Dispatch<SetStateAction<{name: string;} | undefined>>, defaultValue?:string}) {
  return (
      <div className="sm:col-span-1">
        <dt className="text-md font-medium text-gray-500">Genre</dt>
        <div className="flex justify-center">
          <GenreSelect saveFunction = {props.saveFunction} defaultValue={props.defaultValue}></GenreSelect>
        </div>
      </div>
  )
}
