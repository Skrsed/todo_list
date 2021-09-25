import React, {useContext, useState, useEffect, useCallback} from 'react'
import UpdateIssue from '../../components/updateIssue/UpdateIssue'
import CreateIssue from '../../components/createIssue/CreateIssue'
import IssuesList from '../../components/issuesList/IssuesList'
import IssuesGropList from '../../components/issuesGropList/IssuesGropList'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faChevronDown} from '@fortawesome/free-solid-svg-icons'
import {DropdownButton, Dropdown, Button} from 'react-bootstrap'
import useHttp from '../../hooks/http.hook'
import AuthContext from '../../context/AuthContext'
import moment from 'moment'
import './Issues.css'

const Issues = () => {
  const auth = useContext(AuthContext)
  const [showCreateIssue, setShowCreateIssue] = useState(false)
  const [showUpdateIssue, setShowUpdateIssue] = useState(false)
  const [toUpdateIssue, setToUpdateIssue] = useState({})
  const [issues, setIssues] = useState([])
  const [groptype, setGroptype] = useState('none')
  const {request} = useHttp()

  const createUserLabel = [
    auth.user.surname,
    auth.user.firstname[0] + '.',
    auth.user.patronymic[0] + '.'
  ].join(' ')

  const handleMenuClick = (e) => {
    setGroptype(e.target.name)
  }

  const handleIssueClick = (issue) => {
    setToUpdateIssue(issue)
    setShowUpdateIssue(true)
  }

  const getListIssues = () => {
    if (groptype === 'none') {
      return <IssuesList issues={issues} onClick={handleIssueClick} />
    }
    return (
      <IssuesGropList
        type={groptype}
        groups={issues}
        onClick={handleIssueClick}
      />
    )
  }

  useEffect(() => {
    async function fetchData() {
      const startOfDay = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')
      let query = `api/v1/todo?group=${groptype}&userId=${auth.user.id}&now=${startOfDay}`
      const data = await request(query, 'GET', null, {
        Authorization: `Bearer ${auth.token}`
      })

      setIssues([...data])
    }

    fetchData()
  }, [
    request,
    auth.token,
    groptype,
    auth.user.id,
    showCreateIssue,
    showUpdateIssue
  ])

  return (
    <div className="page issues-page">
      <header className="issues-header">
        <div className="user_block">
          <span className="user_block__short-name">{createUserLabel}</span>
          <FontAwesomeIcon icon={faChevronDown} />
        </div>
      </header>
      <main className="issues-container">
        <div className="issues-menu-wrapper">
          <Button variant="dark" onClick={() => setShowCreateIssue(true)}>
            Новая задача
          </Button>
          <DropdownButton
            id="dropdown-basic-button"
            title="Группировать"
            variant="dark"
          >
            <Dropdown.Item name="none" onClick={handleMenuClick}>
              Нет
            </Dropdown.Item>
            <Dropdown.Item name="by_date" onClick={handleMenuClick}>
              По дате
            </Dropdown.Item>
            <Dropdown.Item name="by_responsible" onClick={handleMenuClick}>
              По пользователям
            </Dropdown.Item>
          </DropdownButton>
        </div>
        {getListIssues()}
      </main>
      <CreateIssue
        handleClose={() => setShowCreateIssue(false)}
        show={showCreateIssue}
      />
      <UpdateIssue
        handleClose={() => setShowUpdateIssue(false)}
        issue={toUpdateIssue}
        show={showUpdateIssue}
      />
    </div>
  )
}

export default Issues
