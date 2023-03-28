import React from "react";
import Link from "next/link";

interface TableEntryInterface  {
  book
  firstEntry?: boolean
  width: number
}

export default function LinkedBookTitle(props: TableEntryInterface) {
  const dynamicClass = "text-left overflow-hidden truncate w-" + props.width
  if (props.firstEntry == true) {
    return (
        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
          <div><Link href={{pathname:'/books', query:{openView:"true",viewId: props.book?.isbn}}}>
            <button  className = "text-indigo-600 hover:text-indigo-900 inline-flex group w-80">
              <div className="text-left overflow-hidden truncate w-60">
                {props.book?.title}
              </div>
            </button>
          </Link></div>
          
        </td>
    )
  }
  else{
    return (
      <td className="whitespace-nowrap px-2 py-4 text-sm text-gray-500">
        <div><Link href={{pathname:'/records', query:{openView:"true",viewId: props.book.isbn}}}> 
          <button  className = "text-indigo-600 hover:text-indigo-900 inline-flex group w-80">
            <div>
              {props.book.title}
            </div>
          </button>
        </Link></div>
      </td>
    )
  }
}

LinkedBookTitle.defaultProps = {
  width: 32
}
