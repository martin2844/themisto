const express = require('express');
require('dotenv').config();
const cors = require('cors');
const path = require('path');
const forceSsl = require('force-ssl-heroku');
const axios = require('axios');


const { send } = require('process');

//initialize express.
const app = express();
app.use(forceSsl);
app.use(cors());


//Body Parser
app.use(express.json({ extended: false }));
app.use(express.urlencoded({extended: false}));

//Search route
app.use('/api/search', require('./routes/search'));

//Port and listen
const PORT = process.env.PORT || 6000;
app.listen(PORT, console.log(`server started on ${PORT}`));

