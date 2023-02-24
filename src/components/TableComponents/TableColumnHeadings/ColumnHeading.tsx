import {ChevronDownIcon} from '@heroicons/react/20/solid'
import React from "react";

interface ColumnHeadingInterface  {
  label: string
  firstEntry?: boolean
}

export default function ColumnHeading(props: ColumnHeadingInterface) {
  if (props.firstEntry == true) {
    return (
        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
          {props.label}
        </th>
    )
  }
  else{
    return (
        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
          {props.label}
        </th>
    )
  }
}
