import './IssueItem.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUserTag, faStar} from '@fortawesome/free-solid-svg-icons'
import {faCalendarTimes} from '@fortawesome/free-regular-svg-icons'
import React, {useState, useEffect, useCallback} from 'react'
import moment from 'moment'
import 'moment-timezone'

const IssueItem = (props) => {
  // TODO также инициализировать всё остальное
  const getItitialColor = useCallback(() => {
    if (
      (props.issue.status === 'todo' || props.issue.status === 'doing') &&
      moment(props.issue.due_date).endOf('day').isBefore(moment().utc())
    ) {
      return 'title_red'
    }
    if (props.issue.status === 'done') {
      return 'title_green'
    }
    return ''
  }, [props.issue.due_date, props.issue.status])

  const [color, setColor] = useState(getItitialColor)

  useEffect(() => {
    setColor(getItitialColor())
  }, [getItitialColor])

  const shortName = () => {
    if (!props.issue.User) return ''

    return [
      props.issue.User.surname,
      props.issue.User.firstName[0] + '.',
      props.issue.User.patronymic[0] + '.'
    ].join(' ')
  }

  const priority = {
    low: 'Низкий',
    middle: 'Средний',
    high: 'Высокий'
  }[props.issue.priority]

  const status = {
    todo: 'К выполнению',
    doing: 'Выпоняется',
    done: 'Выполнена',
    cancel: 'Отменена'
  }[props.issue.status]

  return (
    <div className="issue">
      <div className="issue_bead"></div>
      <div className="issue__content">
        <div className="issue__info-block">
          <div className="issue__title">
            <div
              className={`issue__link-button ${color}`}
              onClick={() => props.onClick(props.issue.id)}
            >
              {props.issue.title}
            </div>
          </div>
          <div className="issue__bottom-container bottom-container">
            <div className="issue__status">
              <div className="issue__badge">{status}</div>
            </div>
            <div className="issue__assignation bottom-container__item">
              <FontAwesomeIcon icon={faUserTag} />
              <span>{shortName()}</span>
            </div>
            <div className="issue__due-date bottom-container__item">
              <FontAwesomeIcon icon={faCalendarTimes} />
              <span>{moment(props.issue.due_date).format('DD.MM.YYYY')}</span>
            </div>
            <div className="issue__priority bottom-container__item">
              <FontAwesomeIcon icon={faStar} />
              <span>{priority}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IssueItem
