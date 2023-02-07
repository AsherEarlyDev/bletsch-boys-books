import React from "react";

interface TableEntryInterface  {
  children: React.ReactNode
  firstEntry?: boolean
}

export default function TableEntry(props: TableEntryInterface) {
  if (props.firstEntry == true) {
    return (
        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
          {props.children}
        </td>
    )
  }
  else{
    return (
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{props.children}</td>
    )
  }
}
