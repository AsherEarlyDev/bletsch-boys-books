import React from "react";

export default function MutableTableEntry(props:any) {
  const handleChange = (event: { target: { value: any; }; }) => {
    props.saveValue(event.target.value)
  };
  return (
      <td className="whitespace-nowrap px-2 py-4 text-sm text-gray-500">
        <div className="text-left overflow-hidden truncate w-32">
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
        </div>
      </td>
  )
}
