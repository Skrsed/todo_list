import React, {useState, useContext, useEffect} from 'react'
import {Modal, Button} from 'react-bootstrap'
import IssueForm from '../issueForm/IssueForm'
import AuthContext from '../../context/AuthContext'
import useHttp from '../../hooks/http.hook'

import './UpdateIssue.css'

const UpdateIssue = (props) => {
  const auth = useContext(AuthContext)

  const [form, setForm] = useState({
    id: '',
    title: '',
    description: '',
    due_date: '',
    priority: '',
    status: '',
    responsible_id: ''
  })
  const [error, setError] = useState('')

  useEffect(() => {
    setForm({...props.issue, responsible_id: auth.user.id})
  }, [props.issue, auth.user.id])

  const onHide = () => {
    setError('')
    props.handleClose()
  }

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
      onHide()
    } catch (e) {
      setError(e.message || 'Неизвестная ошибка')
    }
  }

  return (
    <Modal
      show={props.show}
      onHide={onHide}
      dialogClassName="update-issue-modal"
    >
      <Modal.Body className="modal-body-size">
        <IssueForm form={form} setForm={setForm} />
      </Modal.Body>
      <Modal.Footer>
        <div className="update-issue-modal__error">{error}</div>
        <Button variant="badge" onClick={() => updateUser()}>
          Изменить
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default UpdateIssue
