import React, { useState, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap'
import IssueForm from '../issueForm/IssueForm'
import AuthContext from '../../context/AuthContext'
import useHttp from '../../hooks/http.hook'
import './UpdateIssue.css'

const UpdateIssue = (props) => {
  const auth = useContext(AuthContext)
  
  const [form, setForm] = useState({
    id: props.id,
    title: props.title,
    description: props.description,
    due_date: props.due_date,
    priority: props.priority,
    status: props.status,
    responsible_id: auth.user.id
  })

  const { request } = useHttp()

  const updateUser = async () => {
    try {
      await request('api/v1/todo', 'PUT', { ...form }, {
        Authorization: `Bearer ${auth.token}`
      })
      props.handleClose()
    } catch (e) {}
  }

  return (
    <Modal 
      show={ props.show } 
      onHide={ props.handleClose }
      dialogClassName= "create-issue-modal"
    >
      <Modal.Body className="modal-body-size">
        <IssueForm form={ form } setForm={ setForm } />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="badge" onClick={ () => updateUser() }>Создать</Button>
      </Modal.Footer>
    </Modal>
  ) 
}

export default UpdateIssue