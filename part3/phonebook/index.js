const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())
app.use(
  morgan((tokens, req, res) => {
    const tokenArray = [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
    ]

    if (req.method === "POST") {
      return tokenArray.concat(JSON.stringify(req.body)).join(' ')
    }
    return tokenArray.join(' ')
  })
)

let persons = [
  {
    name: 'Peter Blanks',
    number: '556-900-8722',
    id: 1,
  },
  {
    name: 'Sisher Tomong',
    number: '222-112-7865',
    id: 2,
  },
  {
    name: 'Munsh Elont',
    number: '123-332-1124',
    id: 3,
  },
  {
    name: 'Jason Dyed',
    number: '976-990-0742',
    id: 4,
  }, {
    name: 'Floor Daytingle',
    number: '546-097-1273',
    id: 5,
  },
]

app.get('/', (req, res) => {
  res.send('<h1>Phonebook backend</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  res.send(`Phonebook has info for ${persons.length} people. </br> ${new Date()}`)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  person ? res.json(person) : res.status(404).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  const id = Math.floor(Math.random() * 100)

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name/number is missing'
    })
  } else if (persons.find(person => person.name == body.name)) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: id
  }

  persons = persons.concat(person)
  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

const port = 3001
app.listen(port)

console.log(`Server is running on port ${port}`)