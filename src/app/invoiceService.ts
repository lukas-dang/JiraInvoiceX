import { JiraService } from './jiraService'
import { type Month } from './common/types/months'
import { type InvoiceIssue, type InvoiceProject } from './common/types/results'
import { mapProjectNameToInvoiceCode } from './common/mappers'
import { formatDecimalNumberToCzech } from './common/utils'

export class InvoiceService {
  private readonly jiraService: JiraService

  constructor() {
    this.jiraService = new JiraService()
  }

  async getInvoiceData(month: Month) {
    const issues = await this.jiraService.getIssuesForCurrentUser(month)
    const projectSummaries = this.getProjectsInvoice(issues)

    const formattedIssues = this.formatIssues(issues)
    const formattedProjectSummaries = this.formatProjectSummaries(projectSummaries)

    return { issues: formattedIssues, projectSummaries: formattedProjectSummaries }
  }

  private formatIssues(issues: InvoiceIssue[]) {
    return issues.map((issue) => this.formatIssue(issue))
  }

  private formatProjectSummaries(summaries: ReturnType<typeof this.getProjectsInvoice>) {
    return summaries
  }

  private formatIssue(issue: InvoiceIssue) {
    return {
      ...issue,
      loggedHours: this.formatLoggedHours(issue.loggedHours),
      invoiceTitle: `${issue.project} - ${issue.summary} (Úkol ${issue.code})`,
      parentKey: issue.parentIssue?.key,
      parentSummary: issue.parentIssue?.summary,
      parentType: issue.parentIssue?.type
    }
  }

  private formatLoggedHours(loggedHours: number) {
    return formatDecimalNumberToCzech(loggedHours)
  }

  private getProjectsInvoice(issues: InvoiceIssue[]) {
    const issuesByProject = this.getIssuesByProject(issues)
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
    return issues
      .sort((a, b) => {
        if (a.type < b.type) {
          return 1
        } else if (a.type > b.type) {
          return -1
        } else {
          return 0
        }
      })
      .reduce<Record<string, InvoiceIssue[]>>((acc, item) => {
        if (acc[item.project] === undefined) {
          acc[item.project] = []
        }

        acc[item.project].push(item)

        return acc
      }, {})
  }
}
