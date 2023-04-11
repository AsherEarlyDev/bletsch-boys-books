import { jsPDF } from "jspdf";
import autoTable, { Cell } from 'jspdf-autotable'
import { BookCase, ShelfBook } from "../../types/bookCaseTypes";


export function drawPlanogram(bookCase: BookCase, books: any[], shelfNums: Map<number, number>){
    let endOfTable: number
    const booksInfo = []
    const booksNeededColumnLabels = ["ISBN", "TITLE", "QUANTITY", "COVER"]
    const booksQuantityMap = new Map<string, {title: string, quantity: number}>()
    const booksImageList: string[] = []
    const planogram = new jsPDF();
    for (const book of books){
        if (!booksImageList.includes(book.imageLink)){
            booksImageList.push(book.imageLink)
        }
        if (!booksQuantityMap.get(book.isbn)){
            booksQuantityMap.set(book.isbn, {title: book.title, quantity: 0})
        }
        booksQuantityMap.set(book.isbn, {title: book.title, quantity: booksQuantityMap.get(book.isbn).quantity + findDisplayCount(book.isbn, bookCase.ShelfBook)})
    }


    for (let bookIsbn of booksQuantityMap.keys()){
        booksInfo.push([bookIsbn, booksQuantityMap.get(bookIsbn).title, booksQuantityMap.get(bookIsbn).quantity, ""])
    }

    let xstart: number
    let xend: number
    let counter = 0
    planogram.setFontSize(25)
    planogram.text(`BookCase: ${bookCase.name}`, 105, 10, {align: "center"})
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

                if (booksImageList[counter]!=""){
                    planogram.addImage(booksImageList[counter], textPos.x,  textPos.y, dim2, dim1);
                }

                counter += 1
             }
        }
      })
   
    let y = endOfTable + 20 
    const ystart = y
    let pageLength = planogram.internal.pageSize
    const caseSize = pageLength.getHeight() - y - (2 * bookCase.numShelves)
    const rowSize = caseSize / (bookCase.numShelves) + 2 > 50 ? 50 : caseSize / bookCase.numShelves
    const bookHeight = 0.75*(rowSize)
    const bookWidth = (xend - xstart - Math.max(...shelfNums.values()) - 1) / Math.max(...shelfNums.values()) > 30 ? 30 : (xend - xstart) / Math.max(...shelfNums.values())
    planogram.line(xstart, ystart, xend, ystart)
    y += rowSize
    for (let i = 1; i < bookCase.numShelves; i++){
        planogram.line(xstart, y, xend, y)
        planogram.setFontSize(rowSize/3)
        if (i === 0 ){
            planogram.text(`Top Shelf`, xstart - 5, y + rowSize/2 + rowSize/6, {angle: 90})
        }
        else if (i === bookCase.numShelves - 1){
            planogram.text(`Bottom Shelf`, xstart - 5, y + rowSize/2 + rowSize/3, {angle: 90})
        }
        
        y += rowSize
    }
    let bookIndex = 0

    let bookXStart = xstart
    let shelf = 0
    const font: number = planogram.getFontSize()
    const pxToPt: number = 0.75
    const charsPerTitleRow: number = 10
    for (const shelfBook of bookCase.ShelfBook){
        if (shelfBook.shelfNumber != shelf){
            shelf = shelfBook.shelfNumber
            bookXStart = xstart
        }
        if (books[bookIndex].imageLink != ""){
            planogram.addImage(books[bookIndex].imageLink, bookXStart + shelfBook.index *(bookWidth), ystart + (shelfBook.shelfNumber) * (rowSize), bookWidth, bookHeight);
        }
        planogram.rect(bookXStart + shelfBook.index * (bookWidth), ystart + (shelfBook.shelfNumber) * (rowSize), bookWidth, bookHeight)
        planogram.setFontSize(font)
        let fontSize = (bookWidth/charsPerTitleRow)/pxToPt < (((rowSize - bookHeight) - 2) / 3) / pxToPt ? (bookWidth/charsPerTitleRow)/pxToPt : (((rowSize - bookHeight) - 2) / 3) / pxToPt
        planogram.setFontSize(fontSize)
        const title = planogram.splitTextToSize(books[bookIndex].title, bookWidth).slice(0, 2)
        planogram.text(title, bookXStart + shelfBook.index * (bookWidth) + (bookWidth/2), ystart + (shelfBook.shelfNumber) * (rowSize) + bookHeight + 1 + planogram.getTextDimensions(title[0]).h, {align: "center", maxWidth: bookWidth});
        planogram.text(`${shelfBook.mode}: ${shelfBook.displayCount}x`, bookXStart + shelfBook.index * (bookWidth) + (bookWidth/2), ystart + (shelfBook.shelfNumber) * (rowSize) + bookHeight + 2 + 3 * planogram.getTextDimensions(title[0]).h, {align: "center"});
        bookIndex += 1
        bookXStart += 1
    }
    planogram.line(xstart, y + 2, xend, y + 2)

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