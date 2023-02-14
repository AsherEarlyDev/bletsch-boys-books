import React from "react";

interface TableEntryWithTagsInterface  {
  children: React.ReactNode
  firstEntry?: boolean
  isExisting: boolean
}

export default function TableEntryWithTag(props: TableEntryWithTagsInterface) {
  if (props.firstEntry == true) {
    return (
        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
          <div className="flex flex-row">
            <div className="text-left overflow-hidden truncate w-60">
              {props.children}
            </div>
            <div>
              {props.isExisting ?
                  <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">Old</span> :
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">New</span>}
            </div>
          </div>

        </td>
    )
  }
  else{
    return (
        <td className="whitespace-nowrap px-2 py-4 text-sm text-gray-500">
          <div className="text-left overflow-hidden truncate w-32">
            {props.children}
          </div>
        </td>
    )
  }
}
