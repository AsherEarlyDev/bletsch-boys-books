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
export default function NewBookEntryTable(props: NewBookEntryTableProps) {
  const editBook = (api.books.editBook.useMutation())
  const saveBook = (api.books.saveBook.useMutation())
  const [save, setSave] = useState(false)
  function handleSave(){
    setSave(true)
    props.closeOut
  }
  function saveBookRow(bookInfo: editableBook, genre, included: boolean, isExisting: boolean, retailPrice:number, pageCount:number, width: number, length: number, height: number){
    if(included){
        if(bookInfo && genre){
          if(isExisting){
            editBook.mutate({
              isbn: bookInfo.isbn,
              title: bookInfo.title ?? "",
              publisher: bookInfo.publisher ?? "",
              publicationYear: bookInfo.publicationYear ?? -1,
              author: bookInfo.author ?? [],
              retailPrice: Number(retailPrice),
              pageCount: Number(pageCount),
              dimensions: (width && height && length)? [Number(width), Number(height), Number(length)] : [],
              genre: genre.name
            })
          }
          else{
            saveBook.mutate({
              isbn: bookInfo.isbn,
              title: bookInfo.title ?? "",
              publisher: bookInfo.publisher ?? "",
              publicationYear: bookInfo.publicationYear ?? -1,
              author: bookInfo.author ?? [],
              retailPrice: Number(retailPrice),
              pageCount: Number(pageCount),
              dimensions: (width && height && length)? [Number(width), Number(height), Number(length)] : [],
              genre: genre.name
            })
          }
        }
        else{
          alert("Need to choose a genre")
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
        <SaveCardChanges saveModal={handleSave} closeModal={props.closeOut}></SaveCardChanges>
      </div>
  )
}
