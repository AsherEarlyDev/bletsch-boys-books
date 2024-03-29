import {ChevronDownIcon} from '@heroicons/react/20/solid'
import React from "react";

interface FilterableColumnHeadingInterface  {
  label: string
  firstEntry?: boolean
}

export default function FilterableColumnHeading(props: FilterableColumnHeadingInterface) {
  if (props.firstEntry == true) {
    return (
        <th scope="col"
            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
          <a className="group inline-flex">
            {props.label}
          </a>
        </th>
    )
  }
  else{
    return (
        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
            <a  className="group inline-flex">
              {props.label}
            </a>
          </th>
    )
  }
}