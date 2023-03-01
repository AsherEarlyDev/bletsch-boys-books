import { Dialog, Transition } from '@headlessui/react'
import {Fragment, useRef, useState} from 'react'
import { useRouter } from 'next/router'
import GenreCardProp from './CardComponents/GenreCardProp';

interface FilterProp{
  buttonText: string;
  submitText: string;
  filterBooks: any;
  resetPageNumber:any
}

export default function FilterModal(props: FilterProp) {
  const [isOpen, setIsOpen] = useState(false)
  const [genre, setGenre] = useState({name:""})
  const labels = [["ISBN", "isbn"], ["Title", "title"], ["Author", "author"], ["Publisher", "publisher"]]
  const router = useRouter()

  function closeModal() {
    setIsOpen(false)
  }
  function clearFilters(){
    closeModal()
    props.resetPageNumber(0)
    router.push({pathname: '/records',})
  }

  function openModal() {
    setIsOpen(true)
  }

  async function handleSubmit(e: React.FormEvent<HTMLInputElement>){
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    console.log(genre)
    router.push({
      pathname: '/records',
      query: Object.assign({}, 
        formData.get("isbn") as string === "" ? null : {isbn: formData.get("isbn") as string},
        formData.get("title") as string === "" ? null : {title: formData.get("title") as string},
        formData.get("author") as string === "" ? null : {authorNames: formData.get("author") as string},
        formData.get("publisher") as string === "" ? null : {publisher: formData.get("publisher") as string},
        genre.name===""  || genre.name==undefined ? null : {genre:genre.name})})
    // props.filterBooks({
    //   isbn: formData.get("isbn") as string,
    //   title: formData.get("title") as string,
    //   author: formData.get("author") as string,
    //   publisher: formData.get("publisher") as string,
    //   genre: genre.name ?? ""
    // })
    props.resetPageNumber(0)
    closeModal()
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
                    <form method="post" onSubmit={handleSubmit}>
                      <div>
                        <div className="text-center">
                          <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                            Filter Search
                          </Dialog.Title>
                        </div>
                        <div className="p-5">
                          <GenreCardProp saveFunction={setGenre} defaultValue=""></GenreCardProp>
                          {labels.map((label) => {
                            return(<div className="mt-5">
                              <p className="font-small leading-6 text-gray-900">
                                {label[0]}:
                              </p>
                              <textarea
                                  rows={1}
                                  name={label[1]}
                                  id={label[1]}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  defaultValue=""
                              />
                            </div>)
                          })}
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
                        {/*<button*/}
                        {/*    type="button"*/}
                        {/*    onClick={() => clearFilters()}*/}
                        {/*    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"*/}
                        {/*>*/}
                        {/*  Clear Filters*/}
                        {/*</button>*/}
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