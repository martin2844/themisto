const express = require('express');
require('dotenv').config();
const cors = require('cors');
const path = require('path');
const forceSsl = require('force-ssl-heroku');
const axios = require('axios');

//methods
const chooseMethod = require('./methods/ChooseMethod');
const { send } = require('process');

//initialize express.
const app = express();
app.use(forceSsl);
app.use(cors());


//Body Parser
app.use(express.json({ extended: false }));
app.use(express.urlencoded({extended: false}));


//Esto simplemente hay que meterlo en una ruta.
//let results = scrape("amoladora")
app.post('/search', async (req, res) => {
  //Destructure Request Body
  let {query, provider, callbackUrl, options, _id} = req.body;
  let limit = options.limit
  console.log("@@@@@@@@@@@@@@@@@@@@LIMIT@@@@@@@@@@@@@@@@@@\n",limit);
  //Log the ID we'll work on.
  console.log(_id);

  try {

        //Try to get results depending on the methods
        let results = await chooseMethod(provider, query, limit);
        //Create new search object to send back to Ganymede
        let search = {
          ...req.body,
          results: results
        }
   
        //Send results backs to Ganymede
        try {

          let sendResults = await axios.post(callbackUrl, search);
          res.send(sendResults);

        } catch (error) {
          res.send(error)
        }
        // axios.post(callbackUrl, search).then(x => console.log(x, "sent post")).catch(x => res.status(500).send("Ganymede API ERROR: ", x));
        // res.send("search successful, sent back to ganymede");

  } catch (error) {
        //If error send error back to Ganymede.
        let search = {
          ...req.body,
          status: "failed",
          error: error,
        }
        try {
          let sendError = await axios.post(callbackUrl, search);
          res.send(sendError);
        } catch (error) {
        // Cambiar todo esto a try catch.
        res.send(error);
        }
       
      }


})


//Port and listen
const PORT = process.env.PORT || 6000;
app.listen(PORT, console.log(`server started on ${PORT}`));

