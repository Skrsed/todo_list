import IssueItem from '../../components/issueItem/IssueItem'
import './IssuesGroupList.css'
const IssuesGropList = (props) => {
  const gropDateTranslation = (type) => {
    if (props.type === 'by_date') {
      return {
        today: 'Сегодня',
        week: 'Эта неделя',
        more_than_week: 'Больше недели'
      }[type]
    }

    return type
  }
  const createIssues = (items) => {
    if(!items) return null

    return props.items.map((item, i) => {
      if (!item.children) return (
        <IssueItem
          key={`issue_${item.id}`}
          issue={item}
          onClick={() => props.onClick(item)}
        />
      )

      return (
        <div className="issues-grop-list" key={`${item}_${i}`}>
          {item.groupTitle && <h3>{gropDateTranslation(item.groupTitle)}</h3>}
          <IssuesGropList items={item.children} onClick={props.onClick} />
        </div>
      )
    })
  }

  return <>{createIssues(props.items)}</>
}

export default IssuesGropList
