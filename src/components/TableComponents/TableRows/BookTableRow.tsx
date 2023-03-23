import TableEntry from "../TableEntries/TableEntry";
import React from "react";
import EditRowEntry from "../TableEntries/EditRowEntry";
import ViewTableEntry from "../TableEntries/ViewTableEntry";
import DeleteEntryModal from "../Modals/MasterModals/DeleteEntryModal";
import {api} from "../../../utils/api";

interface BookTableRowProp{
  bookInfo: any
  onEdit: (isbn:string) => void
  onView: (isbn:string)=> void
}


export default function BookTableRow(props:BookTableRowProp) {
  const isInStock: boolean = (props.bookInfo.inventory != 0)
  function handleEdit(){
    props.onEdit(props.bookInfo.isbn)
  }
  function handleView(){
    props.onView(props.bookInfo.isbn)
  }

  return (
      <tr>
        <ViewTableEntry imageUrl={props.bookInfo?.imageLink} hasThumbnail={true} onView={handleView}>
          {props.bookInfo.title}
        </ViewTableEntry>
        <TableEntry>{props.bookInfo.isbn}</TableEntry>
        <TableEntry>{props.bookInfo.author.map((author) => author.name).join(", ")}</TableEntry>
        <TableEntry width={28}>{props.bookInfo.genre.name}</TableEntry>
        <TableEntry width={20}>${props.bookInfo.retailPrice.toFixed(2)}</TableEntry>
        <TableEntry width={20}>{props.bookInfo.inventory}</TableEntry>
        <TableEntry width={20}>{props.bookInfo.lastMonthSales}</TableEntry>
        <TableEntry width={16}>{(props.bookInfo.dimensions[1])?.toFixed(1) + "\"" || props.bookInfo.shelfSpace==0 ? (props.bookInfo.shelfSpace)?.toFixed(1) +"\"" : (props.bookInfo.shelfSpace)?.toFixed(1)+"\" (est)"}</TableEntry>
        <TableEntry width={12}>{(props.bookInfo.daysOfSupply == Infinity ? "Inf." : props.bookInfo.daysOfSupply?.toFixed(2) )}</TableEntry>
        <TableEntry width={12}>{props.bookInfo.bestBuybackPrice==0 ? "-" : "$" + props.bookInfo.bestBuybackPrice.toFixed(2)}</TableEntry>
        <TableEntry width={12}>{props.bookInfo.numberRelatedBooks}</TableEntry>
        <EditRowEntry onEdit={handleEdit}></EditRowEntry>
        {isInStock ? null : <DeleteEntryModal id={props.bookInfo.isbn} item={"Book"} router={api.books.deleteBookByISBN}></DeleteEntryModal>}
      </tr>
  )
}
