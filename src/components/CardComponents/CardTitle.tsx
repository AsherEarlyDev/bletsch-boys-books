import { PaperClipIcon } from '@heroicons/react/20/solid'
import ImmutableCardProp from "./ImmutableCardProp";
import MutableCardProp from "./MutableCardProp";
import GenreSelect from "./GenreSelect";
import GenreCardProp from "./GenreCardProp";

export default function CardTitle(props) {
  return (
      <div className="px-4 py-5 sm:px-6 flex flex-col justify-items-center">
        <h3 className="text-lg font-medium leading-6 text-gray-900">{props.heading}</h3>
        <h5 className=" text-sm text-gray-500 justify-center">{props.subheading}</h5>
        {props.secondSubheading!=undefined ? <h5 className=" text-sm text-gray-500 justify-center">{props.secondSubheading}</h5> : null }
      </div>
  )
}
