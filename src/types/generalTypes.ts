export type genericItem = {
    id: string,
    bookId: string,
    buybackOrderId?: string,
    purchaseOrderId?: string,
    saleRecId?: string,
    quantity: number,
    price?: number,
    buybackPrice?: number
    subtotal: number
  }