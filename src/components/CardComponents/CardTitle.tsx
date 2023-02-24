import { PaperClipIcon } from '@heroicons/react/20/solid'
import ImmutableCardProp from "./ImmutableCardProp";
import MutableCardProp from "./MutableCardProp";
import GenreSelect from "./GenreSelect";
import GenreCardProp from "./GenreCardProp";

export default function CardTitle(props) {
  return (
      <div className="px-4 py-5 sm:px-6 flex flex-col justify-items-center">
        <h3 className="text-lg font-medium leading-6 text-gray-900">{props.heading}</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">{props.subheading}</p>
      </div>
  )
}
