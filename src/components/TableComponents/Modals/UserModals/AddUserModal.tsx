import { Dialog, Transition } from '@headlessui/react'
import React, {Fragment, useRef, useState} from 'react'
import {api} from "../../../../utils/api";
import {toast} from "react-toastify";

interface UserModalProp{
  buttonText: string;
  submitText: string;
}

export default function AddUserModal(props: UserModalProp) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false)
  const createUser = api.user.createNewUser.useMutation({
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      window.location.reload()
    }
  });
  function handleCreateNewUser(){
    if (password === confirmPassword){
      createUser.mutate({
        password: password,
        username: username,
        role: (isAdmin ? "ADMIN" : "USER")
      });
      closeModal()
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
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
              type="button"
              onClick={openModal}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            {props.buttonText}
          </button>
        </div>
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
                    <form className="space-y-6" method="post" onSubmit={handleCreateNewUser}>

                            <div>
                              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                              </label>
                              <div className="mt-1">
                                <input
                                    id="username"
                                    name="username"
                                    type="username"
                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    onChange={e => {setUsername(e.currentTarget.value)}}
                                />
                              </div>
                            </div>

                            <div>
                              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
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
                                Confirm Password
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

                            <div>
                              <label htmlFor="isAdmin" className="block text-sm font-medium text-gray-700">
                                Make new user an administrator?
                              </label>
                              <div className="mt-1">
                                <input
                                    id="isAdmin"
                                    name="isAdmin"
                                    type="checkbox"
                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    onChange={() => {setIsAdmin}}
                                />
                              </div>
                            </div>


                            <div>
                              <button
                                  type="submit"
                                  className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                              >
                                Create New User
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
