import React from "react";

interface TableDetailsInterface  {
  children: React.ReactNode
  tableName: string
  tableDescription: string
}

export default function TableDetails(props: TableDetailsInterface) {
  return (
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">{props.tableName}</h1>
          <p className="mt-2 text-sm text-gray-700">
            {props.tableDescription}
          </p>
        </div>
        {props.children}
      </div>
  )
}
