export type PurchaseOrder = {
    id: string,
    date: string,
    vendor: {id: string, name: string, bookBuybackPercentage: number}
    purchases: any[],
    totalBooks: number,
    uniqueBooks: number,
    userName: string,
    cost: number
}


export type Purchase = {
    id: string,
    bookId: string,
    purchaseOrderId: string,
    quantity: number,
    price: number,
    subtotal: number
}
