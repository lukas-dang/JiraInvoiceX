import { JiraService } from './jiraService'
import { type Month } from './common/types/months'
import { type InvoiceIssue, type InvoiceProject } from './common/types/results'
import { mapProjectNameToInvoiceCode } from './common/mappers'

export class InvoiceService {
  private readonly jiraService: JiraService

  constructor() {
    this.jiraService = new JiraService()
  }

  async getInvoiceData(month: Month) {
    const issuesInvoice = await this.jiraService.getIssuesForCurrentUser(month)

    if (issuesInvoice == null) {
      return
    }

    const issuesWithoutBugs = this.filterIssues(issuesInvoice)

    const issuesByProject = this.getIssuesByProject(issuesWithoutBugs)
    const projectsInvoice = this.getProjectsInvoice(issuesByProject)

    return { issuesInvoice, projectsInvoice }
  }

  private filterIssues(invoiceIssues: Array<Awaited<InvoiceIssue>>) {
    return invoiceIssues.filter((issue) => issue.type !== 'Bug')
  }

  private getProjectsInvoice(issuesByProject: Record<string, InvoiceIssue[]>) {
    const projectsInvoiceSummary: Record<string, InvoiceProject> = {}

    for (const [projectName, issues] of Object.entries(issuesByProject)) {
      projectsInvoiceSummary[projectName] = {
        title: projectName,
        loggedHours: issues.reduce((sum, issue) => sum + issue.loggedHours, 0),
        invoiceCode: mapProjectNameToInvoiceCode(projectName)
      }
    }
    return projectsInvoiceSummary
  }

  private getIssuesByProject(issues: InvoiceIssue[]) {
    return issues.reduce<Record<string, InvoiceIssue[]>>((acc, item) => {
      if (acc[item.project] === undefined) {
        acc[item.project] = []
      }

      acc[item.project].push(item)

      return acc
    }, {})
  }
}
