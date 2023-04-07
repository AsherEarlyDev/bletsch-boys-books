import {Book, Genre, Author} from '@prisma/client';
import React, {useState} from 'react'
import CardGrid from '../../../CardComponents/CardGrid';
import CardTitle from '../../../CardComponents/CardTitle';
import ImmutableCardProp from '../../../CardComponents/ImmutableCardProp';
import SecondaryButton from "../../../BasicComponents/SecondaryButton";
import PrimaryButton from "../../../BasicComponents/PrimaryButton";
import ImmutableDimensionsCardProp from "../../../CardComponents/ImmutableDimensionsCardProp";
import {CldImage} from "next-cloudinary";
import BookCardTabs from "../../../CardComponents/BookCardTabs";
import RelatedBooksDropdown from '../../../CardComponents/RelatedBooksDropdown';

interface BookModalProp {
  bookInfo: Book & {
    genre: Genre;
    author: Author[];
    lastMonthSales: number;
    daysOfSupply:number;
    bestBuybackPrice: number;
    shelfSpace: number;
    numberRelatedBooks: number;
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
        <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg justify-center items-center">
          <CardTitle heading="Book Description"
                     subheading="Intrinsic differences from subsidiary will be shown in red"></CardTitle>
          <div className="flex flex-col justify-center gap-5 ">
            <div className="flex flex-row gap-10 items-center border-t border-gray-200 justify-center">
              {props.bookInfo?.imageLink &&
              <CldImage
                  className="rounded-lg mx-10"
                  crop="fill"
                  height="280"
                  width="220"
                  src={props.bookInfo?.imageLink}
                  alt={"Image"}>
              </CldImage>
              }
              <CardGrid>
                <ImmutableCardProp heading="Book Title" data={props.bookInfo.title} subData={props.bookInfo.subsidiaryBook ? props.bookInfo.subsidiaryBook.title : null}></ImmutableCardProp>
                <ImmutableCardProp heading="Book ISBN" data={props.bookInfo.isbn}></ImmutableCardProp>
                <ImmutableCardProp heading="Author(s)"
                                   data={props.bookInfo.author ? props.bookInfo.author.join(", ") : ""} subData={props.bookInfo.subsidiaryBook ? (props.bookInfo.subsidiaryBook.authors).join(", ") : null}></ImmutableCardProp>
                <ImmutableCardProp heading="Publication Year"
                                   data={props.bookInfo.publicationYear} subData={props.bookInfo.subsidiaryBook ? props.bookInfo.subsidiaryBook.publicationYear : null}></ImmutableCardProp>
                <ImmutableCardProp heading="Publisher"
                                   data={props.bookInfo.publisher} subData={props.bookInfo.subsidiaryBook ? props.bookInfo.subsidiaryBook.publisher : null}></ImmutableCardProp>
                <ImmutableCardProp heading="Inventory"
                                   data={props.bookInfo.inventory}></ImmutableCardProp>
                <ImmutableCardProp heading="Genre" data={props.bookInfo.genre}></ImmutableCardProp>
                <ImmutableCardProp heading="Retail Price"
                                   data={props.bookInfo.retailPrice}></ImmutableCardProp>
                <ImmutableCardProp heading="Page Count"
                                   data={props.bookInfo.pageCount}></ImmutableCardProp>
                <ImmutableCardProp heading="Last Month Sales"
                                   data={props.bookInfo.lastMonthSales}></ImmutableCardProp>
                <ImmutableCardProp heading="Number of Related Books"
                                   data={props.bookInfo.numberRelatedBooks}></ImmutableCardProp>
                <ImmutableCardProp heading="Shelf Space"
                                   data={props.bookInfo.dimensions[1] || props.bookInfo.shelfSpace==0  ? props.bookInfo.shelfSpace : props.bookInfo.shelfSpace+" (est)"}></ImmutableCardProp>
                <ImmutableCardProp heading="Days of Supply"
                                   data={props.bookInfo.daysOfSupply}></ImmutableCardProp>
                <ImmutableCardProp heading="Best Buyback Price"
                                   data={props.bookInfo.bestBuybackPrice==0 ? "-" : "$"+(props.bookInfo.bestBuybackPrice).toFixed(2)}></ImmutableCardProp>
                <ImmutableCardProp heading="Subsidiary Inventory"
                                   data={props.bookInfo.subsidiaryBook ? props.bookInfo.subsidiaryBook.inventoryCount : "-" }></ImmutableCardProp>
                <ImmutableCardProp heading="Subsidiary Price"
                                   data={props.bookInfo.subsidiaryBook ? "$"+(props.bookInfo.subsidiaryBook.retailPrice).toFixed(2) : "-" }></ImmutableCardProp>
                <ImmutableDimensionsCardProp length={props.bookInfo.dimensions[2] ?? 0} width={props.bookInfo.dimensions[0]} height={props.bookInfo.dimensions[1] ?? 0}></ImmutableDimensionsCardProp>
              </CardGrid>
            </div>
            <BookCardTabs title={props.bookInfo.title} isbn={props.bookInfo.isbn}></BookCardTabs>
          </div>
          <div className="gap-5 flex flex-row justify-around px-4 py-8 sm:px-6">
            <SecondaryButton onClick={closeModal} buttonText="Exit"></SecondaryButton>
            <PrimaryButton onClick={openEdit} buttonText="Edit Book"></PrimaryButton>
          </div>
        </div>
              : null)
  )
}
