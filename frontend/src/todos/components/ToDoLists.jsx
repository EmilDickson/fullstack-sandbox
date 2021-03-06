import React, { Fragment, useState, useEffect } from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ReceiptIcon from '@material-ui/icons/Receipt'
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Typography from '@material-ui/core/Typography'
import { ToDoListForm } from './ToDoListForm'
import { debounce } from '@material-ui/core'

const saveLists = (listToUpdate, todos) => {
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
}

const saveListsDebounce = debounce(saveLists, 300);

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

  const todoDone = (todo) => todo.done;

  const deleteList = (listId) => {
    let newLists = {...toDoLists};
    delete newLists[listId];
    setToDoLists(newLists);
    fetch('http://localhost:3001/setTodoLists', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({newLists})
    })
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
              {toDoLists[key].todos.every(todoDone) ? <CheckCircleIcon style={{ color: 'green' }} /> : <ReceiptIcon />}
            </ListItemIcon>
            <ListItemText primary={toDoLists[key].title} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => deleteList(key)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>)}
        </List>
      </CardContent>
    </Card>
    {toDoLists[activeList] && <ToDoListForm
      key={activeList} // use key to make React recreate component to reset internal state
      toDoList={toDoLists[activeList]}
      saveToDoList={(id, { todos }) => {
        const listToUpdate = toDoLists[id]
        setToDoLists({
          ...toDoLists,
          [id]: { ...listToUpdate, todos }
        })
        saveListsDebounce(listToUpdate, todos);
      }}
    />}
  </Fragment>
}
