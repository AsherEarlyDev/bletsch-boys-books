
export type topSellers = {
    numBooks: number,
    revenue: number,
    recentCost: number,
    profit: number
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
    sales: any[],
    totalBooks: number,
    uniqueBooks: number,
    revenue: number
}

export type Sale = {
    id: string,
    bookId: string,
    saleReconciliationId: string,
    quantity: number,
    price: number
}
