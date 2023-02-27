export type BuybackOrder = {
    id: string,
    date: string,
    vendor: {id: string, name: string, bookBuybackPercentage: number}
    buybacks: any[],
    totalBooks: number,
    uniqueBooks: number,
    revenue: number
}

export type Buyback = {
    id: string,
    bookId: string,
    buybackOrderId: string,
    quantity: number,
    price: number,
    subtotal: number
}