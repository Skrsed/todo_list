import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap'
import IssueForm from '../issueForm/IssueForm'
import AuthContext from '../../context/AuthContext'
import useHttp from '../../hooks/http.hook'
import './CreateIssue.css'

const UpdateIssue = (props) => {
  const auth = useContext(AuthContext)
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'low',
    status: 'todo',
    responsible_id: auth.user.id
  })

  const { request } = useHttp()

  const createUser = async () => {
    try {
      await request('api/v1/todo', 'POST', { ...form }, {
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
        <Button variant="badge" onClick={ () => createUser() }>Создать</Button>
      </Modal.Footer>
    </Modal>
  ) 
}

export default UpdateIssue