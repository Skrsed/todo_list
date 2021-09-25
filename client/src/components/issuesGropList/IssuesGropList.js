import IssuesList from '../../components/issuesList/IssuesList'

const IssuesGropList = (props) => {
  const gropDateTranslation = (type) => {
    if (props.type === 'by_responsible') return type

    return {
      today: 'Сегодня',
      week: 'Эта неделя',
      more_than_week: 'Больше недели'
    }[type]
  }
  const createIssues = () => {
    if (!props.groups) return ''

    return props.groups.map((group, i) => {
      return (
        <div className="issues-grop-list" key={`${group}_${i}`}>
          <h3>{gropDateTranslation(group.title)}</h3>
          <IssuesList issues={group.items} onClick={props.onClick} />
        </div>
      )
    })
  }

  return <>{createIssues()}</>
}

export default IssuesGropList
