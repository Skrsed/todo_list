import React, { useState, useEffect, useContext } from 'react';
import { Form, Modal, FloatingLabel, Button } from 'react-bootstrap'
import useHttp from '../../hooks/http.hook'
import './CreateIssue.css'
import AuthContext from '../../context/AuthContext'

const CreateIssue = (props) => {
  
  const { request } = useHttp()
  const auth = useContext(AuthContext)

  const [form, setForm] = useState({
    priority: 'low',
    status: 'todo',
    responsible_id: auth.user.id
  })

  const [leadedUsers, setLeadedUsers] = useState([])

  const createUserLabel = (user) => {
    const fname = user.firstName ? user.firstName : user.firstname 
    return [
      user.surname,
      fname + '.',
      user.patronymic[0] + '.'
    ].join(' ')
  }
  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }
  const createUserSelect = () => {
    if (leadedUsers.length === 0 || !auth.user) return ''

    const res = leadedUsers.map(e => {
       return <option value={e.id}>{ createUserLabel(e) }</option>
    })
    res.push(<option value={auth.user.id}>{ createUserLabel(auth.user) }</option>)

    return res
  }

  const createUser = async () => {
    try {
      const data = await request('api/v1/todo', 'POST', { ...form }, {
        Authorization: `Bearer ${auth.token}`
      })
      props.handleClose()
    } catch (e) {}
  }

  useEffect(() => {
    async function fetchData() {
      let query = `api/v1/user/leaded`
      const data = await request(query, 'GET', null, {
        Authorization: `Bearer ${auth.token}`
      })
      setLeadedUsers(data)
    }

    fetchData()
  }, [request, auth.token ])


  return(
    <Modal 
      show= { props.show } 
      onHide= { props.handleClose }
      dialogClassName= "create-issue-modal"
    >
      <Modal.Body className="modal-body-size">
        <Form.Group >
          <FloatingLabel
            controlId="floatingInput"
            label="Заголовок"
            className="mb-3"
          >
            <Form.Control
              type="text"
              name="title"
              placeholder="surname"
              value={ form.surname }
              onChange={ changeHandler }
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingInput"
            label="Описание"
            className="mb-3"
          >
            <Form.Control
              as="textarea"
              name="description"
              rows={3} 
              placeholder="name"
              value={ form.description }
              onChange={ changeHandler }
            />
          </FloatingLabel>
          <FloatingLabel
              controlId="floatingInput"
              label="Дата окончания"
              className="mb-3"
          >
            <Form.Control
              type="date"
              name="due_date"
              placeholder="patronymic"
              value={ form.due_date }
              onChange={ changeHandler }
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingInput"
            label="Приоритет"
            className="mb-3"
          >
            <Form.Select
              aria-label="priority"
              name="priority"
              value={ form.priority }
              onChange={ changeHandler }
            >
              <option value="high">Высокий</option>
              <option value="middle">Средний</option>
              <option value="low">Низкий</option>
            </Form.Select>
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingInput"
            label="Статус"
            className="mb-3"
          >
            <Form.Select
            aria-label="status"
            name="status"
            value={ form.status }
            onChange={ changeHandler }
            >
              <option value="todo">К выполнению</option>
              <option value="doing">Выполняется</option>
              <option value="done">Выполнена</option>
              <option value="cancel">Отменена</option>
            </Form.Select>
          </FloatingLabel> 
          <FloatingLabel
            controlId="floatingInput"
            label="Ответственный"
            className="mb-3"
          >
            <Form.Select
              aria-label="responsible"
              name="responsible_id"
              value={ form.responsible_id }
              onChange={ changeHandler }
            >
              { createUserSelect() }
            </Form.Select>
          </FloatingLabel>   
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="badge" onClick={ () => createUser() }>Создать</Button>
      </Modal.Footer>
    </Modal>
  ) 
}

export default CreateIssue