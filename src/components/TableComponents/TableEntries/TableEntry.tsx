import React from "react";

interface TableEntryInterface  {
  children: React.ReactNode
  firstEntry?: boolean
  width: number
}

export default function TableEntry(props: TableEntryInterface) {
  const dynamicClass = "text-left overflow-hidden truncate w-" + props.width
  if (props.firstEntry == true) {
    return (
        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
          <div className="text-left overflow-hidden truncate w-60">
            {props.children}
          </div>
        </td>
    )
  }
  else{
    return (
        <td className="whitespace-nowrap px-2 py-4 text-sm text-gray-500">
          <div className={dynamicClass}>
            {props.children}
          </div>
        </td>
    )
  }
}

TableEntry.defaultProps = {
  width: 32
}
