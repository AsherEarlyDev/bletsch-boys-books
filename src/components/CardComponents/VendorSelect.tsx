import { Dispatch, Fragment, SetStateAction, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { api } from '../../utils/api'
import { Vendor } from '../../types/vendorTypes'


export default function VendorSelect(props:{saveFunction: any, defaultValue:string, vendors: Vendor[]}) {
  const [selected, setSelected] = useState('')
  const [query, setQuery] = useState('')
  props.saveFunction(selected)
  
  const filteredPeople =
      props.vendors ? (query === ''
          ?  props.vendors
          : props.vendors.filter((vendor) =>
              vendor.name
              .toLowerCase()
              .replace(/\s+/g, '')
              .includes(query.toLowerCase().replace(/\s+/g, ''))
          )) : []

  return (
      <div className="sm:col-span-1">
        <dt className="text-md font-medium text-gray-500">
          <label>
            Edit Vendor
          </label>
        </dt>
        <div className="w-44 mt-1">
          <Combobox value={selected} onChange={setSelected}>
            <div className="relative mt-1">
              <div className="relative w-full cursor-default overflow-hidden border border-gray-300 rounded-md bg-white text-left shadow-sd focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-500 sm:text-sm">
                <Combobox.Input
                    className="w-full border-none py-1 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                    defaultValue={props.defaultValue}
                    displayValue={(vendor) => vendor ? vendor.name: ""}
                    onChange={(event) => setQuery(event.target.value)}
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                  />
                </Combobox.Button>
              </div>
              <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  afterLeave={() => setQuery('')}
              >
                <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {filteredPeople.length === 0 && query !== '' ? (
                      <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                        Nothing found.
                      </div>
                  ) : (
                      filteredPeople.map((person) => (
                          <Combobox.Option
                              key={person.id}
                              className={({ active }) =>
                                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                      active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                  }`
                              }
                              value={person}
                          >
                            {({ selected, active }) => (
                                <>
                        <span
                            className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                            }`}
                        >
                          {person.name}
                        </span>
                                  {selected ? (
                                      <span
                                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                              active ? 'text-white' : 'text-indigo-500'
                                          }`}
                                      >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                                  ) : null}
                                </>
                            )}
                          </Combobox.Option>
                      ))
                  )}
                </Combobox.Options>
              </Transition>
            </div>
          </Combobox>
        </div>
      </div>
  )
}
