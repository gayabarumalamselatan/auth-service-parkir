const express = require('express')
const cors = require('cors')

const app = express()
const userRoutes = require('./Routes/userRoutes')
const port = 3100

app.use(express.json())
app.use(cors())

app.use('/auth-service', userRoutes)

app.listen(port, () => {
  console.log(`Server running on ${port}` )
})