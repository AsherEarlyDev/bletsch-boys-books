import { PaperClipIcon } from '@heroicons/react/20/solid'

export default function ImmutableCardProp(props) {
  return (
      <div className="sm:col-span-1">
        <dt className="text-md font-medium text-gray-500">{props.heading}</dt>
        <dd className="mt-2 text-sm text-gray-900">{props.data}</dd>
      </div>
  )
}
