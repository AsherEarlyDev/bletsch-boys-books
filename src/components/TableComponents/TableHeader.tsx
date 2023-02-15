import React from "react";

interface TableHeaderInterface  {
  children: React.ReactNode
}

export default function TableHeader(props: TableHeaderInterface) {
  return (
      <thead className="bg-gray-50">
      <tr>
        {props.children}
      </tr>
      </thead>
  )
}
