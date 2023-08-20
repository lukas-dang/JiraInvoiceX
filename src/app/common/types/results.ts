export interface InvoiceIssue {
  id: string
  code: string
  summary: string
  loggedHours: number
  type: string
  url: string
  project: string
}

export interface InvoiceProject {
  title: string
  loggedHours: number
  invoiceCode: string
}

export interface InvoiceData {
  issues: InvoiceIssue[]
  projects: Record<string, InvoiceProject>
}
