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
  const [image, setImage] = useState(props.bookInfo?.imageLink)
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
        genre: genre.name,
        imageLink: image
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
        <div className="flex flex-row gap-5 items-center border-t border-gray-200">
          <div className="flex flex-col ml-5 mr-4">
            {image ?
            <CldImage
                className="rounded-lg"
                crop="fill"
                height="280"
                width="220"
                src={image}
                alt={"Image"}>
            </CldImage>
                :
                <h3 className="m-5 text-md">Book has no cover image...</h3>
            }
            <CldUploadButton
                uploadPreset="book-image-preset"
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                onUpload={(result, widget) => {
                  console.log(result)
                  if (result.event == "success") {
                    setImage(result?.info.secure_url)
                    widget.close()
                  }
                }}
                options={{
                  multiple: false,
                  sources: ["local", "url"],
                  clientAllowedFormats: ["image"]
                }}
            />
          </div>
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
