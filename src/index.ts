import { InvoiceService } from './app/invoiceService'
import * as XLSX from 'xlsx'

const invoiceService = new InvoiceService()

invoiceService
  .getInvoiceData('Srpen')
  .then((data) => {
    console.info(data)
  })
  // .then((invoiceData) => {
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new()
  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([
  //     { A: '1', B: '2' },
  //     { A: '3', B: '4' }
  //   ])
  //
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  //   XLSX.writeFile(wb, 'output.xlsx')
  // })
  .catch((err) => {
    console.error(err)
  })
