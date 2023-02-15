import TableDetails from "../TableDetails";
import { editableBook } from '../../../types/bookTypes';
import NewBookEntryTableRow from "../TableRows/NewBookEntryTableRow";
import TableHeader from "../TableHeader";
import ColumnHeading from "../TableColumnHeadings/ColumnHeading";
import React, {useState} from "react";
import SaveCardChanges from "../../CardComponents/SaveCardChanges";
import {api} from "../../../utils/api";

interface NewBookEntryTableProps{
  newBookEntries: {internalBooks: any[], externalBooks: editableBook[], absentBooks: string[]}
  closeOut: () => void
}

export type bookToBeSavedParams = {
  bookInfo: editableBook
  genre: string
  retailPrice: number
  pageCount: number
  width: number
  length: number
  height: number
  isIncluded: boolean
  newEntry: boolean
}

export default function NewBookEntryTable(props: NewBookEntryTableProps) {
  const editBook = (api.books.editBook.useMutation())
  const saveBook = (api.books.saveBook.useMutation())
  const [booksToBeSaved, setBooksToBeSaved] = useState<bookToBeSavedParams[]>([])
  function handleSave(){
    props.closeOut
  }
  function addBookToBeSaved(book: bookToBeSavedParams){
    setBooksToBeSaved([...booksToBeSaved, book])
  }
  function saveBooks(){
    for (const book of booksToBeSaved){
      if(book.isIncluded){
        if(book.bookInfo.genre){
          if(book.newEntry){
            saveBook.mutate({
              isbn: book.bookInfo.isbn,
              title: book.bookInfo.title ?? "",
              publisher: book.bookInfo.publisher ?? "",
              publicationYear: book.bookInfo.publicationYear ?? -1,
              author: book.bookInfo.author ?? [],
              retailPrice: Number(book.bookInfo.retailPrice),
              pageCount: Number(book.bookInfo.pageCount),
              dimensions: (book.bookInfo.dime && book.bookInfo.height && book.bookInfo.length)? [Number(book.bookInfo.width), Number(book.bookInfo.height), Number(book.bookInfo.length)] : [],
              genre: book.bookInfo.genre.name
            })

          }
          else{
            editBook.mutate({
              isbn: book.bookInfo.isbn,
              title: book.bookInfo.title ?? "",
              publisher: book.bookInfo.publisher ?? "",
              publicationYear: book.bookInfo.publicationYear ?? -1,
              author: book.bookInfo.author ?? [],
              retailPrice: Number(book.bookInfo.retailPrice),
              pageCount: Number(book.bookInfo.pageCount),
              dimensions: (book.bookInfo.width && book.bookInfo.height && book.bookInfo.length)? [Number(book.bookInfo.width), Number(book.bookInfo.height), Number(book.bookInfo.length)] : [],
              genre: book.bookInfo.genre.name
            })
          }
        }
        else{
          alert("Please choose a genre for " + book.bookInfo.title)
        }
      }
    }
  }

  return (
      <div className="px-4 sm:px-6 lg:px-8 rounded-lg shadow-lg py-8 bg-white">
        <div className="mb-8">
          <TableDetails tableName="New Book Entries" tableDescription="Confirm new book information to add to database.">
          </TableDetails>
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300 table-auto">
                    <TableHeader>
                      <ColumnHeading firstEntry={true} label="Title"></ColumnHeading>
                      <ColumnHeading label="Isbn"></ColumnHeading>
                      <ColumnHeading label="Author(s)"></ColumnHeading>
                      <ColumnHeading label="Publisher"></ColumnHeading>
                      <ColumnHeading label="Publishing Year"></ColumnHeading>
                      <ColumnHeading label="Inventory"></ColumnHeading>
                      <ColumnHeading label="Genre"></ColumnHeading>
                      <ColumnHeading label="Retail Price"></ColumnHeading>
                      <ColumnHeading label="Page Count"></ColumnHeading>
                      <ColumnHeading label="L x W x H (cm)"></ColumnHeading>
                      <ColumnHeading label="Include Book"></ColumnHeading>
                    </TableHeader>
                    <tbody className="divide-y divide-gray-200 bg-white">
                    {props.newBookEntries.externalBooks.map((book: editableBook) => (<NewBookEntryTableRow save={save} isExisting={false} bookInfo={book}></NewBookEntryTableRow>))}
                    {props.newBookEntries.internalBooks.map((book: editableBook) => (<NewBookEntryTableRow save={save} isExisting={true} bookInfo={book}></NewBookEntryTableRow>))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <SaveCardChanges saveModal={saveBooks} closeModal={props.closeOut}></SaveCardChanges>
      </div>
  )
}