import { ProductType } from "./product"

export type InvoiceDetail = {
  productResponse: ProductType
  totalPrice: number
  totalQuantity: number
  idProduct: number
}

export type InvoiceType = {
  invoiceDetailResponses: InvoiceDetail[]
  employeeId: string
  customerId: string
  treatmentId: string
  totalAmount?:number
  paymentMethod: string
  note: string
  dueDate: string
  key?: string
  id?: string
  status?: string
  createdDate?: string
  updatedDate?: string
}