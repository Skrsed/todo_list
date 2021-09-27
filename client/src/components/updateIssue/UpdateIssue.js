import React, {useState, useContext, useCallback, useEffect} from 'react'
import {Modal, Button} from 'react-bootstrap'
import IssueForm from '../issueForm/IssueForm'
import AuthContext from '../../context/AuthContext'
import useHttp from '../../hooks/http.hook'
import './UpdateIssue.css'

const UpdateIssue = (props) => {
  const auth = useContext(AuthContext)

  const {request, error, clearError} = useHttp()

  const [form, setForm] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: '',
    status: '',
    responsible_id: ''
  })

  const onChangeHandle = useCallback((value) => {
    setForm(value)
  }, [])

  const onHide = useCallback(() => {
    clearError()
    props.onHide()
    setForm({...props.issue})
  }, [props, clearError])

  useEffect(() => {
    setForm({...props.issue})
  }, [props.issue, auth.user.id])

  const updateIssue = useCallback(async () => {
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
      props.handlers.createOrUpdate()
    } catch (e) { }
  }, [auth.token, form, onHide, props.handlers, request])

  return (
    <Modal
      show={props.show}
      onHide={onHide}
      dialogClassName="update-issue-modal"
    >
      <Modal.Body className="modal-body-size">
        <IssueForm form={form} onChange={onChangeHandle} />
      </Modal.Body>
      <Modal.Footer>
        <div className="update-issue-modal__error">{error}</div>
        <Button variant="badge" onClick={() => updateIssue()}>
          Изменить
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default UpdateIssue
