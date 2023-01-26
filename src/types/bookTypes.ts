import { List } from "postcss/lib/list"
import { arrayOutputType } from "zod"
export type googleBookContainer = {
    kind: string,
    id: string
    etag: string
    selfLink: string
    volumeInfo: googleBookInfo
}
export type googleBookInfo = {
    title: string,
    authors: Array<string>,
    publisher: string,
    publishedDate?: string,
    description?: string,
    industryIdentifiers?: Array<GoogleISBNInfo>,
    pageCount?: number,
    dimensions?: dimensions,
    printType?: string,
    mainCategory?: string,
    categories?: Array<string>
    averageRating?: number,
    ratingsCount?: number,
    contentVersion?: string,
    imageLinks?: object,
    language?: string,
    infoLink?: string,
    canonicalVolumeLink?: string,
    saleInfo?:saleInfo,
    accessInfo?: {}
}

export type book = {
    isbn: string,
    title:string,
    publisher: string,
    author: Array<string>,
    publicationYear?: string,
    dimensions?: dimensions,
    pageCount?: number,
    genre?: string,
    retailPrice?: number

}

export type saleInfo = {
    country: string,
    saleability:string,
    isEbook: boolean,
    listPrice:pricing
    retailPrice:pricing,
    buyLink:string
}

export type pricing = {
    amount: number,
    currencyCode: string
}

export type dimensions = {
    height: string,
    width: string,
    thickness: string
}

export type GoogleISBNInfo = {
    type: string,
    identifier: string
}

export type rawGoogleOutput = {
    items: Array<googleBookContainer>,
    kind:string,
    totalItems: number
}

