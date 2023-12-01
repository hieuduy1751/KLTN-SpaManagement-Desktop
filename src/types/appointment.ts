export type AppointmentType = {
  id?: string
  key?: string
  time: string
  status: string
  note: string
  idEmployee: string
  idProduct: string
  idCustomer: string
  reference?: {
    productId: string
    productName: string
    customerId: string
    customerName: string
    employeeId: string
    employeeName: string
  }
}