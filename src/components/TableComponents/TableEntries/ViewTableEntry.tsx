import { Dialog, Transition } from '@headlessui/react'
import { Book, Genre, Author } from '@prisma/client';
import React, {Fragment, useRef, useState} from 'react'
import CardGrid from '../../CardComponents/CardGrid';
import CardTitle from '../../CardComponents/CardTitle';
import ImmutableCardProp from '../../CardComponents/ImmutableCardProp';
import {EyeIcon} from "@heroicons/react/20/solid";
import {CldImage} from "next-cloudinary";

interface ViewModalProp{
  onView: () => void
  children: React.ReactNode
  hasThumbnail?: boolean
  imageUrl?
}

export default function ViewTableEntry(props: ViewModalProp) {
  const imageSrc = ("https://res.cloudinary.com/dyyevpzdz/image/upload/v1677264732/" + props.imageUrl)
  return (
      <>
        <td className="whitespace-nowrap py-4 pl-4 text-sm pr-2 font-medium text-gray-900 sm:pl-6 w-[28rem]">
          <button onClick={props.onView} className="italic text-indigo-600 hover:text-indigo-900 inline-flex group w-[26rem] items-center">
            {props.hasThumbnail ?
                <CldImage
                    className="rounded-lg mr-4"
                    width="50"
                    height="50"
                    src="https://res.cloudinary.com/dyyevpzdz/image/upload/v1677264732/book-covers/lisphiz2ltw9oew0urvp.png"
                    alt={"Image"}>
                </CldImage>: null}
            <div className="text-left overflow-hidden truncate max-w-xs">
              {props.children}
            </div><span className="invisible ml-2 flex-none rounded text-indigo-900 group-hover:visible">
                    <EyeIcon className="h-5 w-5 " aria-hidden="true"/>
            </span>
          </button>
        </td>
      </>
  )
}
