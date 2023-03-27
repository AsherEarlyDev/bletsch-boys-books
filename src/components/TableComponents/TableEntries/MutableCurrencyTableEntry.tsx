import React from "react";
import CurrencyInput from "react-currency-input-field";
import {CurrencyDollarIcon} from "@heroicons/react/20/solid";

export default function MutableCurrencyTableEntry(props:any) {
  const classProps = "mt-1 p-1 block text-sm text-gray-900 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm w-" + props.width
  const handleChange = (event: { target: { value: any; }; }) => {
    props.saveValue(parseFloat(event.target.value))
  };
  return (
      <td className="whitespace-nowrap px-2 py-4 text-sm text-gray-500">
        <div className="text-left">
          <input
              placeholder={props.defaultValue ? ("$" + Number(props.defaultValue).toFixed(2) ?? ""): null}
              type={props.dataType}
              name={props.heading}
              step="0.01"
              id={props.heading}
              required={props.required}
              onChange={handleChange}
              min="0"
              className={classProps}
          />
        </div>
      </td>
  )
}
MutableCurrencyTableEntry.defaultProps= {
  width: 32
}
