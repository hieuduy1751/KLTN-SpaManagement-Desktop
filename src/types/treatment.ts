import { CustomerType } from "./customer"
import { InvoiceType } from "./invoice"
import { ProductType } from "./product"
import { StaffType } from "./staff"

export type TreatmentType = {
  id?: string
  key?: string
  idCustomer: string
  idProduct: string
  idEmployee: string
  note?: string
  imageBefore?: string
  imageCurrent?: string
  imageResult?: string
  customerResponse?: CustomerType
  productResponse?: ProductType
  employeeResponse?: StaffType
  invoiceResponse?: InvoiceType
  status?: string
}