import { Dialog, Transition } from '@headlessui/react'
import { Book, Genre, Author } from '@prisma/client';
import React, {Fragment, useRef, useState} from 'react'
import CardGrid from '../../CardComponents/CardGrid';
import CardTitle from '../../CardComponents/CardTitle';
import ImmutableCardProp from '../../CardComponents/ImmutableCardProp';
import {EyeIcon} from "@heroicons/react/20/solid";

interface ViewModalProp{
  bookInfo: Book  & {
    genre: Genre;
    author: Author[];},
  buttonText: string,
  submitText: string,
  openEdit: () => void
}

export default function ViewTableEntry(props: ViewModalProp) {
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  async function handleEdit(){
    closeModal()
    props.openEdit()
  }

  return (
      <>
          <button onClick={openModal} className="italic text-indigo-600 hover:text-indigo-900 inline-flex group">
              {props.buttonText}
              <span className="invisible ml-2 flex-none rounded text-indigo-900 group-hover:visible">
                    <EyeIcon className="h-5 w-5 " aria-hidden="true"/>
                </span>
          </button>
        <Transition.Root show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10"  onClose={closeModal}>
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                            <CardTitle heading="Book Description" subheading="Confirm and validate book information below..."></CardTitle>
                            <CardGrid>
                            <ImmutableCardProp heading="Book Title" data={props.bookInfo.title}></ImmutableCardProp>
                            <ImmutableCardProp heading="Book ISBN" data={props.bookInfo.isbn}></ImmutableCardProp>
                            <ImmutableCardProp heading="Author(s)" data={props.bookInfo.author ? props.bookInfo.author.map((auth)=>auth.name).join(", ") : ""}></ImmutableCardProp>
                            <ImmutableCardProp heading="Publication Year" data={props.bookInfo.publicationYear}></ImmutableCardProp>
                            <ImmutableCardProp heading="Publisher" data={props.bookInfo.publisher}></ImmutableCardProp>
                            <ImmutableCardProp heading="Inventory" data={props.bookInfo.inventory}></ImmutableCardProp>
                            <ImmutableCardProp heading="genre" data={props.bookInfo.genre.name}></ImmutableCardProp>
                            <ImmutableCardProp heading="Retail Price" data={props.bookInfo.retailPrice}></ImmutableCardProp>
                            <ImmutableCardProp heading="Page Count" data={props.bookInfo.pageCount}></ImmutableCardProp>
                            <ImmutableCardProp heading="Width" data={props.bookInfo.dimensions[0] ?? 0}></ImmutableCardProp>
                            <ImmutableCardProp heading="Thickness" data={props.bookInfo.dimensions[1] ?? 0}></ImmutableCardProp>
                            <ImmutableCardProp heading="Height" data={props.bookInfo.dimensions[2] ?? 0}></ImmutableCardProp>
                            </CardGrid>
                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                            onClick={() => closeModal()}
                        >Close
                        </button>
                        <button 
                            onClick = {() => handleEdit()}
                            className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                        >
                          {props.submitText}
                        </button>
                        
                      </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </>
  )
}
