import { jsPDF } from "jspdf";
import autoTable, { Cell } from 'jspdf-autotable'
import { BookCase, ShelfBook } from "../../types/bookCaseTypes";


export function drawPlanogram(bookCase: BookCase, books: any[], shelfNums: Map<number, number>){
    let endOfTable: number
    const booksInfo = []
    const booksNeededColumnLabels = ["ISBN", "TITLE", "QUANTITY", "COVER"]
    const booksQuantityMap = new Map<string, {title: string, quantity: number}>()
    const planogram = new jsPDF();
    console.log(bookCase)
    for (const book of books){
        console.log(book)
        console.log(booksQuantityMap)
        if (!booksQuantityMap.get(book.isbn)){
            booksQuantityMap.set(book.isbn, {title: book.title, quantity: 0})
        }
        booksQuantityMap.set(book.isbn, {title: book.title, quantity: booksQuantityMap.get(book.isbn).quantity + findDisplayCount(book.isbn, bookCase.ShelfBook)})
    }


    for (let bookIsbn of booksQuantityMap.keys()){
        booksInfo.push([bookIsbn, booksQuantityMap.get(bookIsbn).title, booksQuantityMap.get(bookIsbn).quantity, ""])
    }

    let xstart
    let xend
    autoTable(planogram, {
        head: [booksNeededColumnLabels],
        body: booksInfo,
        didDrawCell: function(data){
            xstart = data.settings.margin.left + 10
            xend = data.cursor.x
            if (data.column.index === 3 && data.cell.section === 'body') {
                var dim1 = data.cell.height - data.cell.padding('vertical');
                var dim2 = data.cell.width - 2 * data.cell.padding('horizontal');
                var textPos = data.cell.getTextPos();
                endOfTable = data.cursor.y
                planogram.addImage(books[data.row.index].imageLink, textPos.x,  textPos.y, dim2, dim1);
             }
        }
      })
    
    let y = endOfTable + 20
    const ystart = y
    let pageLength = planogram.internal.pageSize
    const caseSize = pageLength.getHeight() - endOfTable
    const rowSize = caseSize / bookCase.numShelves > 50 ? 50 : caseSize / bookCase.numShelves
    const bookHeight = 0.75*(rowSize)
    const bookWidth = (xend - xstart) / Math.max(...shelfNums.values()) > 25 ? 25 : (xend - xstart) / Math.max(...shelfNums.values())
    for (let i = 0; i < bookCase.numShelves; i++){
        planogram.line(xstart, y, xend, y)
        planogram.text(`Shelf ${i + 1}`, xstart - 5, y + rowSize/2 + 5, {angle: 90})
        y += rowSize
    }
    let bookIndex = 0
    let currShelf = bookCase.ShelfBook[0].shelfNumber
    let rowIndex = 0
    for (const shelfBook of bookCase.ShelfBook){
        if (shelfBook.shelfNumber != currShelf){
            currShelf = shelfBook.shelfNumber
            rowIndex = 0
        }
        for (let j = 0; j < shelfBook.displayCount; j++){
            planogram.addImage(books[bookIndex].imageLink, xstart + rowIndex *(bookWidth), ystart + (shelfBook.shelfNumber) * (rowSize) + ((rowSize - bookHeight)/2), bookWidth, bookHeight);
            planogram.text(shelfBook.mode, xstart + rowIndex * (bookWidth) + (bookWidth/4), (shelfBook.shelfNumber) * (rowSize) + ystart + rowSize - ((rowSize - bookHeight)/8));
            rowIndex += 1
        }
        bookIndex += 1
    }
    planogram.line(xstart, y, xend, y)
    var file = `BookCase-${bookCase.name}.pdf`
    planogram.save(file)

}

function findDisplayCount(isbn: string, books: any[]){
    for (const book of books){
        if (book.bookIsbn === isbn){
            return book.displayCount
        }
    }
}