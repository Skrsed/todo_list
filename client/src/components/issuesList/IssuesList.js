import IssueItem from '../../components/issueItem/IssueItem'

const IssuesList = (props) => {
  const createIssues = () => {
    if (!props.issues) return ''
    return props.issues.map((issue) => {
      if (!issue.id) return ''
      return (
        <IssueItem
          key={`issue_${issue.id}`}
          issue={issue}
          onClick={() => props.onClick(issue)}
        />
      )
    })
  }

  return <div className="issues-list">{createIssues()}</div>
}

export default IssuesList
