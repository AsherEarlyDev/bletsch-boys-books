export type PurchaseOrder = {
    id: string,
    date: string,
    vendorName: string,
    vendorId: string,
    purchases: any[],
    totalBooks: number,
    uniqueBooks: number,
    cost: number
}

export type Vendor = {
    id: string, 
    name: string
}
