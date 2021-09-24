import './IssueItem.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserTag, faStar } from '@fortawesome/free-solid-svg-icons'
import { faCalendarTimes } from '@fortawesome/free-regular-svg-icons'
import React, { useState } from 'react';
import moment from 'moment'

const IssueItem = (props) => {
  // TODO: use state
  const shortName  = [
      props.issue.User.surname,
      props.issue.User.firstName[0] + '.',
      props.issue.User.patronymic[0] + '.'
  ].join(' ')

  const testObject = {
    test: ''
  }

  const priority = {
    low: 'Низкий',
    middle: 'Средний',
    high: 'Высокий'
  }[testObject.test2]

  const status = {
    todo: 'К выполнению',
    doing: 'Выпоняется',
    done: 'Закончена',
    cancel: 'Отменена'
  }[props.issue.status]

  let color = '' // ?!?
  if ((status === 'todo' || status === 'doing') &&
    moment(props.issue.due_date).isBefore(moment.tz(new Date(), "GMT"))) {
    color = 'title_red'
  }
  if (props.issue.status === 'done') {
    color = 'title_green'
  }
  
  return (
    <div className="issue">
      <div className="issue_bead"></div>
      <div className="issue__content">
        <div className="issue__info-block">
          <div className="issue__title">
           
            <div className="issue__link-button" style={{ "color": color }}>{ props.issue.title }</div>
          </div>
          <div className="issue__bottom-container bottom-container">
            <div className="issue__status">
              <div className="issue__badge">{ status }</div>
            </div>
            <div className="issue__assignation bottom-container__item">
              <FontAwesomeIcon icon={ faUserTag } />
              <span>{ shortName }</span>
            </div>
            <div className="issue__due-date bottom-container__item">
              <FontAwesomeIcon icon={ faCalendarTimes } />
              <span>{ moment(props.issue.due_date).format('DD.MM.YYYY') }</span>
            </div>
            <div className="issue__priority bottom-container__item">
              <FontAwesomeIcon icon={ faStar } />
              <span>{ priority }</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IssueItem;