
export type Vendor = {
    name: string,
    purchaseOrders: PurchaseOrder[],
}

export type Purchase = {

}

export type PurchaseOrder = {
    date: Date,
    vendorId: string,
    purchases: Purchase[],
    vendor: Vendor
}

