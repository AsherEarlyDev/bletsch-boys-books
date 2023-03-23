import { Dialog, Transition } from '@headlessui/react'
import React, {Fragment, useRef, useState} from 'react'
import {api} from "../../../../utils/api";
import {toast, ToastContainer} from "react-toastify";
import {PencilSquareIcon} from "@heroicons/react/20/solid";
import SecondaryButton from "../../../BasicComponents/SecondaryButton";
import CardTitle from "../../../CardComponents/CardTitle";
import CardGrid from "../../../CardComponents/CardGrid";
import ImmutableCardProp from "../../../CardComponents/ImmutableCardProp";
import MutableCardProp from "../../../CardComponents/MutableCardProp";
import SaveCardChanges from "../../../CardComponents/SaveCardChanges";
import ViewTableEntry from "../../TableEntries/ViewTableEntry";


interface ViewVendorModalProp{
  vendorId:  string
  vendorName: string
  buybackRate: number
}

export default function ViewVendorModal(props: ViewVendorModalProp) {
  const [isOpen, setIsOpen] = useState(false)
  function closeModal() {
    setIsOpen(false)
  }
  function openModal() {
    setIsOpen(true)
  }
  return (
      <>
        <ViewTableEntry onView={openModal}>{props.vendorName}</ViewTableEntry>
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
                  <Dialog.Panel className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
                    <CardTitle heading="Vendors" subheading="Confirm and validate vendor information below..."></CardTitle>
                    <CardGrid>
                      <ImmutableCardProp heading="Vendor ID" data={props.vendorId}></ImmutableCardProp>
                      <ImmutableCardProp heading="Vendor Name" data={props.vendorName}></ImmutableCardProp>
                      <ImmutableCardProp heading="Buyback Rate" data={(props.buybackRate === null) || (props.buybackRate === 0)? "" :
                          (props.buybackRate * 100)+"%"}></ImmutableCardProp>
                    </CardGrid>
                    <div className="gap-5 flex flex-row justify-around px-4 py-8 sm:px-6">
                      <SecondaryButton onClick={closeModal} buttonText="Exit"></SecondaryButton>
                      {/*<PrimaryButton onClick={openEdit} buttonText="Edit Vendor"></PrimaryButton>*/}
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
