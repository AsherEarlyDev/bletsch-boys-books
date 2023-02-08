import { XCircleIcon } from '@heroicons/react/20/solid'
import {useState} from "react";

interface ErrorAlertProps {
  message: string
  messageDetails: string
  openAlert: boolean
}


export default function ErrorAlert(props: ErrorAlertProps) {
  const [open, toggleOpen] = useState(props.openAlert)


  function closeAlert(){
    toggleOpen(false)
  }

  return (
      open ? <div className="fixed rounded-md bg-red-50 p-4 z-10 top-58 inset-x-64 m:auto bg-shadow-xl drop-shadow-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">{props.message}</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{props.messageDetails}</p>
            </div>
            <div className="mt-4">
              <div className="-mx-2 -my-1.5 flex">
                <button
                    type="button"
                    className="ml-3 rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                    onClick={closeAlert}
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      </div> : null
  )
}

