import React from "react";

interface MutableDimensionsTableEntryProps{
  defaultLength: number
  defaultWidth: number
  defaultHeight: number
  saveLength: any
  saveWidth: any
  saveHeight: any
}

export default function MutableDimensionsTableEntry(props: MutableDimensionsTableEntryProps) {
  function handleChangeLength(event: { target: { value: any; }; }){
    props.saveLength(event.target.value)
  };
  function handleChangeWidth(event: { target: { value: any; }; }){
    props.saveWidth(event.target.value)
  };
  function handleChangeHeight(event: { target: { value: any; }; }){
    props.saveHeight(event.target.value)
  };
  return (
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <div className="text-left flex flex-row gap-1 w-32">
          <input
              placeholder={props.defaultLength ? props.defaultLength.toString() : null}
              type="number"
              name="dimensions"
              id="dimensions"
              required={false}
              onChange={handleChangeLength}
              min="0"
              className="mt-1 p-1 block w-8 text-sm text-gray-900 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <div className="pt-3 text-xs font-normal text-gray-500">
            X
          </div>
          <input
              placeholder={props.defaultWidth ? props.defaultWidth.toString() : null}
              type="number"
              name="dimensions"
              id="dimensions"
              required={false}
              onChange={handleChangeWidth}
              min="0"
              className="mt-1 p-1 block w-8 text-sm text-gray-900 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <div className="pt-3 text-xs font-normal text-gray-500">
            X
          </div>
          <input
              placeholder={props.defaultHeight ? props.defaultHeight.toString() : null}
              type="number"
              name="dimensions"
              id="dimensions"
              required={false}
              onChange={handleChangeHeight}
              min="0"
              className="mt-1 p-1 block w-8 text-sm text-gray-900 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </td>
  )
}
