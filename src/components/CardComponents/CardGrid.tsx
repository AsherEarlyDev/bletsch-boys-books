import { PaperClipIcon } from '@heroicons/react/20/solid'
import ImmutableCardProp from "./ImmutableCardProp";
import MutableCardProp from "./MutableCardProp";
import GenreSelect from "./GenreSelect";
import GenreCardProp from "./GenreCardProp";

export default function CardGrid(props) {
  return (
      <div className="justify-items-center border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3">
          {props.children}
        </dl>
      </div>
  )
}
