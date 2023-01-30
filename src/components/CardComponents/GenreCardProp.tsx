import { PaperClipIcon } from '@heroicons/react/20/solid'
import GenreSelect from "../GenreSelect";

export default function GenreCardProp() {
  return (
      <div className="sm:col-span-1">
        <dt className="text-md font-medium text-gray-500">Genre</dt>
        <GenreSelect></GenreSelect>
      </div>
  )
}
