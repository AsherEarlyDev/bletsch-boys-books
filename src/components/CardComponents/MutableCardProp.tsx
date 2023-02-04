import { PaperClipIcon } from '@heroicons/react/20/solid'

export default function MutableCardProp(props:any) {
  const handleChange = (event: { target: { value: any; }; }) => {
    props.saveValue(event.target.value)
  };
  return (
      <div className="sm:col-span-1">
        <dt className="text-md font-medium text-gray-500">
          <label htmlFor={props.heading}>
            {props.heading}
          </label>
        </dt>
        <dd className="mt-1 text-sm text-gray-900">
          <input
              placeholder={props.defaultValue}
              type={props.dataType}
              name={props.heading}
              id={props.heading}
              required={props.required}
              onChange={handleChange}
              min="0"
              className="mt-1 p-1 block w-44 text-sm text-gray-900 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </dd>
      </div>
  )
}
