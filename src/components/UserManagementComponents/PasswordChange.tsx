import { useState } from "react";
import { api } from "../../utils/api";
import {toast, ToastContainer} from "react-toastify";

export default function PasswordChange() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');;
  const adminPass = api.user.changePassword.useMutation({
    onSuccess: () => {
     alert("Successfully changed password!")
    }
  });


  function handlePasswordSubmit(pass: string, confirmPass: string){
    if (pass === confirmPass){
      adminPass.mutate({
        password: pass
      });
    }
    else{
     alert("Passwords do not match.")
    }
  }



  return (
      <>
        <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Set a new password.</h2>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="space-y-6">
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
                        onChange={e => {setNewPassword(e.currentTarget.value)}}
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
                <div>
                  <button
                      type="submit"
                      className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={e => handlePasswordSubmit(newPassword, confirmPassword)}
                  >
                    Set New Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
  )
}
