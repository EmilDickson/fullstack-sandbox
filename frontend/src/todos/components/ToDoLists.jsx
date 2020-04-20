import React, { Fragment, useState, useEffect } from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ReceiptIcon from '@material-ui/icons/Receipt'
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Typography from '@material-ui/core/Typography'
import { ToDoListForm } from './ToDoListForm'

export const ToDoLists = ({ style }) => {
  const [toDoLists, setToDoLists] = useState({})
  const [activeList, setActiveList] = useState()

  useEffect(() => {
    fetch(
      'http://localhost:3001/allTodos'
    ).then((response) => {
      return response.json();
    }).then(data => { 
      setToDoLists(data)
    });
  }, [])

  const listDone = (todoList) => {
    for (let i = 0; i < todoList.todos.length; i++) {
      if (!todoList.todos[i].done) {
        return false
      }
    }
    return true
  }

  if (!Object.keys(toDoLists).length) return null
  return <Fragment>
    <Card style={style}>
      <CardContent>
        <Typography
          component='h2'
        >
          My ToDo Lists
        </Typography>
        <List>
          {Object.keys(toDoLists).map((key) => <ListItem
            key={key}
            button
            onClick={() => setActiveList(key)}
          >
            <ListItemIcon>
              {listDone(toDoLists[key]) ? <CheckCircleIcon style={{ color: 'green' }} /> : <ReceiptIcon />}
            </ListItemIcon>
            <ListItemText primary={toDoLists[key].title} />
          </ListItem>)}
        </List>
      </CardContent>
    </Card>
    {toDoLists[activeList] && <ToDoListForm
      key={activeList} // use key to make React recreate component to reset internal state
      toDoList={toDoLists[activeList]}
      saveToDoList={(id, { todos }) => {
        const listToUpdate = toDoLists[id]
        fetch('http://localhost:3001/allTodos', {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify({
            listToUpdate,
            todos
          })
        })
        .then(res => {
          if (res.status === 200) {
            return res;
          }
        })
        setToDoLists({
          ...toDoLists,
          [id]: { ...listToUpdate, todos }
        })
      }}
    />}
  </Fragment>
}
