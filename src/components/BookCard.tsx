import { PaperClipIcon } from '@heroicons/react/20/solid'
import ImmutableCardProp from "./CardComponents/ImmutableCardProp";
import MutableCardProp from "./CardComponents/MutableCardProp";
import GenreCardProp from "./CardComponents/GenreCardProp";
import CardTitle from "./CardComponents/CardTitle";
import CardGrid from "./CardComponents/CardGrid";
import SaveCardChanges from "./CardComponents/SaveCardChanges";

export default function BookCard() {
  return (
      <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
        <CardTitle heading="Book Description" subheading="Confirm and validate book information below..."></CardTitle>
        <CardGrid>
          <ImmutableCardProp heading="Book Title" data="get from API"></ImmutableCardProp>
          <ImmutableCardProp heading="Book ISBN" data="Get ISBN from API"></ImmutableCardProp>
          <ImmutableCardProp heading="Author(s)" data="Get authors from API"></ImmutableCardProp>
          <ImmutableCardProp heading="Publication Year" data="Get publication year from API"></ImmutableCardProp>
          <ImmutableCardProp heading="Publisher" data="Get publisher from API"></ImmutableCardProp>
          <GenreCardProp></GenreCardProp>
          <MutableCardProp heading="Retail Price" required="True" dataType="number" defaultValue="100"></MutableCardProp>
          <MutableCardProp heading="Page Count" dataType="number" defaultValue="100"></MutableCardProp>
          <MutableCardProp heading="Dimensions" dataType="number" defaultValue="101010"></MutableCardProp>
        </CardGrid>
        <SaveCardChanges></SaveCardChanges>
      </div>
  )
}
