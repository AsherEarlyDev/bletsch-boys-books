import { PaperClipIcon } from '@heroicons/react/20/solid'
import ImmutableCardProp from "./CardComponents/ImmutableCardProp";
import MutableCardProp from "./CardComponents/MutableCardProp";
import GenreCardProp from "./CardComponents/GenreCardProp";
import CardTitle from "./CardComponents/CardTitle";
import CardGrid from "./CardComponents/CardGrid";
import SaveCardChanges from "./CardComponents/SaveCardChanges";
import { externalBook } from '../types/bookTypes';

interface BookCardProp{
  bookInfo:  externalBook | undefined
}

export default function BookCard(props:BookCardProp) {

  return (
    props.bookInfo ? 
      <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
        <CardTitle heading="Book Description" subheading="Confirm and validate book information below..."></CardTitle>
        <CardGrid>
          <ImmutableCardProp heading="Book Title" data={props.bookInfo.title}></ImmutableCardProp>
          <ImmutableCardProp heading="Book ISBN" data={props.bookInfo.isbn}></ImmutableCardProp>
          <ImmutableCardProp heading="Author(s)" data={props.bookInfo.author.join(", ")}></ImmutableCardProp>
          <ImmutableCardProp heading="Publication Year" data={props.bookInfo.publicationYear}></ImmutableCardProp>
          <ImmutableCardProp heading="Publisher" data={props.bookInfo.publisher}></ImmutableCardProp>
          <GenreCardProp></GenreCardProp>
          <MutableCardProp heading="Retail Price" required="True" dataType="number" defaultValue="100"></MutableCardProp>
          <MutableCardProp heading="Page Count" dataType="number" defaultValue="100"></MutableCardProp>
          <MutableCardProp heading="Dimensions" dataType="number" defaultValue="101010"></MutableCardProp>
        </CardGrid>
        <SaveCardChanges></SaveCardChanges>
      </div>
      : null
  )
}
