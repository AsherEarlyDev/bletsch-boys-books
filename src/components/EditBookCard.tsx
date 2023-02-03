import ImmutableCardProp from "./CardComponents/ImmutableCardProp";
import MutableCardProp from "./CardComponents/MutableCardProp";
import GenreCardProp from "./CardComponents/GenreCardProp";
import CardTitle from "./CardComponents/CardTitle";
import CardGrid from "./CardComponents/CardGrid";
import SaveCardChanges from "./CardComponents/SaveCardChanges";
import { completeBook, databaseBook, externalBook } from '../types/bookTypes';
import { useState } from 'react';
import { api } from '../utils/api';
import {Author, Book, Genre} from "@prisma/client";

interface EditBookCardProp{
  bookInfo: Book & {
    genre: Genre;
    author: Author[];}| undefined
}


export default function EditBookCard(props:EditBookCardProp) {
  const bookPrice = props.bookInfo?.retailPrice
  const bookPageCount = props.bookInfo?.pageCount
  const bookDimensions = props.bookInfo?.dimensions
  const [book, setBook] = useState<completeBook>()
  const [genre, setGenre] = useState<{name:string}>()
  const [open, setOpen] = useState(true)
  const [retailPrice, setRetailPrice] = useState<number>(bookPrice)
  const [pageCount, setPageCount] = useState<number>(bookPageCount)
  const [width, setWidth] = useState<number>(bookDimensions[0] ?? 0)
  const [thickness, setThickness] = useState<number>(bookDimensions[1] ?? 0)
  const [height, setHeight] = useState<number>(bookDimensions[2] ?? 0)
  const save = api.books.editBook.useMutation()

  function editBook(){
    if(props.bookInfo){
      alert("Moo")
      closeModal()
    }
    else{
      alert("Need to choose a genre")
    }
  }

  function closeModal(){
    setOpen(false)
  }

  return (
      (open ? (props.bookInfo ?
      <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
        <CardTitle heading="Book Description" subheading="Confirm and validate book information below..."></CardTitle>
        <CardGrid>
          <ImmutableCardProp heading="Book Title" data={props.bookInfo.title}></ImmutableCardProp>
          <ImmutableCardProp heading="Book ISBN" data={props.bookInfo.isbn}></ImmutableCardProp>
          <ImmutableCardProp heading="Author(s)" data={props.bookInfo.author ? props.bookInfo.author.join(", ") : ""}></ImmutableCardProp>
          <ImmutableCardProp heading="Publication Year" data={props.bookInfo.publicationYear}></ImmutableCardProp>
          <ImmutableCardProp heading="Publisher" data={props.bookInfo.publisher}></ImmutableCardProp>
          <GenreCardProp saveFunction = {setGenre}></GenreCardProp>
          <MutableCardProp saveValue={setRetailPrice} heading="Retail Price" required="True" dataType="number" defaultValue={bookPrice}></MutableCardProp>
          <MutableCardProp saveValue={setPageCount} heading="Page Count" dataType="number" defaultValue={bookPageCount}></MutableCardProp>
          <MutableCardProp saveValue={setWidth} heading="Width" dataType="number" defaultValue={bookDimensions[0]}></MutableCardProp>
          <MutableCardProp saveValue={setThickness} heading="Thickness" dataType="number" defaultValue={bookDimensions[1]}></MutableCardProp>
          <MutableCardProp saveValue={setHeight} heading="Height" dataType="number" defaultValue={bookDimensions[2]}></MutableCardProp>
        </CardGrid>
        <SaveCardChanges closeModal={closeModal} saveBook={editBook}></SaveCardChanges>
      </div>
      : null) : null)
  )
}
