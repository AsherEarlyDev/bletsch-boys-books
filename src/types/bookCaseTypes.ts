export type BookCase = {
    name: string,
    width: number,
    userName: string,
    numShelves: number,
    date: Date,
    ShelfBook?: ShelfBook[]
}

export type ShelfBook = {
    id: string,
    shelfNumber: number,
    index: number,
    mode: string,
    edit: boolean,
    displayCount: number,
    bookIsbn: string,
    bookCaseContainerName: string
}
