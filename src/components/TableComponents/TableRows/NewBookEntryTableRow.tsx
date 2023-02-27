import TableEntry from "../TableEntries/TableEntry";
import React, {useState} from "react";
import {editableBook} from "../../../types/bookTypes";
import {api} from "../../../utils/api";
import MutableTableEntry from "../TableEntries/MutableTableEntry";
import MutableDimensionsTableEntry from "../TableEntries/MutableDimensionsTableEntry";
import MutableSelectGenreEntry from "../TableEntries/MutableSelectGenreEntry";
import MutableCurrencyTableEntry from "../TableEntries/MutableCurrencyTableEntry";
import TableEntryWithTag from "../TableEntries/TableEntryWithTag";
import {PlusIcon, XMarkIcon} from "@heroicons/react/20/solid";
import {toast} from "react-toastify";

interface NewBookTableRowProp{
  bookInfo: editableBook | undefined
  isExisting: boolean
}

export default function NewBookEntryTableRow(props:NewBookTableRowProp) {
  const defaultPrice = props.bookInfo?.retailPrice
  const defaultPageCount = props.bookInfo?.pageCount
  const defaultDimensions = (props.bookInfo?.dimensions ? props.bookInfo?.dimensions : undefined)
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
      action.mutate({
        isbn: props.bookInfo.isbn,
        title: props.bookInfo.title ?? "",
        publisher: props.bookInfo.publisher ?? "",
        publicationYear: props.bookInfo.publicationYear ?? -1,
        author: props.bookInfo.author ?? [],
        retailPrice: Number(retailPrice),
        pageCount: Number(pageCount),
        dimensions: (width && height && length)? [Number(width), Number(height), Number(length)] : [],
        genre: genre.name,
        shelfSpace: props.bookInfo.shelfSpace ?? 0,
        inventory: props.bookInfo.inventory
        imageLink: image

      })
      alert(((props.isExisting) ? "Edited book: " : "Added book: ") + props.bookInfo.title)
      closeModal()
    }
    else{
      alert("Handle toast alert to notify add genre for book: " + props.bookInfo.title)
    }

  }


  return (
      (visible &&
          <tr>
            <TableEntryWithTag setImage={setImage} imageUrl={image} isExisting={props.isExisting} firstEntry={true}>
              {props.bookInfo.title}
            </TableEntryWithTag>
            <TableEntry>{props.bookInfo.isbn}</TableEntry>
            <TableEntry>{props.bookInfo.author ? props.bookInfo.author.join(", ") : ""}</TableEntry>
            <TableEntry>{props.bookInfo.publisher}</TableEntry>
            <TableEntry>{props.bookInfo.publicationYear}</TableEntry>
            <TableEntry>{props.bookInfo.inventory}</TableEntry>
            <MutableSelectGenreEntry saveFunction={setGenre} defaultValue={props.bookInfo.genre}></MutableSelectGenreEntry>
            <MutableCurrencyTableEntry saveValue={setRetailPrice} heading="Retail Price" required="True" dataType="number" defaultValue={defaultPrice}></MutableCurrencyTableEntry>
            <MutableTableEntry saveValue={setPageCount} heading="Page Count" dataType="number" defaultValue={defaultPageCount}></MutableTableEntry>
            <MutableDimensionsTableEntry defaultLength={length} defaultWidth={width} defaultHeight={height} saveLength={setLength} saveWidth={setWidth} saveHeight={setHeight}></MutableDimensionsTableEntry>
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
      )
  )
}
