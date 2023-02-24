import ImmutableCardProp from "../../../CardComponents/ImmutableCardProp";
import MutableCardProp from "../../../CardComponents/MutableCardProp";
import GenreCardProp from "../../../CardComponents/GenreCardProp";
import CardTitle from "../../../CardComponents/CardTitle";
import CardGrid from "../../../CardComponents/CardGrid";
import SaveCardChanges from "../../../CardComponents/SaveCardChanges";
import { completeBook, databaseBook, editableBook } from '../../../../types/bookTypes';
import React, { useState } from 'react';
import { api } from '../../../../utils/api';
import ImmutableDimensionsCardProp from "../../../CardComponents/MutableDimensionsCardProp";
import MutableDimensionsCardProp from "../../../CardComponents/MutableDimensionsCardProp";
import {CldImage, CldUploadButton} from "next-cloudinary";


interface BookCardProp{
  bookInfo:  editableBook | undefined
  closeOut: () => void
}


export default function EditBookModal(props:BookCardProp) {
  const defaultPrice = props.bookInfo?.retailPrice ?? 25
  const defaultPageCount = props.bookInfo?.pageCount ?? 0
  const defaultDimenions = props.bookInfo?.dimensions ?  (props.bookInfo?.dimensions.length == 3 ? props.bookInfo?.dimensions : [0,0,0]) : [0,0,0]
  const [genre, setGenre] = useState<{name:string}>()
  const [open, setOpen] = useState(true)
  const [retailPrice, setRetailPrice] = useState<number>(defaultPrice)
  const [pageCount, setPageCount] = useState<number>(defaultPageCount)
  const [width, setWidth] = useState<number>(defaultDimenions[0] ?? 0)
  const [thickness, setHeight] = useState<number>(defaultDimenions[1] ?? 0)
  const [height, setLength] = useState<number>(defaultDimenions[2] ?? 0)
  const action = api.books.editBook.useMutation()

  function closeModal(){
    setOpen(false)
    props.closeOut()
  }

  function saveBook(){
    if(props.bookInfo && genre){
      action.mutate({
        isbn: props.bookInfo.isbn,
        title: props.bookInfo.title ?? "",
        publisher: props.bookInfo.publisher ?? "",
        publicationYear: props.bookInfo.publicationYear ?? -1,
        author: props.bookInfo.author ?? [],
        retailPrice: Number(retailPrice),
        pageCount: Number(pageCount),
        dimensions: (width && thickness && height)? [Number(width), Number(thickness), Number(height)] : [],
        genre: genre.name
      })
      closeModal()
    }
    else{
      alert("Need to choose a genre")
    }
  }

  return (
      (open ? (props.bookInfo ?
      <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
        <CardTitle heading="Book Description" subheading="Confirm and validate book information below..."></CardTitle>
        <div className="flex flex-row gap-10 items-center border-t border-gray-200">
          <CldUploadButton
              className="drop-shadow-md"
              uploadPreset="book-image-preset"
              options={{
                multiple: false,
                publicId: "book",
                clientAllowedFormats: ["image"],
                sources: ["local", "url"]

              }}
              onUpload={(result, widget) => {
                console.log(result.info.public_id)
              }}>
            <CldImage
              className="rounded-lg mx-10 hover:bg-black hover:opacity-50 group"
              width="250"
              height="250"
              src="https://res.cloudinary.com/dyyevpzdz/image/upload/v1677264732/book-covers/lisphiz2ltw9oew0urvp.png"
              alt={"Image"}>
            </CldImage>
          </CldUploadButton>
          <CardGrid>
            <ImmutableCardProp heading="Book Title" data={props.bookInfo.title}></ImmutableCardProp>
            <ImmutableCardProp heading="Book ISBN" data={props.bookInfo.isbn}></ImmutableCardProp>
            <ImmutableCardProp heading="Author(s)" data={props.bookInfo.author ? props.bookInfo.author.join(", ") : ""}></ImmutableCardProp>
            <ImmutableCardProp heading="Publication Year" data={props.bookInfo.publicationYear}></ImmutableCardProp>
            <ImmutableCardProp heading="Publisher" data={props.bookInfo.publisher}></ImmutableCardProp>
            <ImmutableCardProp heading="Inventory" data={props.bookInfo.inventory}></ImmutableCardProp>
            <GenreCardProp saveFunction={setGenre} defaultValue={props.bookInfo.genre}></GenreCardProp>
            <MutableCardProp saveValue={setRetailPrice} heading="Retail Price" required="True" dataType="number" defaultValue={defaultPrice}></MutableCardProp>
            <MutableCardProp saveValue={setPageCount} heading="Page Count" dataType="number" defaultValue={defaultPageCount}></MutableCardProp>
            <MutableDimensionsCardProp defaultLength={defaultDimenions[2]} defaultWidth={defaultDimenions[0]} defaultHeight={defaultDimenions[1]} saveLength={setLength} saveWidth={setWidth} saveHeight={setHeight}></MutableDimensionsCardProp>
          </CardGrid>
        </div>
        <SaveCardChanges closeModal={closeModal} saveModal={saveBook}></SaveCardChanges>
      </div>
      : null) : null)
  )
}
