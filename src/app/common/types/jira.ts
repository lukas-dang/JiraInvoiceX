interface IssueType {
  id: string
  name: string
}

interface Issue {
  id: string
  key: string
  fields: {
    summary: string
    issuetype: IssueType
    project: {
      key: string
    }
    parent?: {
      key: string
      fields: {
        summary: string
        issuetype: IssueType
      }
    }
  }
}

interface Author {
  accountId: string
}

export interface JiraConfig {
  protocol: string
  host: string
  username: string
  password: string
  apiVersion: string
  strictSSL: boolean
}

export interface User {
  accountId: string
}

export interface JiraResponse {
  issues: Issue[]
}

export interface WorkLog {
  id: string
  timeSpentSeconds: number
  started: number
  author: Author
}

export interface ProcessIssueParams {
  issue: Issue
  accountId: string
  startDate: string
  endDate: string
}
