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
          <a href="#" className="group inline-flex">
            {props.label}
            <span
                className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                          <ChevronDownIcon className="h-5 w-5" aria-hidden="true"/>
                        </span>
          </a>
        </th>
    )
  }
  else{
    return (
        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
            <a href="#" className="group inline-flex">
              {props.label}
              <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                            <ChevronDownIcon
                                className="invisible ml-2 h-5 w-5 flex-none rounded text-gray-400 group-hover:visible group-focus:visible"
                                aria-hidden="true"
                            />
                          </span>
            </a>
          </th>
    )
  }
}
