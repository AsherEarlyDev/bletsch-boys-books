import {ChevronDownIcon} from '@heroicons/react/20/solid'
import React from "react";

interface ColumnHeadingInterface  {
  label: string
}

export default function ColumnHeading(props: ColumnHeadingInterface) {
    return (
        <th scope="col" className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
          {props.label}
        </th>
    )
}
