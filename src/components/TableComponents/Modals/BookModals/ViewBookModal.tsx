import {Book, Genre, Author} from '@prisma/client';
import React, {useState} from 'react'
import CardGrid from '../../../CardComponents/CardGrid';
import CardTitle from '../../../CardComponents/CardTitle';
import ImmutableCardProp from '../../../CardComponents/ImmutableCardProp';
import SecondaryButton from "../../../BasicComponents/SecondaryButton";
import PrimaryButton from "../../../BasicComponents/PrimaryButton";
import ImmutableDimensionsCardProp from "../../../CardComponents/ImmutableDimensionsCardProp";

interface BookModalProp {
  bookInfo: Book & {
    genre: Genre;
    author: Author[];
    lastMonthSales: number;
    daysOfSupply:number;
    bestBuybackPrice: number;
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
                               data={props.bookInfo.author ? props.bookInfo.author.join(", ") : ""}></ImmutableCardProp>
            <ImmutableCardProp heading="Publication Year"
                               data={props.bookInfo.publicationYear}></ImmutableCardProp>
            <ImmutableCardProp heading="Publisher"
                               data={props.bookInfo.publisher}></ImmutableCardProp>
            <ImmutableCardProp heading="Inventory"
                               data={props.bookInfo.inventory}></ImmutableCardProp>
            <ImmutableCardProp heading="Genre" data={props.bookInfo.genre}></ImmutableCardProp>
            <ImmutableCardProp heading="Retail Price"
                               data={props.bookInfo.retailPrice}></ImmutableCardProp>
            <ImmutableCardProp heading="Page Count"
                               data={props.bookInfo.pageCount}></ImmutableCardProp>
            <ImmutableCardProp heading="Last Month Sales"
                               data={props.bookInfo.lastMonthSales}></ImmutableCardProp>
            <ImmutableCardProp heading="Shelf Space"
                               data={props.bookInfo.dimensions[1] || props.bookInfo.shelfSpace==0  ? props.bookInfo.shelfSpace : props.bookInfo.shelfSpace+" (est)"}></ImmutableCardProp>
            <ImmutableCardProp heading="Days of Supply"
                               data={props.bookInfo.daysOfSupply}></ImmutableCardProp>
            <ImmutableCardProp heading="Best Buyback Price"
                               data={props.bookInfo.bestBuybackPrice==0 ? "-" : props.bookInfo.bestBuybackPrice}></ImmutableCardProp>

            <ImmutableDimensionsCardProp length={props.bookInfo.dimensions[2] ?? 0} width={props.bookInfo.dimensions[0]} height={props.bookInfo.dimensions[1] ?? 0}></ImmutableDimensionsCardProp>
          </CardGrid>
          <div className="gap-5 flex flex-row justify-around px-4 py-8 sm:px-6">
            <SecondaryButton onClick={closeModal} buttonText="Exit"></SecondaryButton>
            <PrimaryButton onClick={openEdit} buttonText="Edit Book"></PrimaryButton>
          </div>
        </div>
              : null)
  )
}
