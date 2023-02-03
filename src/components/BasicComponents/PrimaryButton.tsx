import { PaperClipIcon } from '@heroicons/react/20/solid'
import GenreSelect from "../CardComponents/GenreSelect";


export default function PrimaryButton(props: { onClick: ()=> void; buttonText: string}) {
  return (
      <button
          type="button"
          className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
          onClick={props.onClick}
      >
        {props.buttonText}
      </button>
  )
}
