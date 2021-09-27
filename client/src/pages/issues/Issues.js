import React, {useContext, useState, useEffect, useCallback} from 'react'
import UpdateIssue from '../../components/updateIssue/UpdateIssue'
import CreateIssue from '../../components/createIssue/CreateIssue'
import IssuesGropList from '../../components/issuesGropList/IssuesGropList'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faChevronDown} from '@fortawesome/free-solid-svg-icons'
import {DropdownButton, Dropdown, Button, Spinner} from 'react-bootstrap'
import useHttp from '../../hooks/http.hook'
import AuthContext from '../../context/AuthContext'
import './Issues.css'

const Issues = () => {
  const auth = useContext(AuthContext)
  const [showCreateIssue, setShowCreateIssue] = useState(false)
  const [showUpdateIssue, setShowUpdateIssue] = useState(false)
  const [toUpdateIssue, setToUpdateIssue] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: '',
    status: '',
    responsible_id: ''
  })
  const [issues, setIssues] = useState([])
  const [groptype, setGroptype] = useState('none')
  
  const {loading, request} = useHttp()

  const userLabel = [
    auth.user.surname,
    auth.user.firstname[0] + '.',
    auth.user.patronymic[0] + '.'
  ].join(' ')

  const handleGroupSelect = useCallback((e) => {
    setGroptype(e.target.name)
  }, [])

  const handleIssueClick = useCallback((issue) => {
    setToUpdateIssue(issue)
    setShowUpdateIssue(true)
  }, [])

  const handleCloseNewIssueModal = useCallback(() => {
    setShowCreateIssue(false)
  }, [])

  const handleNewIssueClick = useCallback(() => {
    setShowCreateIssue(true)
  }, [])

  const handleCloseUpdateIssueModal = useCallback(() => {
    setShowUpdateIssue(false)
  }, [])

  const handleCreateOrUpdate = () => {
    fetchData()
  }

  const fetchData = useCallback(async () => {
    let query = `api/v1/todo?group=${groptype}&userId=${auth.user.id}`
    const data = await request(query, 'GET', null, {
      Authorization: `Bearer ${auth.token}`
    })
    setIssues([...data])
  }, [
    request,
    auth.token,
    groptype,
    auth.user.id,
  ])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className="page issues-page">
      <header className="issues-header">
        <div className="user_block">
          <span className="user_block__short-name">{userLabel}</span>
          <FontAwesomeIcon icon={faChevronDown} />
        </div>
      </header>
      <main className="issues-container">
        <div className="issues-menu-wrapper">
          <Button variant="dark" onClick={handleNewIssueClick}>
            Новая задача
          </Button>
          <DropdownButton
            id="dropdown-basic-button"
            title="Группировать"
            variant="dark"
          >
            <Dropdown.Item name="none" onClick={handleGroupSelect}>
              Нет
            </Dropdown.Item>
            <Dropdown.Item name="by_date" onClick={handleGroupSelect}>
              По дате
            </Dropdown.Item>
            <Dropdown.Item name="by_responsible" onClick={handleGroupSelect}>
              По пользователям
            </Dropdown.Item>
          </DropdownButton>
        </div>
        {loading && <div className="spiner-wrapper"><Spinner animation="border" /></div>}
        {!loading &&
          <div className="groplist-wrapper">
            <IssuesGropList
              type={groptype}
              items={issues}
              onClick={handleIssueClick}
            />
          </div>
        }
      </main>
      <CreateIssue
        onHide={handleCloseNewIssueModal}
        show={showCreateIssue}
        handlers={{createOrUpdate: handleCreateOrUpdate}}
      />
      <UpdateIssue
        onHide={handleCloseUpdateIssueModal}
        show={showUpdateIssue}
        handlers={{createOrUpdate: handleCreateOrUpdate}}
        issue={toUpdateIssue}
      />
    </div>
  )
}

export default Issues
