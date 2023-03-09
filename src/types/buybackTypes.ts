export type BuybackOrder = {
    id: string,
    date: string,
    vendor: {id: string, name: string, bookBuybackPercentage: number}
    buybacks: any[],
    totalBooks: number,
    uniqueBooks: number,
    revenue: number,
    userName: string
}

export type Buyback = {
    id: string,
    bookId: string,
    buybackOrderId: string,
    quantity: number,
    buybackPrice: number,
    subtotal: number
}