export type genericItem = {
    id: string,
    bookId: string,
    buybackOrderId?: string,
    purchaseOrderId?: string,
    quantity: number,
    price?: number,
    buybackPrice?: number
    subtotal: number
  }