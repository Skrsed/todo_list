import React, {useState, useContext, useCallback} from 'react'
import {Modal, Button} from 'react-bootstrap'
import IssueForm from '../issueForm/IssueForm'
import AuthContext from '../../context/AuthContext'
import useHttp from '../../hooks/http.hook'
import './CreateIssue.css'

const UpdateIssue = (props) => {
  const auth = useContext(AuthContext)

  const {request, error, clearError} = useHttp()

  const [form, setForm] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'low',
    status: 'todo',
    responsible_id: auth.user.id
  })

  const onChangeHandle = useCallback((value) => {
    setForm(value)
  }, [])

  const onHide = useCallback(() => {
    clearError()
    props.onHide()
  }, [props, clearError])

  const createIssue = useCallback(async () => {
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
      props.handlers.createOrUpdate()
    } catch (e) { }

  }, [auth.token, form, onHide, props.handlers, request])

  return (
    <Modal
      show={props.show}
      onHide={onHide}
      dialogClassName="create-issue-modal"
    >
      <Modal.Body className="">
        <IssueForm form={form} error={error} onChange={onChangeHandle} />
      </Modal.Body>
      <Modal.Footer>
        <div className="create-issue-modal__error">{error}</div>
        <Button variant="badge" onClick={() => createIssue()}>
          Создать
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default UpdateIssue
