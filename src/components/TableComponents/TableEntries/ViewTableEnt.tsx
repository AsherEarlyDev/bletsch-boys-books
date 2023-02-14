import { Dialog, Transition } from '@headlessui/react'
import { Book, Genre, Author } from '@prisma/client';
import React, {Fragment, useRef, useState} from 'react'
import CardGrid from '../../CardComponents/CardGrid';
import CardTitle from '../../CardComponents/CardTitle';
import ImmutableCardProp from '../../CardComponents/ImmutableCardProp';
import {EyeIcon} from "@heroicons/react/20/solid";

interface ViewModalProp{
  onView: () => void
  children: React.ReactNode
}

export default function ViewTableEnt(props: ViewModalProp) {
  return (
      <>
        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
          <button onClick={props.onView} className="italic text-indigo-600 hover:text-indigo-900 inline-flex group">
            {props.children}
            <span className="invisible ml-2 flex-none rounded text-indigo-900 group-hover:visible">
                    <EyeIcon className="h-5 w-5 " aria-hidden="true"/>
                </span>
          </button>
        </td>
      </>
  )
}
