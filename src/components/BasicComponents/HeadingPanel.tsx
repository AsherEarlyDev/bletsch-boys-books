import { Dialog } from '@headlessui/react'

export default function HeadingPanel(props: {displayText: string}) {
  return (
    <center><Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
    <div className="text-center">
      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
        {props.displayText}
      </Dialog.Title>
    </div>
  </Dialog.Panel></center>
  )
}