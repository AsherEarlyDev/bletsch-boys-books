import { XCircleIcon } from '@heroicons/react/20/solid'

interface ErrorAlertProps {
  errorMessage: string
}


export default function ErrorAlert(props: ErrorAlertProps) {
  return (
      <div className="fixed rounded-md bg-red-50 p-4 z-10 top-58 inset-x-64 m:auto bg-shadow-xl drop-shadow-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">There were 2 errors with your submission</h3>
            <div className="mt-2 text-sm text-red-700">
              <ul role="list" className="list-disc space-y-1 pl-5">
                <li>{props.errorMessage}</li>
                <li>Your password must include at least one pro wrestling finishing move</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
  )
}
