import { CheckCircleIcon } from '@heroicons/react/20/solid'
import {useState} from "react";

interface SuccessAlertProps {
  message: string
  messageDetails: string
  toggleAlert: () => void
}


export default function SuccessAlert(props: SuccessAlertProps) {
  return (
      <div className="fixed rounded-md bg-green-50 p-4 z-10 top-58 inset-x-64 m:auto bg-shadow-xl drop-shadow-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">{props.message}</h3>
            <div className="mt-2 text-sm text-green-700">
              <p>{props.messageDetails}</p>
            </div>
            <div className="mt-4">
              <div className="-mx-2 -my-1.5 flex">
                <button
                    type="button"
                    className="ml-3 rounded-md bg-green-50 px-2 py-1.5 text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                    onClick={props.toggleAlert}
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

