import { Dialog, Transition } from '@headlessui/react'
import {Fragment, useRef, useState} from 'react'

interface VendorModalProp{
  showVendorEdit(name: string, buyback: number): Promise<void>,
  buttonText: string;
  submitText: string;
}

export default function AddVendorModal(props: VendorModalProp) {
  const [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  function handleAddVendorSubmission(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const vendorName = formData.get("vendorName") as string
    const buybackString = formData.get("buyback") as string
    let buyback = parseFloat(buybackString)
    closeModal()
    props.showVendorEdit(vendorName, buyback)
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
                    <form method="post" onSubmit={handleAddVendorSubmission}>
                      <div>
                        <div className="text-center">
                          <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                            Add Vendor Name
                          </Dialog.Title>
                        </div>
                        <div className="mt-5">
                          <input
                              name="vendorName"
                              id="vendorName"
                              required={true}
                              className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:border focus:ring-indigo-500 sm:text-sm py-1"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="text-center">
                          <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                            Add Buyback Policy
                          </Dialog.Title>
                        </div>
                        <div className="mt-5">
                          <input
                              name="buyback"
                              id="buyback"
                              type="number"
                              min={0.0}
                              max={1.0}
                              step={0.01}
                              className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:border focus:ring-indigo-500 sm:text-sm py-1"
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
