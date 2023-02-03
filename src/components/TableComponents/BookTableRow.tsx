import ImmutableCardProp from "../CardComponents/ImmutableCardProp";
import MutableCardProp from "../CardComponents/MutableCardProp";
import GenreCardProp from "../CardComponents/GenreCardProp";
import CardTitle from "../CardComponents/CardTitle";
import CardGrid from "../CardComponents/CardGrid";
import SaveCardChanges from "../CardComponents/SaveCardChanges";
import { completeBook, databaseBook, externalBook } from '../../types/bookTypes';
import { useState } from 'react';
import { api } from '../../utils/api';
import {Author, Book, Genre } from "@prisma/client";
import TableEntry from "./TableEntry";

interface BookTableRowProp{
  bookInfo: Book  & {
  genre: Genre;
  author: Author[];}
  // onEdit: (isbn: string)=> void
}


export default function BookTableRow(props:BookTableRowProp) {
  return (
      <tr>
        <TableEntry firstEntry={true}>{props.bookInfo.title}</TableEntry>
        <TableEntry>{props.bookInfo.isbn}</TableEntry>
        <TableEntry>{props.bookInfo.author.map((author) => author.name).join(", ")}</TableEntry>
        <TableEntry>{props.bookInfo.retailPrice}</TableEntry>
        <TableEntry>{props.bookInfo.genre.name}</TableEntry>
        <TableEntry>Add in Later</TableEntry>
        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
          <button className="text-indigo-600 hover:text-indigo-900">
            Edit<span className="sr-only">, {props.bookInfo.title}</span>
          </button>
        </td>
      </tr>
  )
}
