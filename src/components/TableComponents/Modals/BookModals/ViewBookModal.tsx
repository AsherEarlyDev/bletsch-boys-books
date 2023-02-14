import {Book, Genre, Author} from '@prisma/client';
import React, {useState} from 'react'
import CardGrid from '../../../CardComponents/CardGrid';
import CardTitle from '../../../CardComponents/CardTitle';
import ImmutableCardProp from '../../../CardComponents/ImmutableCardProp';
import SecondaryButton from "../../../BasicComponents/SecondaryButton";
import PrimaryButton from "../../../BasicComponents/PrimaryButton";

interface BookModalProp {
  bookInfo: Book & {
    genre: Genre;
    author: Author[];
  },
  closeOut: () => void
  openEdit: (isbn: string) => void
}

export default function ViewBookModal(props: BookModalProp) {
  const [open, setOpen] = useState(true);

  function closeModal() {
    setOpen(false)
    props.closeOut()
  }

  async function openEdit() {
    props.openEdit(props.bookInfo.isbn)
    props.closeOut()
  }

  return (
      (open ?
        <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
          <CardTitle heading="Book Description"
                     subheading="Confirm and validate book information below..."></CardTitle>
          <CardGrid>
            <ImmutableCardProp heading="Book Title" data={props.bookInfo.title}></ImmutableCardProp>
            <ImmutableCardProp heading="Book ISBN" data={props.bookInfo.isbn}></ImmutableCardProp>
            <ImmutableCardProp heading="Author(s)"
                               data={props.bookInfo.author ? props.bookInfo.author.map((auth) => auth.name).join(", ") : ""}></ImmutableCardProp>
            <ImmutableCardProp heading="Publication Year"
                               data={props.bookInfo.publicationYear}></ImmutableCardProp>
            <ImmutableCardProp heading="Publisher"
                               data={props.bookInfo.publisher}></ImmutableCardProp>
            <ImmutableCardProp heading="Inventory"
                               data={props.bookInfo.inventory}></ImmutableCardProp>
            <ImmutableCardProp heading="genre" data={props.bookInfo.genre.name}></ImmutableCardProp>
            <ImmutableCardProp heading="Retail Price"
                               data={props.bookInfo.retailPrice}></ImmutableCardProp>
            <ImmutableCardProp heading="Page Count"
                               data={props.bookInfo.pageCount}></ImmutableCardProp>
            <ImmutableCardProp heading="Width"
                               data={props.bookInfo.dimensions[0] ?? 0}></ImmutableCardProp>
            <ImmutableCardProp heading="Thickness"
                               data={props.bookInfo.dimensions[1] ?? 0}></ImmutableCardProp>
            <ImmutableCardProp heading="Height"
                               data={props.bookInfo.dimensions[2] ?? 0}></ImmutableCardProp>
          </CardGrid>
          <div className="gap-5 flex flex-row justify-around px-4 py-8 sm:px-6">
            <SecondaryButton onClick={closeModal} buttonText="Exit"></SecondaryButton>
            <PrimaryButton onClick={openEdit} buttonText="Edit Book"></PrimaryButton>
          </div>
        </div>
              : null)
  )
}
