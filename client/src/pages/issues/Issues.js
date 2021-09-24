import React, { useContext, useState, useEffect } from 'react';
import './Issues.css'
import IssueItem from '../../components/issueItem/IssueItem'
import UpdateIssue from '../../components/updateIssue/UpdateIssue';
import CreateIssue from '../../components/createIssue/CreateIssue'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { DropdownButton, Dropdown, Button } from 'react-bootstrap';
import useHttp from '../../hooks/http.hook'
import AuthContext from '../../context/AuthContext'

const Issues = () => {
  const auth = useContext(AuthContext)
  console.log('isssues start', auth)
  const [showCreateIssue, setShowCreateIssue] = useState(false)
  const [showUpdateIssue, setShowUpdateIssue] = useState(false)
  const [issues, setIssues] = useState(false)
  const [groptype, setGroptype] = useState('')
  const { request } = useHttp()

  const createUserLabel = [
    auth.user.surname,
    auth.user.firstname[0] + '.',
    auth.user.patronymic[0] + '.'
  ].join(' ')
  
  const gropDateTranslation = (type) => {
    return {
      today: 'Сегодня',
      week: 'Эта неделя',
      more_than_week: 'Больше недели',
    }[type]
  }
  const handleMenuClick = (e) => {
    setGroptype(e.target.name)
  }
  const createGropDelemiter = (item) => {
    if (groptype === 'by_date') {
      return <h3>{ gropDateTranslation(item.group) }</h3>
    }

    return <h3>{ item.group }</h3>
  }
  const generateIssuesList = () => {
    if (!issues || !issues.data) return ''

    if (issues.collection_type === 'ungrouped' && issues.data) {
      return issues.data.map(item => {
          return <IssueItem
            key={ `issue_${ item.id }` }
            issue={ item }
            onClick={ () => setShowUpdateIssue(true) } />
      })
    }
    if (issues.collection_type === 'grouped' && issues.data) {
      let prev = null
      let elements = []
      issues.data.forEach(issue =>{

        if (!prev || issue.group !== prev.group) {
          elements.push(createGropDelemiter(issue))
        }
        elements.push(
          <IssueItem
            issue={ issue }
            onClick={ () => setShowUpdateIssue(true) }
            key={ `issue_${ issue.id }` }
          />
        )
        prev = issue
      })
      //console.log(elements)
      return elements
    } 
  }

  useEffect(() => {
    async function fetchData() {
      let query = `api/v1/todo?group=${ groptype }&userId=${auth.user.id}`
      const data = await request(query, 'GET', null, {
        Authorization: `Bearer ${auth.token}`
      })

      setIssues(data);
    }

    fetchData()
  }, [request, auth.token, groptype, auth.user.id])

  return (
    <div className="page issues-page" style={{ "backgroud-color": "#f2f2f2" }}>
      
      <header className="issues-header">
        <div className="user_block">
          <span className="user_block__short-name">{ createUserLabel }</span>
          <FontAwesomeIcon icon={ faChevronDown } />
        </div>
      </header>
      <main className="issues-container">
        <div className="issues-menu-wrapper">
          <Button variant="dark" onClick={ () => setShowCreateIssue(true) }>Новая задача</Button>
          <DropdownButton id="dropdown-basic-button" title="Группировать" variant="dark">
            <Dropdown.Item name="none" onClick={ handleMenuClick }>Нет</Dropdown.Item>
            <Dropdown.Item name="by_date" onClick={ handleMenuClick }>По дате</Dropdown.Item>
            <Dropdown.Item name="by_responsible" onClick={ handleMenuClick }>По пользователям</Dropdown.Item>
          </DropdownButton>
        </div>
        <div className="issues-list">
          {
            generateIssuesList()
          }
        </div>
      </main>
      <CreateIssue 
        handleClose={ () => setShowCreateIssue(false) } 
        show={ showCreateIssue } 
      />
      <UpdateIssue 
        handleClose={ () => setShowUpdateIssue(false) } 
        show={ showUpdateIssue } 
      />
    </div>
  )
}

export default Issues