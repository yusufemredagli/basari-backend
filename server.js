const express = require('express')
const cors = require('cors')

const authRoutes = require('./src/routes/authRoutes');
const subjectRoutes = require('./src/routes/subjectRoutes')
const bookRoutes = require('./src/routes/bookRoutes')
const scheduleRoutes = require('./src/routes/scheduleRoutes')
const bookTaskRoutes = require('./src/routes/bookTaskRoutes');
const topicRoutes = require('./src/routes/topicRoutes');
const curriculumRoutes = require('./src/routes/curriculumRoutes')
const userRoutes = require('./src/routes/userRoutes');



const db = require("./src/config/db")


const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth' , authRoutes)

app.use('/api/subjects' , subjectRoutes)

app.use('/api/books' , bookRoutes)

app.use('/api/schedules' , scheduleRoutes)

app.use('/api/book-tasks', bookTaskRoutes)

app.use('/api/topics' , topicRoutes)

app.use('/api/curriculum' , curriculumRoutes)

app.use('/api/users', userRoutes);

app.get("/",(req,res) => {
    res.send("api calisiyor ")
})

const PORT = process.env.PORT || 3000

app.listen(PORT , () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde calisiyor.`);
})