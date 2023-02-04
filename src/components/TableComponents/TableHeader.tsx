import React from "react";

interface TableHeaderInterface  {
  children: React.ReactNode
}

export default function TableHeader(props: TableHeaderInterface) {
  return (
      <thead className="bg-gray-50">
      <tr>
        {props.children}
        <th scope="col" className="relative py-3.5 pl-3 pr-0 sm:pr-6">
          <span className="sr-only">Edit</span>
        </th>
      </tr>
      </thead>
  )
}
