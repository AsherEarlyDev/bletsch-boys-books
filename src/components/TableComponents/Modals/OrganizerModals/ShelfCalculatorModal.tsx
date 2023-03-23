import { Dialog, Transition } from '@headlessui/react'
import {Fragment, useRef, useState} from 'react'
import { toast } from "react-toastify";
import MutableCardProp from '../../../CardComponents/MutableCardProp';
import { ReactSortable } from "react-sortablejs";
import BookCardProp from '../../../CardComponents/BookCardProp';
import { api } from '../../../../utils/api';
import TableDetails from '../../TableDetails';
import TableHeader from '../../TableHeader';
import ColumnHeading from "../../TableColumnHeadings/ColumnHeading"
;
import TableEntry from '../../TableEntries/TableEntry';
import MutableTableEntry from '../../TableEntries/MutableTableEntry';
interface ShelfCalculatorModalProp{
  buttonText: string;
  submitText: string;
}
interface ShelfBook{
  book;
  displayCount: number;
}

export default function ShelfCalculatorModal(props: ShelfCalculatorModalProp) {
  const DEFAULT_WIDTH = 20
  const [isOpen, setIsOpen] = useState(false)
  const [width, setWidth] = useState(DEFAULT_WIDTH)
  const [bookList, setBookList] = useState([])
  const [currentBookISBN, setCurrentBook] = useState("")
  const currentBookObj = api.books.findBooks.useQuery([currentBookISBN]).data
  const currentBook = currentBookObj?.internalBooks[0] ?? {}

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const isbnString = formData.get("bookIsbns") as string
    const tempIsbnArray = parseIsbns(isbnString.trim())
    const isbnArray = tempIsbnArray.filter(isbn => isbn.length === 10 || isbn.length === 13)
    if (tempIsbnArray.length == isbnArray.length){
      closeModal()
    }
    else{
      toast.error("Specified input is invalid. Please separate all ISBN values by either a space or a comma.")
    }
  }

  function parseIsbns(isbnString: string){
    let initialArray = isbnString.split(" ")
    if (initialArray.length == 1){
       initialArray = isbnString.split(",")
    }

    const secondArray: string[] = []
    initialArray.forEach((item, index) => {secondArray[index] = (item.split("-").join("")).replace(",", "")})

    return secondArray

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
                  <Dialog.Panel className="relative transform overflow-y-auto rounded-lg bg-white px-4 pt-5 pb-4 shadow-xl transition-all sm:my-8  ">
                      <div>                     
                        <div className="px-4 sm:px-6 lg:px-8 rounded-lg shadow-lg py-8 bg-white">
                          <div className="mb-8">
                            <TableDetails tableName={"Shelf Calculator"} tableDescription={"Calculate available shelf space"}>
                            </TableDetails>
                            <div className="mt-5">
                              <MutableCardProp saveValue={setWidth} heading="Width" dataType="number" defaultValue={DEFAULT_WIDTH}></MutableCardProp>
                              <BookCardProp saveFunction={setCurrentBook} ></BookCardProp>
                              <div><button type="button"
                                  onClick={() => {
                                    if(currentBook.title){
                                      setBookList([...bookList, { name:currentBook.title, inventory: currentBook.inventory, displayCount:0, dimensions: currentBook.dimensions}])
                                    }

                                }}
                                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                              >Add book</button></div>
                            </div>
                            <div className="mt-8 flex flex-col">
                              <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                  <div className="overflow-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-300 table-auto">
                                      <TableHeader>
                                        <ColumnHeading firstEntry={true} label="Title"></ColumnHeading>
                                        <ColumnHeading label="Inventory"></ColumnHeading>
                                        <ColumnHeading label="Display Count"></ColumnHeading>
                                        <ColumnHeading label="Shelf Space"></ColumnHeading>
                                        <ColumnHeading label="Delete"></ColumnHeading>
                                      </TableHeader>
                                        <ReactSortable
                                          filter=".addImageButtonContainer"
                                          className="divide-y divide-gray-200 bg-white"
                                          tag="tbody"
                                          dragClass="sortableDrag"
                                          list={bookList}
                                          setList={setBookList}
                                          animation={200}
                                          easing="ease-out">
                                          {bookList.map((item, idx) => (
                                            <tr className="draggableItem">
                                              <TableEntry firstEntry={true}>{item.name}</TableEntry>
                                              <TableEntry>{item.inventory}</TableEntry>
                                              <MutableTableEntry saveValue={(displayCount) =>{
                                                const temp = [...bookList]
                                                temp[idx] = {...item, displayCount:displayCount}
                                                setBookList(temp)
                                              } } heading="Display Count"
                                                 required="True" dataType="number"
                                                 defaultValue={0}></MutableTableEntry>
                                              {/* Dimensions are width thickness then height */}
                                              <TableEntry>{(item.displayCount * (item.dimensions[1] ? item.dimensions[1] : 0.8)).toFixed(2)}"</TableEntry>
                                              <TableEntry firstEntry={true}>{item.dimensions}</TableEntry>
                                            </tr>
                                          ))}
                                        </ReactSortable>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
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
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </>
  )
}
