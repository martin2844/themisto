const express = require("express");
const router = express.Router();
const axios = require("axios");

//methods
const chooseMethod = require('../methods/ChooseMethod');


//Esto simplemente hay que meterlo en una ruta.
//let results = scrape("amoladora")
router.post('/', async (req, res) => {
    //Destructure Request Body
    let {query, provider, callbackUrl, options, _id} = req.body;
    let limit = options.limit
    //Log the ID we'll work on.
    console.log("working on ID: ", _id);
  
    try {
  
          //Try to get results depending on the methods
          let results = await chooseMethod(provider, query, limit);
          //Create new search object to send back to Ganymede
          let search = {
            ...req.body,
            results: results
          }
          
          if(results.error) {
            search.error = results.error;
            search.status = "failed";
          }
     
          //Send results backs to Ganymede
          try {
            console.log("@@@@ Sending back results to Ganymede @@@@ : \n", search)
            let sendResults = await axios.post(callbackUrl, search);
            res.send(sendResults);
          } catch (error) {
            res.send(error)
          }
  
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
            res.send(error);
          }
         
        }
  
  
  })


  module.exports = router;
  