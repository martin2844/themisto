const express = require('express');
require('dotenv').config();
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const fs = require('fs');

//initialize express.
const app = express();
app.use(cors());

//Logger
// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))

//Body Parser
app.use(express.json({ extended: false }));
app.use(express.urlencoded({extended: false}));

//Search route
app.use('/api/search', require('./routes/search'));

app.get("/", (req, res) => {
    res.send("themisto");
})

//Port and listen
const PORT = process.env.PORT || 5001;
app.listen(PORT, console.log(`server started on ${PORT}`));

