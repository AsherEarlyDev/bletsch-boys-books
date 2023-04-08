import TableEntry from "../TableEntries/TableEntry";
import React, {useState} from "react";
import {editableBook} from "../../../types/bookTypes";
import {api} from "../../../utils/api";
import MutableTableEntry from "../TableEntries/MutableTableEntry";
import MutableDimensionsTableEntry from "../TableEntries/MutableDimensionsTableEntry";
import MutableSelectGenreEntry from "../TableEntries/MutableSelectGenreEntry";
import MutableCurrencyTableEntry from "../TableEntries/MutableCurrencyTableEntry";
import TableEntryWithTag from "../TableEntries/TableEntryWithTag";
import {PlusIcon, XMarkIcon, BookOpenIcon, ChevronDoubleDownIcon, CheckIcon} from "@heroicons/react/20/solid";
import {toast} from "react-toastify";
import SaveRowEntry from "../TableEntries/SaveRowEntry";
import MutableStateTableEntry from "../TableEntries/MutableStateTableEntry";
import MutableStateCurrencyTableEntry from "../TableEntries/MutableStateCurrencyTableEntry";
import MutableStateDimensionsTableEntry from "../TableEntries/MutableStateDimensionsTableEntry";
import GenreCardProp from "../../CardComponents/GenreCardProp";
import { Tab } from "@headlessui/react";
import Link from "next/link";

interface NewBookTableRowProp{
  bookInfo: editableBook | undefined
  isExisting: boolean
}

export default function NewBookEntryTableRow(props:NewBookTableRowProp) {
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  const defaultPrice = props.bookInfo?.retailPrice
  const defaultPageCount = props.bookInfo?.pageCount
  const defaultDimensions = (props.bookInfo?.dimensions ? props.bookInfo?.dimensions : undefined)
  const [displayRelatedBooks, setDisplayRelatedBooks] = useState(false)
  const [displaySubsidiaryBook, setDisplaySubsidiaryBook] = useState(false)
  const [genre, setGenre] = useState<{name:string}>()
  const [image, setImage] = useState(props.bookInfo?.imageLink)
  console.log(image)
  const [retailPrice, setRetailPrice] = useState<number>(defaultPrice)
  const [pageCount, setPageCount] = useState<number>(defaultPageCount)
  const [width, setWidth] = useState<number>(defaultDimensions[0])
  const [height, setHeight] = useState<number>(defaultDimensions[1])
  const [length, setLength] = useState<number>(defaultDimensions[2])
  const [visible, setVisible] =useState(true)
  const action = (props.isExisting) ? (api.books.editBook.useMutation({
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success("Successfully edited book!")
    }
  })) : (api.books.saveBook.useMutation({
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success("Successfully saved book!")
    }
  }))

  function closeModal(){
    setVisible(false)
  }


  function addBook(){
    if(genre && props.bookInfo){
      console.log(props.bookInfo)
      action.mutate({
        isbn: props.bookInfo.isbn,
        isbn10:props.bookInfo.isbn10 ?? undefined,
        title: props.bookInfo.title ?? "",
        publisher: props.bookInfo.publisher ?? "",
        publicationYear: props.bookInfo.publicationYear ?? -1,
        author: props.bookInfo.author ?? [],
        retailPrice: Number(retailPrice),
        pageCount: Number(pageCount),
        dimensions: (width && height && length)? [Number(width), Number(height), Number(length)] : [],
        genre: genre.name,
        shelfSpace: props.bookInfo.shelfSpace ?? 0,
        inventory: props.bookInfo.inventory,
        imageLink: image,

      })
      toast.success(((props.isExisting) ? "Edited book: " : "Added book: ") + props.bookInfo.title)
      closeModal()
    }
    else{
      alert("Handle toast alert to notify add genre for book: " + props.bookInfo.title)
    }

  }


  return (
      (visible &&
          <><tr>
        <TableEntryWithTag setImage={setImage} imageUrl={image} isExisting={props.isExisting} firstEntry={true}>
          {props.bookInfo.title}
        </TableEntryWithTag>
        <TableEntry>{props.bookInfo.isbn}</TableEntry>
        <TableEntry width={28}>{props.bookInfo.author ? props.bookInfo.author.join(", ") : ""}</TableEntry>
        <TableEntry>{props.bookInfo.publisher}</TableEntry>
        <TableEntry width={20}>{props.bookInfo.publicationYear}</TableEntry>
        <TableEntry width={20}>{props.bookInfo.inventory}</TableEntry>
        <TableEntry width={20}>{props.bookInfo.numberRelatedBooks}</TableEntry>
        <td><GenreCardProp header={false} saveFunction={setGenre} defaultValue={props.bookInfo.genre}></GenreCardProp></td>
        <MutableStateCurrencyTableEntry stateValue={retailPrice} width={24} saveValue={setRetailPrice} heading="Retail Price" required="True" dataType="number" defaultValue={defaultPrice}></MutableStateCurrencyTableEntry>
        <MutableStateTableEntry stateValue={pageCount} width={24} saveValue={setPageCount} heading="Page Count" dataType="number" defaultValue={defaultPageCount}></MutableStateTableEntry>
        <MutableStateDimensionsTableEntry length={length} width={width} height={height} defaultLength={length} defaultWidth={width} defaultHeight={height} saveLength={setLength} saveWidth={setWidth} saveHeight={setHeight}></MutableStateDimensionsTableEntry>
        {props.bookInfo.subsidiaryBook ? <td className="whitespace-nowrap px-2 py-4 text-sm text-gray-500">
          <button
            type="button"
            onClick={()=>setDisplaySubsidiaryBook(!displaySubsidiaryBook)}
            className="inline-flex items-center rounded-full border border-transparent bg-blue-600 p-1 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <ChevronDoubleDownIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </td> : <td></td>}
        {props.bookInfo.numberRelatedBooks>0 ? <td className="whitespace-nowrap px-2 py-4 text-sm text-gray-500">
          <button
            type="button"
            onClick={()=>setDisplayRelatedBooks(!displayRelatedBooks)}
            className="inline-flex items-center rounded-full border border-transparent bg-purple-600 p-1 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <BookOpenIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </td> : <td></td>}
        <td className="whitespace-nowrap px-2 py-4 text-sm text-gray-500">
          <button
            type="button"
            onClick={addBook}
            className="inline-flex items-center rounded-full border border-transparent bg-green-600 p-1 text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <PlusIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </td>
        <td className="whitespace-nowrap px-2 py-4 text-sm text-gray-500">
          <button
            type="button"
            onClick={closeModal}
            className="inline-flex items-center rounded-full border border-transparent bg-red-600 p-1 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </td>
      </tr>
      {displaySubsidiaryBook && <tr>
        <td className="whitespace-nowrap px-2 py-4 text-sm" align="left" colSpan={8}>Subsidiary intrinsic book information: Click green check to import field</td>
        <td className="whitespace-nowrap px-2 py-4 text-sm"><>
          ${(props.bookInfo.subsidiaryBook.retailPrice).toFixed(2)}
          <button onClick={()=>setRetailPrice(props.bookInfo.subsidiaryBook.retailPrice)} className="text-green-600 hover:text-green-900">
            <CheckIcon className="h-5 w-5"/>
          </button>
          </></td>
        <td className="whitespace-nowrap px-2 py-4 text-sm">
          {props.bookInfo.subsidiaryBook.pageCount}
          <button onClick={()=>setPageCount(props.bookInfo.subsidiaryBook.pageCount)} className="text-green-600 hover:text-green-900">
            <CheckIcon className="h-5 w-5"/>
          </button>

        
        </td>
        <td className="whitespace-nowrap px-2 py-4 text-sm">
          {props.bookInfo.subsidiaryBook.height}" X {props.bookInfo.subsidiaryBook.width}" X {props.bookInfo.subsidiaryBook.thickness}"
          <button onClick={()=>{
            setLength(props.bookInfo.subsidiaryBook.height)
            setHeight(props.bookInfo.subsidiaryBook.thickness)
            setWidth(props.bookInfo.subsidiaryBook.width)
            }} className="text-green-600 hover:text-green-900">
            <CheckIcon className="h-5 w-5"/>
          </button>
        </td>
      </tr>}
      {displayRelatedBooks && 
      <tr>
        <td className="whitespace-nowrap px-2 py-4 text-sm" align="center" colSpan={15}>
          
        <Tab.Group><Tab.Panel
                className={classNames(
                    'rounded-xl bg-white p-3',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400')}>
              {props.bookInfo.relatedBooks.length > 0 ?
                  <div
                      className="flex flex-row justify-between mx-2 border-b border-solid border-indigo-400 p-2 text-left">
                    <h3 className="text-sm font-medium leading-5 w-32">Title</h3>
                    <h3 className="text-sm font-medium leading-5 w-32">ISBN</h3>
                    <h3 className="text-sm font-medium leading-5 w-32">Author</h3>
                    <h3 className="text-sm font-medium leading-5 w-32">Publisher</h3>
                    <h3 className="text-sm font-medium leading-5 w-32">Publication Year</h3>
                  </div>:
                  <h2>No related books for this book.</h2>
              }
              <ul>
                {props.bookInfo.relatedBooks.map((book) => (

                    <Link href={{pathname:'/books', query:{openView:"true",viewId: props.bookInfo.isbn}}}><li
                        className="relative rounded-md p-3 hover:bg-indigo-100 flex flex-row justify-between text-left"
                    >
                      <h3 className="text-sm font-medium leading-5 w-32">{book.title}</h3>
                      <h3 className="text-sm font-medium leading-5 w-32">{book.isbn}</h3>
                      <h3 className="text-sm font-medium leading-5 w-32">{book.authorNames}</h3>
                      <h3 className="text-sm font-medium leading-5 w-32">{book.publisher}</h3>
                      <h3 className="text-sm font-medium leading-5 w-32">{book.publicationYear}</h3>
                    </li></Link>
                ))}
              </ul>
            </Tab.Panel></Tab.Group>
        </td>
      </tr>}
      </>
          
      )
  )
}
