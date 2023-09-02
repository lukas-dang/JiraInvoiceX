import { InvoiceService } from './app/invoiceService'

const invoiceService = new InvoiceService()

invoiceService
  .getInvoiceData('Srpen')
  .then((data) => {
    console.info(data)

    data.issues.forEach((issue) => {
      if (
        issue.type === 'Task' &&
        issue.parentType &&
        issue.parentSummary?.startsWith('Redesign')
      ) {
        console.info(`Task issue: ${issue.code} ${issue.summary}`)
        console.info(`${issue.parentType} issue: ${issue?.parentKey}\n`)
      }
    })
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
