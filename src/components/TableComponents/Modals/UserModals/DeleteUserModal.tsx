import { Dialog, Transition } from '@headlessui/react'
import React, {Fragment, useRef, useState} from 'react'
import {api} from "../../../../utils/api";
import {toast} from "react-toastify";
import {TrashIcon} from "@heroicons/react/20/solid";
import CardTitle from "../../../CardComponents/CardTitle";
import SecondaryButton from "../../../BasicComponents/SecondaryButton";
import PrimaryButton from "../../../BasicComponents/PrimaryButton";

interface DeleteUserModalProp{
  id: string
}

export default function DeleteUserModal(props: DeleteUserModalProp) {
  const deleteUser = api.user.deleteUser.useMutation({
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success("Successfully delete user.")
    }
  });

  function handleDeleteUser(){
    deleteUser.mutate({
      userId: props.id
    });
    closeModal()
  }

  const [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
      <>
        <td className="relative whitespace-nowrap py-2 px-1 text-left text-sm font-sm sm:pr-6">
          <button onClick={openModal} className="text-red-600 hover:text-red-900">
            <TrashIcon className="h-4 w-4"/>
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
                      <CardTitle heading="Delete User..." subheading="Are you sure you want to delete this user? This action cannot be undone."></CardTitle>
                      <div className="gap-5 flex flex-row justify-around px-4 py-4 sm:px-6">
                        <SecondaryButton onClick={closeModal} buttonText="Cancel"></SecondaryButton>
                        <PrimaryButton onClick={handleDeleteUser}
                                       buttonText="Delete User"></PrimaryButton>
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
