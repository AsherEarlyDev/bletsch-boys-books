import ImmutableCardProp from "./CardComponents/ImmutableCardProp";
import MutableCardProp from "./CardComponents/MutableCardProp";
import GenreCardProp from "./CardComponents/GenreCardProp";
import CardTitle from "./CardComponents/CardTitle";
import CardGrid from "./CardComponents/CardGrid";
import SaveCardChanges from "./CardComponents/SaveCardChanges";
import { editableBook } from '../types/bookTypes';
import { useState } from 'react';
import { api } from '../utils/api';


interface BookCardProp{
  bookInfo:  editableBook | undefined
  cardType: string
  closeOut?: () => void
}


export default function BookCard(props:BookCardProp) {
  const defaultPrice = props.bookInfo?.retailPrice ?? 25
  const defaultPageCount = props.bookInfo?.pageCount ?? 0
  const defaultDimenions = props.bookInfo?.dimensions ?  (props.bookInfo?.dimensions.length == 3 ? props.bookInfo?.dimensions : [0,0,0]) : [0,0,0]
  const [genre, setGenre] = useState<{name:string}>()
  const [open, setOpen] = useState(true)
  const [retailPrice, setRetailPrice] = useState<number>(defaultPrice)
  const [pageCount, setPageCount] = useState<number>(defaultPageCount)
  const [width, setWidth] = useState<number>(defaultDimenions[0] ?? 0)
  const [thickness, setThickness] = useState<number>(defaultDimenions[1] ?? 0)
  const [height, setHeight] = useState<number>(defaultDimenions[2] ?? 0)
  const action = (props.cardType === "edit") ? (api.books.editBook.useMutation()) : (api.books.saveBook.useMutation())

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
        <CardGrid>
          <ImmutableCardProp heading="Book Title" data={props.bookInfo.title}></ImmutableCardProp>
          <ImmutableCardProp heading="Book ISBN" data={props.bookInfo.isbn}></ImmutableCardProp>
          <ImmutableCardProp heading="Author(s)" data={props.bookInfo.author ? props.bookInfo.author.join(", ") : ""}></ImmutableCardProp>
          <ImmutableCardProp heading="Publication Year" data={props.bookInfo.publicationYear}></ImmutableCardProp>
          <ImmutableCardProp heading="Publisher" data={props.bookInfo.publisher}></ImmutableCardProp>
          <ImmutableCardProp heading="Inventory" data={props.bookInfo.inventory}></ImmutableCardProp>
          <GenreCardProp saveFunction = {setGenre} defaultValue={props.bookInfo.genre}></GenreCardProp>
          <MutableCardProp saveValue={setRetailPrice} heading="Retail Price" required="True" dataType="number" defaultValue={defaultPrice}></MutableCardProp>
          <MutableCardProp saveValue={setPageCount} heading="Page Count" dataType="number" defaultValue={defaultPageCount}></MutableCardProp>
          <MutableCardProp saveValue={setWidth} heading="Width" dataType="number" defaultValue={defaultDimenions[0]}></MutableCardProp>
          <MutableCardProp saveValue={setThickness} heading="Thickness" dataType="number" defaultValue={defaultDimenions[1]}></MutableCardProp>
          <MutableCardProp saveValue={setHeight} heading="Height" dataType="number" defaultValue={defaultDimenions[2]}></MutableCardProp>
        </CardGrid>
        <SaveCardChanges closeModal={closeModal} saveModal={saveBook}></SaveCardChanges>
      </div>
      : null) : null)
  )
}
