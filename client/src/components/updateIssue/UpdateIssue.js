import React, {useState, useContext, useEffect} from 'react'
import {Modal, Button} from 'react-bootstrap'
import IssueForm from '../issueForm/IssueForm'
import AuthContext from '../../context/AuthContext'
import useHttp from '../../hooks/http.hook'

import './UpdateIssue.css'

const UpdateIssue = (props) => {
  const auth = useContext(AuthContext)

  const [form, setForm] = useState({
    id: props.issue.id,
    title: props.issue.title,
    description: props.issue.description,
    due_date: props.issue.due_date,
    priority: props.issue.priority,
    status: props.issue.status,
    responsible_id: auth.user.id
  })

  useEffect(() => {
    setForm(props.issue)
  }, [props.issue])

  const {request} = useHttp()

  const updateUser = async () => {
    try {
      await request(
        'api/v1/todo',
        'PUT',
        {...form},
        {
          Authorization: `Bearer ${auth.token}`
        }
      )
      props.handleClose()
    } catch (e) {}
  }

  return (
    <Modal
      show={props.show}
      onHide={props.handleClose}
      dialogClassName="update-issue-modal"
    >
      <Modal.Body className="modal-body-size">
        <IssueForm form={form} setForm={setForm} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="badge" onClick={() => updateUser()}>
          Изменить
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default UpdateIssue
