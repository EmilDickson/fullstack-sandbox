const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())
app.use(cors())

const PORT = 3001

let allTodos = {
    '0000000001': {
      id: '0000000001',
      title: 'First List',
      todos: ['First todo of first list from backend!']
    },
    '0000000002': {
      id: '0000000002',
      title: 'Second List',
      todos: ['First todo of second list from backend!']
    }
};

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/allTodos', (req, res) => res.status(200).send(allTodos));

app.post('/allTodos', (req, res) => {
    const listId = req.body.listToUpdate.id;
    const newTodos = req.body.todos;
    allTodos[listId].todos = newTodos;
    res.status(200).send("done!")
})

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

