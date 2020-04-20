import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { TextField, Card, CardContent, CardActions, Button, Typography, Switch } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from '@material-ui/icons/Add'
import { debounce } from 'lodash'

const useStyles = makeStyles({
  card: {
    margin: '1rem'
  },
  todoLine: {
    display: 'flex',
    alignItems: 'center'
  },
  textField: {
    flexGrow: 1
  },
  standardSpace: {
    margin: '8px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1
  }
})

export const ToDoListForm = ({ toDoList, saveToDoList }) => {
  const classes = useStyles()
  const [todos, setTodos] = useState(toDoList.todos)

  const handleSubmit = event => {
    event.preventDefault()
    saveToDoList(toDoList.id, { todos })
  }

  const updateTodoText = (newTodoText, index) => {
    const timeout = 300;
    let newTodo = {...todos[index]}
    newTodo.text = newTodoText;
    const newTodos = [
      ...todos.slice(0, index),
      newTodo,
      ...todos.slice(index + 1)
    ];
    setTodos(newTodos);
    return debounce(
      () => saveToDoList(toDoList.id, { todos: newTodos }), timeout
    )()
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography component='h2'>
          {toDoList.title}
        </Typography>
        <form onSubmit={handleSubmit} className={classes.form}>
          {todos.map((todo, index) => (
            <div key={index} className={classes.todoLine}>
              <Typography className={classes.standardSpace} variant='h6'>
                {index + 1}
              </Typography>
              <TextField
                label='What to do?'
                value={todo.text ? todo.text : ''}
                onChange={event => {
                  updateTodoText(event.target.value, index);
                }}
                className={classes.textField}
              />
              <Typography>Done?</Typography>
              <Switch
                value="checkedA"
                checked={todo.done ? true : false}
                color="primary"
                inputProps={{ 'aria-label': 'primary checkbox' }}
                onChange={() => {
                  let newTodo = {...todo};
                  newTodo.done = !todo.done;
                  const newTodos = [
                    ...todos.slice(0, index),
                    newTodo,
                    ...todos.slice(index + 1)
                  ];
                  setTodos(newTodos);
                  saveToDoList(toDoList.id, { todos: newTodos })
                }}
              />
              <Button
                size='small'
                color='secondary'
                className={classes.standardSpace}
                onClick={() => {
                  const newTodos = [ // immutable delete
                    ...todos.slice(0, index),
                    ...todos.slice(index + 1)
                  ]
                  setTodos(newTodos);
                  saveToDoList(toDoList.id, { todos: newTodos });
                }}
              >
                <DeleteIcon />
              </Button>
            </div>
          ))}
          <CardActions>
            <Button
              type='button'
              color='primary'
              onClick={() => {
                setTodos([...todos, ''])
              }}
            >
              Add Todo <AddIcon />
            </Button>
            <Button type='submit' variant='contained' color='primary'>
              Save
            </Button>
          </CardActions>
        </form>
      </CardContent>
    </Card>
  )
}
