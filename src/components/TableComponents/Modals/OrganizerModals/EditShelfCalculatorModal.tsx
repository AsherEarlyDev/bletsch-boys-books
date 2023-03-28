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
import {PencilSquareIcon} from "@heroicons/react/20/solid";
import TableEntry from '../../TableEntries/TableEntry';
import MutableTableEntry from '../../TableEntries/MutableTableEntry';
import ImmutableCardProp from '../../../CardComponents/ImmutableCardProp';
import CardGrid from '../../../CardComponents/CardGrid';
import DeleteRowEntry from '../../TableEntries/DeleteRowEntry';
import EditRowEntry from '../../TableEntries/EditRowEntry';
import SaveRowEntry from '../../TableEntries/SaveRowEntry';
import { Listbox } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import convertISBN10ToISBN13 from '../../../../server/api/HelperFunctions/convertISBN';

interface ShelfCalculatorModalProp{
  buttonText: string;
  submitText: string;
  isStandAlone?:boolean;
  width:number;
  saveCase?;
  index?;
  bookList;
  case;
  
}
interface ShelfBook{
  book;
  displayCount: number;
}

export default function EditShelfCalculatorModal(props: ShelfCalculatorModalProp) {
  const [isOpen, setIsOpen] = useState(false)
  const width = props.case.width
  const [bookList, setBookList] = useState(props.bookList)
  const [currentBookISBN, setCurrentBook] = useState("")
  const currentBookObj = api.books.findBooks.useQuery([currentBookISBN]).data
  const currentBook = currentBookObj?.internalBooks[0] ?? {}
  const takenSpaceArray = (bookList.map((book) => book.mode.value==="cover" ? book.width : Number((book.displayCount * book.thickness).toFixed(2))))
  const takenSpace = takenSpaceArray.reduce((partialSum, a) => partialSum + a, 0) 
  const MODE_OPTIONS = [{value:"cover", display:"Cover Out"}, {value:"spine", display:"Spine Out"}]
  const SHELF_THICKNESS = 8
  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setBookList(props.bookList)
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
  function handleDelete(){

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
  function reverseItemEditStatus(idx:number, item){
    const temp = [...bookList]
    temp[idx] = {...item, edit:!(temp[idx].edit), displayCount: item.mode.value=== "cover" ? Number(min(item.displayCount, Number((SHELF_THICKNESS/item.thickness).toFixed(0)))) : Number(item.displayCount)}
    console.log(temp[idx])

    setBookList(temp)
  }
  const min = (...args) => args.reduce((min, num) => num < min ? num : min, args[0]);

  return (
      <>
        <td className="relative whitespace-nowrap py-2 px-1 text-left text-sm font-medium sm:pr-6">
          <button onClick={openModal} className="text-indigo-600 hover:text-indigo-900">
            <PencilSquareIcon className="h-4 w-4"/>
          </button>
        </td>
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
                              <p mt-2 text-sm text-gray-700>Add a book below</p>
                              <BookCardProp saveFunction={setCurrentBook} ></BookCardProp>
                              <span><button
                                  onClick={() => {
                                    if(currentBook.title){
                                      setBookList([...bookList, { Book:currentBook, bookIsbn: currentBook.isbn, name:currentBook.title, inventory: currentBook.inventory, displayCount:0, edit:true, mode:{value:"spine", display:"Spine Out"}, thickness:Number(currentBook.dimensions[1] ? currentBook.dimensions[1] : 0.8), width:Number(currentBook.dimensions[1] ? currentBook.dimensions[0] : 5)}])
                                    }

                                }}
                                  className="inline-flex items-right justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                              >Add book</button></span>
                              <CardGrid>
                                <ImmutableCardProp heading="Space Taken" data = {takenSpace.toFixed(2)+" inches"}></ImmutableCardProp>
                                <ImmutableCardProp heading="Available Space" data = {(width-takenSpace).toFixed(2)+" inches"}></ImmutableCardProp>
                              </CardGrid>
                            </div>
                            <div className="mt-8 flex flex-col">
                              <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                  <div className="overflow-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-300 table-auto">
                                      <TableHeader>
                                        <ColumnHeading firstEntry={true} label="Title"></ColumnHeading>
                                        <ColumnHeading label="Inventory"></ColumnHeading>
                                        <ColumnHeading label="Display Mode"></ColumnHeading>
                                        <ColumnHeading label="Display Count"></ColumnHeading>
                                        <ColumnHeading label="Shelf Space"></ColumnHeading>
                                        <ColumnHeading label ="Edit"></ColumnHeading>
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
                                              {item.edit ? 
                                                <td>
                                                  <Listbox value={item.mode} onChange={(selected) =>{
                                                const temp = [...bookList]
                                                temp[idx] = {...item, mode:selected}
                                                setBookList(temp)}}>
                                                    <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                                    <span className="block truncate">{item.mode.display}</span>
                                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                      <ChevronUpDownIcon
                                                        className="h-5 w-5 text-gray-400"
                                                        aria-hidden="true"
                                                      />
                                                    </span></Listbox.Button>
                                                    <Transition
                                                          as={Fragment}
                                                          leave="transition ease-in duration-100"
                                                          leaveFrom="opacity-100"
                                                          leaveTo="opacity-0"
                                                      >
                                                    <Listbox.Options className="absolute mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                      {MODE_OPTIONS.map((choice) => (
                                                        <Listbox.Option 
                                                        className={({ active }) =>
                                                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                              active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                                          }`
                                                        }
                                                          value={choice}
                                                        >
                                                          {({ selected, active }) => (
                                                              <>
                                                        <span
                                                            className={`block truncate ${
                                                                selected ? 'font-medium' : 'font-normal'
                                                            }`}
                                                        >
                                                          {choice.display}
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
                                                        </Listbox.Option>
                                                      ))}
                                                    </Listbox.Options>
                                                    </Transition>
                                                  </Listbox></td>: <TableEntry>{item.mode.display}</TableEntry>}
                                              {item.edit ? 
                                                <MutableTableEntry saveValue={(displayCount) =>{
                                                const temp = [...bookList]
                                                temp[idx] = {...item, displayCount: item.mode.value=== "cover" ? Number(min(displayCount, Number((SHELF_THICKNESS/item.thickness).toFixed(0)))) : Number(displayCount)}
                                                setBookList(temp)
                                              } } heading="Display Count"
                                                 required="True" dataType="number"
                                                 defaultValue={item.displayCount}></MutableTableEntry>
                                                 :<TableEntry>{item.displayCount}</TableEntry>
                                              }
                                              {/* Dimensions are width thickness then height */}
                                              <TableEntry>{item.mode.value==="cover" ? item.width : Number((item.displayCount * item.thickness).toFixed(2))}"</TableEntry>
                                              {item.edit ? <SaveRowEntry onSave={() => reverseItemEditStatus(idx, item)}></SaveRowEntry> 
                                              : <EditRowEntry onEdit={() => reverseItemEditStatus(idx, item)}></EditRowEntry>}
                                              <DeleteRowEntry onDelete={() => {
                                                const temp = [...bookList]
                                                temp.splice(idx, 1)

                                                setBookList(temp)
                                              }}></DeleteRowEntry>
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
                            onClick={()=>{
                              const temp = {...props.case}
                              temp.case[props.index]={
                                takenSpace:takenSpace,
                                bookList:bookList,
                              }
                              console.log(props.case)
                              props.saveCase(temp)
                              console.log(props.case)
                              closeModal()
                            }}
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
