import React from "react";

export default function MutableStateTableEntry(props:any) {
  const classProps="mt-1 p-1 block text-sm text-gray-900 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm w-" + props.width
  const handleChange = (event: { target: { value: any; }; }) => {
    props.saveValue(event.target.value)
  };
  return (
      <td className="whitespace-nowrap px-2 py-4 text-sm text-gray-500">
        <div className="text-left">
          <input
              placeholder={props.defaultValue}
              type={props.dataType}
              name={props.heading}
              id={props.heading}
              required={props.required}
              onChange={handleChange}
              min="0"
              className={classProps}
              value={props.stateValue}
          />
        </div>
      </td>
  )
}
MutableStateTableEntry.defaultProps={
  width: 32
}
