import React, {useState, useContext} from 'react'
import {Modal, Button} from 'react-bootstrap'
import IssueForm from '../issueForm/IssueForm'
import AuthContext from '../../context/AuthContext'
import useHttp from '../../hooks/http.hook'
import './CreateIssue.css'

const UpdateIssue = (props) => {
  const auth = useContext(AuthContext)

  const initForm = {
    title: '',
    description: '',
    due_date: '',
    priority: 'low',
    status: 'todo',
    responsible_id: auth.user.id
  }

  const [form, setForm] = useState({...initForm})
  const [error, setError] = useState('')

  const onChangeHandle = (value) => {
    setForm(value)
  }

  const onHide = () => {
    setForm(initForm)
    setError('')
    props.handleClose()
  }

  const {request} = useHttp()

  const createUser = async () => {
    try {
      await request(
        'api/v1/todo',
        'POST',
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
      dialogClassName="create-issue-modal"
    >
      <Modal.Body className="modal-body-size">
        <IssueForm form={form} error={error} setForm={onChangeHandle} />
      </Modal.Body>
      <Modal.Footer>
        <div className="create-issue-modal__error">{error}</div>
        <Button variant="badge" onClick={() => createUser()}>
          Создать
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default UpdateIssue
