import React, { useState, useContext, useEffect } from 'react'
import { Form, FloatingLabel } from 'react-bootstrap'
import useHttp from '../../hooks/http.hook'
import AuthContext from '../../context/AuthContext'
import moment from 'moment'

const IssueForm = (props) => {
  const auth = useContext(AuthContext)

  const [leadedUsers, setLeadedUsers] = useState([])

  const { request } = useHttp()

  useEffect(() => {
    async function fetchData() {
      const data = await request('api/v1/user/leaded', 'GET', null, {
        Authorization: `Bearer ${ auth.token }`
      })
      setLeadedUsers(data)
    }
    fetchData()
  }, [request, auth.token])

  const changeHandler = event => {
    props.setForm({ ...props.form, [event.target.name]: event.target.value })
  }

  const createUserLabel = (user) => {
    const fname = user.firstName ? user.firstName : user.firstname 
    return [
      user.surname,
      fname + '.',
      user.patronymic[0] + '.'
    ].join(' ')
  }

  const formatDate = (date) => {
    const formatted = moment(date).format('YYYY-MM-DD')
    console.log('fdate', formatted)
    return formatted
  }

  const createUserSelect = () => {
    if (leadedUsers.length === 0 || !auth.user) return ''

    const res = leadedUsers.map(item => {
      return <option value={item.id} key={`resp_${item.id}`}>{ createUserLabel(item) }</option>
    })
    res.push(<option value={auth.user.id} key={`resp_${auth.user.id}`}>{ createUserLabel(auth.user) }</option>)
    return res
  }

  return (
    <Form.Group >
      <FloatingLabel
        controlId="floatingInput"
        label="Заголовок"
        className="mb-3"
      >
        <Form.Control
          type="text"
          name="title"
          placeholder="title"
          value={ props.form.title }
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
          value={ props.form.description }
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
          placeholder="due_date"
          value={ formatDate(props.form.due_date) }
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
          placeholder="priority"
          value={ props.form.priority }
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
          placeholder="status"
          value={ props.form.status }
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
          placeholder="responsible"
          value={ props.form.responsible_id }
          onChange={ changeHandler }
        >
          { createUserSelect() }
        </Form.Select>
      </FloatingLabel>   
    </Form.Group>
  )
}

export default IssueForm