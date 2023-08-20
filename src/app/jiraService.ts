import { getEndOfMonth, getStartOfMonth } from './common/utils'
import JiraApi from 'jira-client'
import { type Month } from './common/types/months'
import {
  type JiraConfig,
  type JiraResponse,
  type ProcessIssueParams,
  type User,
  type WorkLog
} from './common/types/jira'
import { SECONDS_PER_HOURS } from './common/constants'
import { type InvoiceIssue } from './common/types/results'
import config from 'config'

export class JiraService {
  private readonly jira: JiraApi

  constructor() {
    const jiraConfig = config.get<JiraConfig>('jira')

    this.jira = new JiraApi(jiraConfig)
  }

  async getInvoiceIssues(month: Month, user: User) {
    const startDate = getStartOfMonth(month)
    const endDate = getEndOfMonth(month)
    const jql = `worklogAuthor = currentUser() AND worklogDate >= "${startDate}" AND worklogDate < "${endDate}"`

    try {
      const response = (await this.jira.searchJira(jql)) as JiraResponse

      return await Promise.all(
        response.issues.map((issue) =>
          this.processIssue({
            issue,
            accountId: user.accountId,
            startDate,
            endDate
          })
        )
      )

      // return invoiceDatas.reduce((sum, time) => sum + time, 0)
    } catch (err) {
      console.error(err)
    }
  }

  async processIssue({
    issue,
    accountId,
    startDate,
    endDate
  }: ProcessIssueParams): Promise<InvoiceIssue> {
    const response = await this.jira.getIssueWorklogs(issue.key)
    const workLogs = response.worklogs as WorkLog[]

    const filteredWorkLogs = workLogs.filter((workLog) => {
      const logDate = new Date(workLog.started)

      return (
        workLog.author.accountId === accountId &&
        logDate >= new Date(startDate) &&
        logDate < new Date(endDate)
      )
    })

    const loggedSeconds = filteredWorkLogs.reduce(
      (sum, workLog) => sum + workLog.timeSpentSeconds,
      0
    )

    const host = config.get<string>('jira.host')

    return {
      id: issue.id,
      code: issue.key,
      summary: issue.fields.summary,
      loggedHours: loggedSeconds / SECONDS_PER_HOURS,
      type: issue.fields.issuetype.name,
      url: `${host}/browse/${issue.key}`,
      project: issue.fields.project.key
    }
  }

  async getIssuesForCurrentUser(month: Month) {
    const user = await this.getDefaultUser()
    return await this.getInvoiceIssues(month, user)
  }

  async getDefaultUser(): Promise<User> {
    return (await this.jira.getCurrentUser()) as User
  }
}
