import TableEntry from "../TableEntries/TableEntry";
import React, {useState} from "react";
import {api} from "../../../utils/api";
import {Sale} from "../../../types/salesTypes";

interface SaleTableRowProp{
  sale: Sale
}

export default function SaleTableRow(props:SaleTableRowProp) {
  const [salePrice, setSalePrice] = useState(props.sale.price)
  const [quantitySold, setQuantitySold] = useState(props.sale.quantity)
  const [isbn, setIsbn] = useState(props.sale.bookId)
  const [open, setOpen] = useState(true)
  const book = api.books.findInternalBook.useQuery({isbn: props.sale.bookId}).data
  //const [displayRow, setDisplayRow] = useState(true)
  const [visible, setVisible] =useState(true)
  //const action = (props.isExisting) ? (api.books.editBook.useMutation()) : (api.books.saveBook.useMutation())

  function closeModal(){
    setVisible(false)
  }


  // function addBook(){
  //   if(genre && props.bookInfo){
  //     action.mutate({
  //       isbn: props.bookInfo.isbn,
  //       title: props.bookInfo.title ?? "",
  //       publisher: props.bookInfo.publisher ?? "",
  //       publicationYear: props.bookInfo.publicationYear ?? -1,
  //       author: props.bookInfo.author ?? [],
  //       retailPrice: Number(retailPrice),
  //       pageCount: Number(pageCount),
  //       dimensions: (width && height && length)? [Number(width), Number(height), Number(length)] : [],
  //       genre: genre.name
  //     })
  //     alert(((props.isExisting) ? "Edited book: " : "Added book: ") + props.bookInfo.title)
  //     closeModal()
  //   }
  //   else{
  //     alert("Handle toast alert to notify add genre for book: " + props.bookInfo.title)
  //   }
  //
  // }


  return (
      (visible &&
          <tr>
            <TableEntry firstEntry={true}>{(book) ? book.title : "" }</TableEntry>
            <TableEntry>${props.sale.price.toFixed(2)}</TableEntry>
            <TableEntry>{props.sale.quantity}</TableEntry>
            <TableEntry>${props.sale.subtotal.toFixed(2)}</TableEntry>
          </tr>
      )
  )
}
