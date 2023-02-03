import { PaperClipIcon } from '@heroicons/react/20/solid'
import { Dispatch, SetStateAction } from 'react';
import GenreSelect from "./GenreSelect";

export default function GenreCardProp(props:{saveFunction: Dispatch<SetStateAction<{name: string;} | undefined>>}) {
  return (
      <div className="sm:col-span-1">
        <dt className="text-md font-medium text-gray-500">Genre</dt>
        <GenreSelect saveFunction = {props.saveFunction}></GenreSelect>
      </div>
  )
}
