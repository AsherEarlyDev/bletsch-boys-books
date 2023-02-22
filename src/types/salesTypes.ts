
export type topSellers = {
    numBooks: number,
    revenue: number,
    recentCost: number,
    title: string
}

export type Revenue = {
    revenue: number,
    sales: any[]
}

export type Cost = {
    cost: number,
    purchases: any[]
}

export type SalesRec = {
    id: string,
    date: string,
    sales: Sale[],
    totalBooks: number,
    uniqueBooks: number,
    revenue: number
}

export type Sale = {
    id: string,
    bookId: string,
    saleReconciliationId: string,
    quantity: number,
    price: number,
    subtotal: number
}
