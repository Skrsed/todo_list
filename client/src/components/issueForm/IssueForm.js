import React, {useState, useContext, useEffect, useCallback} from 'react'
import {Form, FloatingLabel} from 'react-bootstrap'
import useHttp from '../../hooks/http.hook'
import AuthContext from '../../context/AuthContext'
import moment from 'moment'

const IssueForm = (props) => {
  const auth = useContext(AuthContext)

  const [leadedUsers, setLeadedUsers] = useState([])

  const {request} = useHttp()
  
  const fetchLeadedUsers = useCallback(async () => {
    try {
      const data = await request('api/v1/user/leaded', 'GET', null, {
        Authorization: `Bearer ${auth.token}`
      })
      const rUser = await request(`api/v1/user/${props.form.responsible_id}`, 'GET', null, {
        Authorization: `Bearer ${auth.token}`
      })
      const findResponsible = data.find(e => e.id === rUser.id)
      if (!findResponsible) {
        data.push(rUser)
      }
      const findedAuthUser = data.find(e => e.id === auth.user.id)
      if (!findedAuthUser) {
        data.push(auth.user)
      }

      setLeadedUsers(data)
    } catch (e) {}
  }, [auth.token, request, props.form, auth.user])

  useEffect(() => {
    fetchLeadedUsers()
  }, [fetchLeadedUsers])

  const changeHandler = (event) => {
    props.onChange({...props.form, [event.target.name]: event.target.value})
  }

  const createUserLabel = (user) => {
    const fname = user.firstName ? user.firstName : user.firstname
    return [user.surname, fname + '.', user.patronymic[0] + '.'].join(' ')
  }

  const formatDate = (date) => {
    return moment(date).format('YYYY-MM-DD')
  }

  const createUserSelect = () => {
    let res = leadedUsers.map((item) => {
      return (
        <option value={item.id} key={`resp_${item.id}`}>
          {createUserLabel(item)}
        </option>
      )
    })

    return res
  }

  return (
    <Form.Group>
      <FloatingLabel
        controlId="floatingInput"
        label="Заголовок"
        className="mb-3"
      >
        <Form.Control
          type="text"
          name="title"
          placeholder="title"
          value={props.form.title || ''}
          onChange={changeHandler}
        />
      </FloatingLabel>
      <FloatingLabel
        controlId="floatingInput"
        label="Описание"
        className="mb-3"
      >
        <Form.Control
          as="textarea"
          style={{ height: '100px' }}
          name="description"
          placeholder="description"
          value={props.form.description || ''}
          onChange={changeHandler}
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
          value={formatDate(props.form.due_date) || ''}
          onChange={changeHandler}
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
          value={props.form.priority || ''}
          onChange={changeHandler}
        >
          <option value="high">Высокий</option>
          <option value="middle">Средний</option>
          <option value="low">Низкий</option>
        </Form.Select>
      </FloatingLabel>
      <FloatingLabel controlId="floatingInput" label="Статус" className="mb-3">
        <Form.Select
          aria-label="status"
          name="status"
          placeholder="status"
          value={props.form.status || ''}
          onChange={changeHandler}
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
          value={props.form.responsible_id || ''}
          onChange={changeHandler}
        >
          {createUserSelect()}
        </Form.Select>
      </FloatingLabel>
    </Form.Group>
  )
}

export default IssueForm
