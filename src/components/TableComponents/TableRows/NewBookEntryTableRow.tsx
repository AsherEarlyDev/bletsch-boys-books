import TableEntry from "../TableEntries/TableEntry";
import React, {useEffect, useState} from "react";
import {editableBook} from "../../../types/bookTypes";
import {api} from "../../../utils/api";
import MutableTableEntry from "../TableEntries/MutableTableEntry";
import MutableDimensionsTableEntry from "../TableEntries/MutableDimensionsTableEntry";
import MutableSelectGenreEntry from "../TableEntries/MutableSelectGenreEntry";
import Checkbox from "../../BasicComponents/Checkbox";
import {Label} from 'semantic-ui-react'
import TableEntryWithTag from "../TableEntries/TableEntryWithTag";
import {bookToBeSavedParams} from "../Tables/NewBookEntryTable";

interface NewBookTableRowProp{
  bookInfo: editableBook | undefined
  isExisting: boolean
  save: boolean
  addBook: (bookToBeSaved) => void
}

export default function NewBookEntryTableRow(props:NewBookTableRowProp) {
  const defaultPrice = props.bookInfo?.retailPrice
  const defaultPageCount = props.bookInfo?.pageCount
  const defaultDimensions = (props.bookInfo?.dimensions ? props.bookInfo?.dimensions : undefined)
  const [genre, setGenre] = useState<{name:string}>()
  const [open, setOpen] = useState(true)
  const [displayRow, setDisplayRow] = useState(true)
  const [retailPrice, setRetailPrice] = useState<number>(defaultPrice)
  const [pageCount, setPageCount] = useState<number>(defaultPageCount)
  const [width, setWidth] = useState<number>(defaultDimensions[0])
  const [height, setHeight] = useState<number>(defaultDimensions[1])
  const [length, setLength] = useState<number>(defaultDimensions[2])
  const [includeBook, setIncludeBook] = useState(true)

  function handleButtonChange(){
    setIncludeBook(!includeBook)
  }

  useEffect(){
    const book: bookToBeSavedParams = {
      bookInfo: props.bookInfo,
      genre: genre.name,
      retailPrice: retailPrice,
      pageCount: pageCount,
      width: width,
      length: length,
      height: height,
      isIncluded: includeBook,
      newEntry: !props.isExisting
    }
    props.addBook(book)
  }


  return (
      <tr>
        <TableEntryWithTag isExisting={props.isExisting} firstEntry={true}>
          {props.bookInfo.title}
        </TableEntryWithTag>
        <TableEntry>{props.bookInfo.isbn}</TableEntry>
        <TableEntry>{props.bookInfo.author ? props.bookInfo.author.join(", ") : ""}</TableEntry>
        <TableEntry>{props.bookInfo.publisher}</TableEntry>
        <TableEntry>{props.bookInfo.publicationYear}</TableEntry>
        <TableEntry>{props.bookInfo.inventory}</TableEntry>
        <MutableSelectGenreEntry saveFunction={setGenre} defaultValue={props.bookInfo.genre}></MutableSelectGenreEntry>
        <MutableTableEntry saveValue={setRetailPrice} heading="Retail Price" required="True" dataType="number" defaultValue={defaultPrice}></MutableTableEntry>
        <MutableTableEntry saveValue={setPageCount} heading="Page Count" dataType="number" defaultValue={defaultPageCount}></MutableTableEntry>
        <MutableDimensionsTableEntry defaultLength={length} defaultWidth={width} defaultHeight={height} saveLength={setLength} saveWidth={setWidth} saveHeight={setHeight}></MutableDimensionsTableEntry>
        <td className="whitespace-nowrap px-2 py-4 text-sm text-gray-500">
          <div className="text-left overflow-hidden truncate">
            <Checkbox checked={includeBook} onChange={handleButtonChange}/>
          </div>
        </td>
      </tr>
  )
}
