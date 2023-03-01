import { Fragment, useState, useEffect } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { api } from '../../utils/api'



export default function BookSelect(props:{saveFunction: any, defaultValue?:any}) {
  // Saves the ISBN of the book selected no matter what option is chosen
  const books = api.books.getAllInternalBooks.useQuery().data
  

  const [query, setQuery] = useState(props.defaultValue.title ?? "")

  useEffect(() => {
    console.log(props.defaultValue.isbn)
    props.saveFunction(props.defaultValue.isbn)
  },[])
  const filteredBooks =
      books ? (query === ''
          ?  books
          : books.filter((book) =>
              book.title
              .toLowerCase()
              .replace(/\s+/g, '')
              .includes(query.toLowerCase().replace(/\s+/g, '')) ||
              book.isbn
              .toLowerCase()
              .replace(/\s+/g, '')
              .includes(query.toLowerCase().replace(/\s+/g, '')) 
          )) : []

  return (
      <div className="w-44 mt-1">
        <Combobox defaultValue={props.defaultValue} onChange={(value) => props.saveFunction(value.isbn)}>
          <div className="relative mt-1">
            <div className="relative w-full cursor-default overflow-hidden border border-gray-300 rounded-md bg-white text-left shadow-sd focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-500 sm:text-sm">
              <Combobox.Input
                  className="w-full border-none py-1 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                  displayValue={(value) => (value.title)}
                  defaultValue={props.defaultValue}
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
                {filteredBooks.length === 0 && query !== '' ? (
                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                      Nothing found.
                    </div>
                ) : (
                    filteredBooks.map((book) => (
                        <Combobox.Option
                            className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                    active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                }`
                            }
                            value={book}
                        >
                          {({ selected, active }) => (
                              <>
                        <span
                            className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                            }`}
                        >
                          {book.title}
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
  )
}
