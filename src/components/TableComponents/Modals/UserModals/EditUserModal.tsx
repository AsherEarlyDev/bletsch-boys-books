import { Dialog, Transition } from '@headlessui/react'
import React, {Fragment, useRef, useState} from 'react'
import {api} from "../../../../utils/api";
import {toast, ToastContainer} from "react-toastify";
import {PencilSquareIcon} from "@heroicons/react/20/solid";
import SecondaryButton from "../../../BasicComponents/SecondaryButton";

interface UserModalProp{
  username: string
  id: string
  isAdmin: boolean
}

export default function EditUserModal(props: UserModalProp) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(props.isAdmin)

  const editUser = api.user.editUser.useMutation({
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      window.location.reload()
    }
  });
  function handleModifyUser(pass: string, confirmPass: string, isAdmin: boolean){
    if (pass === confirmPass){
      if(pass == ""){
        editUser.mutate({
          id: props.id,
          role: (isAdmin ? "ADMIN" : "USER")
        });
      }
      else{
        alert("Changing password to : " + pass)
        editUser.mutate({
          id: props.id,
          password: pass,
          role: (isAdmin ? "ADMIN" : "USER")
        });
      }
      closeModal()
    }
    else{
      toast.error("Passwords do not match.")
    }
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
        <td className="relative whitespace-nowrap py-2 px-1 text-left text-sm font-medium sm:pr-6">
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
                    <form className="space-y-6" action="#" method="post">

                            <div>
                              <div className="sm:mx-auto sm:w-full sm:max-w-md">
                                <h2 className="mt-6 text-center text-xl tracking-tight text-gray-900">Editing user: <span className="font-semibold">{props.username}</span></h2>
                              </div>
                            </div>

                            <div className="flex flex-col gap-5">
                              <div>
                                <label htmlFor="isAdmin" className="block text-sm font-medium text-gray-700">
                                  {isAdmin ? "User is currently an admin." : "User is currently not an admin"}
                                </label>
                                <div className="mt-1">
                                  <input
                                      defaultChecked={props.isAdmin}
                                      id="isAdmin"
                                      name="isAdmin"
                                      type="checkbox"
                                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                      onClick={() => {setIsAdmin(!isAdmin)}}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col gap-5">
                              <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                  New Password
                                </label>
                                <div className="mt-1">
                                  <input
                                      id="new password"
                                      name="new password"
                                      type="password"
                                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                      onChange={e => {setPassword(e.currentTarget.value)}}
                                  />
                                </div>
                              </div>
                              <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                  Confirm New Password
                                </label>
                                <div className="mt-1">
                                  <input
                                      id="confirm new password"
                                      name="confirm new password"
                                      type="password"
                                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                      onChange={e => {setConfirmPassword(e.currentTarget.value)}}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-row gap-5">
                              <SecondaryButton onClick={closeModal} buttonText="Cancel"></SecondaryButton>
                              <button
                                  type="submit"
                                  className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                  onClick={e => handleModifyUser(password, confirmPassword, isAdmin)}
                              >
                                Confirm Changes
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
