import {ChevronDownIcon} from '@heroicons/react/20/solid'
import { setDefaultResultOrder } from 'dns';
import React from "react";

interface FilterableColumnHeadingInterface  {
  label: string
  firstEntry?: boolean
  sortFields?: any
  databaseLabel: string
  currentField: string
  currentOrder: string
  setOrder: any,
  resetPage: any
}

export default function SortedFilterableColumnHeading(props: FilterableColumnHeadingInterface) {
function flipOrder(){
  if(props.currentField===props.databaseLabel){
    if(props.currentOrder === "desc") props.setOrder("asc")
    if(props.currentOrder === "asc") props.setOrder("desc")
  }
}

  if (props.firstEntry == true) {
    return (
        <th scope="col"
            className="py-3.5 px-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
          <button onClick={() => {
            flipOrder()
            props.resetPage(0)
            props.sortFields(props.databaseLabel)
          }
          } className="group inline-flex">
            {props.label}
            <span
                className="invisible ml-1 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                          <ChevronDownIcon className="h-5 w-5" aria-hidden="true"/>
                        </span>
          </button>
        </th>
    )
  }
  else{
    return (
        <th scope="col" className="pl-2 pr-1 py-3.5 text-left text-sm font-semibold text-gray-900">
            <button onClick={() =>  {
            flipOrder()
            props.resetPage(0)
            props.sortFields(props.databaseLabel)
          }
          } className="group inline-flex">
              {props.label}
              <span className="invisible ml-1 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                            <ChevronDownIcon
                                className="invisible ml-1 h-5 w-5 flex-none rounded text-gray-400 group-hover:visible group-focus:visible"
                                aria-hidden="true"
                            />
                          </span>
            </button>
          </th>
    )
  }
}
