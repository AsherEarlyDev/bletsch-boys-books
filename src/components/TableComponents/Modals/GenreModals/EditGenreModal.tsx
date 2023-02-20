import { Dialog, Transition } from '@headlessui/react'
import React, {Fragment, useRef, useState} from 'react'
import { api } from '../../../../utils/api';
import {PencilSquareIcon} from "@heroicons/react/20/solid";
import CardTitle from "../../../CardComponents/CardTitle";
import CardGrid from "../../../CardComponents/CardGrid";
import ImmutableCardProp from "../../../CardComponents/ImmutableCardProp";
import GenreCardProp from "../../../CardComponents/GenreCardProp";
import MutableCardProp from "../../../CardComponents/MutableCardProp";
import MutableDimensionsCardProp from "../../../CardComponents/MutableDimensionsCardProp";
import SaveCardChanges from "../../../CardComponents/SaveCardChanges";

interface EditGenreModalProp{
  itemIdentifier: string,
  buttonText: string,
  submitText: string,
}

export default function EditGenreModal(props: EditGenreModalProp) {
  const [isOpen, setIsOpen] = useState(false);
  const changeGenre = api.genre.changeGenreName.useMutation()

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const genre = formData.get("genre") as string
    changeGenre.mutate({
      originalName:props.itemIdentifier,
      newName: genre
    })
    closeModal()
  }

  return (
      <>
        <td className="py-2 pl-5 text-sm font-medium text-left">
          <button onClick={openModal} className="text-indigo-600 hover:text-indigo-900">
            <PencilSquareIcon className="h-4 w-4"/>
          </button>
        </td>
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
                    <form method="post" onSubmit={handleSubmit}>
                      <div>
                        <div className="text-center">
                          <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                            Edit Genre...
                          </Dialog.Title>
                          <Dialog.Description className="mt-1 max-w-2xl text-sm text-gray-500">
                            Please enter and confirm a new genre title.
                          </Dialog.Description>
                        </div>
                        <div className="mt-5">
                        <textarea
                            rows={1}
                            name="genre"
                            id="genre"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            defaultValue=""
                        />
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button
                            type="submit"
                            className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                        >
                          {props.submitText}
                        </button>
                        <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                            onClick={() => closeModal()}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </>
  )
}

