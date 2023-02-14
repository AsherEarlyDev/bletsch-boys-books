import {Author, Book, Genre } from "@prisma/client";
import TableEntry from "../TableEntries/TableEntry";
import React, {useState} from "react";
import EditRowEntry from "../TableEntries/EditRowEntry";
import DeleteRowEntry from "../TableEntries/DeleteRowEntry";
import ViewTableEntry from "../TableEntries/ViewTableEntry";
import {editableBook} from "../../../types/bookTypes";
import {api} from "../../../utils/api";
import ImmutableCardProp from "../../CardComponents/ImmutableCardProp";
import GenreCardProp from "../../CardComponents/GenreCardProp";
import MutableCardProp from "../../CardComponents/MutableCardProp";
import GenreSelect from "../../CardComponents/GenreSelect";
import MutableTableEntry from "../TableEntries/MutableTableEntry";
import MutableDimensionsTableEntry from "../TableEntries/MutableDimensionsTableEntry";

interface NewBookTableRowProp{
  bookInfo: editableBook | undefined
}


export default function NewBookTableRow(props:NewBookTableRowProp) {
  const defaultPrice = props.bookInfo?.retailPrice
  const defaultPageCount = props.bookInfo?.pageCount
  const defaultDimensions = (props.bookInfo?.dimensions ? props.bookInfo?.dimensions : undefined)
  const [genre, setGenre] = useState<{name:string}>()
  const [open, setOpen] = useState(true)
  const [retailPrice, setRetailPrice] = useState<number>(defaultPrice)
  const [pageCount, setPageCount] = useState<number>(defaultPageCount)
  const [width, setWidth] = useState<number>(defaultDimensions[0])
  const [height, setHeight] = useState<number>(defaultDimensions[1])
  const [length, setLength] = useState<number>(defaultDimensions[2])
  const editExistingBook = (api.books.editBook.useMutation())
  const saveNewBook = (api.books.saveBook.useMutation())

  return (
      <tr>
        <TableEntry>{props.bookInfo.title}</TableEntry>
        <TableEntry>{props.bookInfo.isbn}</TableEntry>
        <TableEntry>{props.bookInfo.author.map((author) => author.name).join(", ")}</TableEntry>
        <TableEntry>{props.bookInfo.publisher}</TableEntry>
        <TableEntry>{props.bookInfo.publicationYear}</TableEntry>
        <TableEntry>{props.bookInfo.inventory}</TableEntry>
        <TableEntry><GenreSelect saveFunction={setGenre} defaultValue={props.bookInfo.genre.name}></GenreSelect></TableEntry>
        <MutableTableEntry onChange={setRetailPrice} heading="Retail Price" required="True" type="number" defaultValue={defaultPrice}></MutableTableEntry>
        <MutableTableEntry saveValue={setPageCount} heading="Page Count" dataType="number" defaultValue={defaultPageCount}></MutableTableEntry>
        <MutableDimensionsTableEntry defaultLength={length} defaultWidth={width} defaultHeight={height} saveLength={setHeight} saveWidth={setWidth} saveHeight={setHeight}></MutableDimensionsTableEntry>
      </tr>
  )
}
