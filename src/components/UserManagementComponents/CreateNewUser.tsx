import React, { useState } from "react";
import { api } from "../../utils/api";
import SuccessAlert from "../BasicComponents/SuccessAlert";
import {toast} from "react-toastify";

export default function CreateNewUser() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false)
  const [alert, toggleAlert] = useState(false);
  const createUser = api.admin.createNewUser.useMutation({
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success("Successfully created new user!")
    }
  });
  function handleCreateNewUser(pass: string, confirmPass: string, username: string, isAdmin: boolean){
    if (pass === confirmPass){
      createUser.mutate({
        password: pass,
        username: username,
        isAdmin: isAdmin
      });
    }
  }




  return (
      <>
        <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Create a new user.</h2>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <form className="space-y-6" action="#" method="POST">

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
                      onClick={e => handleCreateNewUser(password, confirmPassword, username, isAdmin)}
                  >
                    Create New User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
  )
}
