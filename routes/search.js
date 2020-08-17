const express = require("express");
const router = express.Router();
const axios = require("axios");
const deburr = require('lodash.deburr');

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
          let resultsArray = await chooseMethod(provider, query, limit);
          let results = resultsArray[0];
          let cats = resultsArray[1];
          cats = cats.map((cat) => {
            //Clean array of spaces and diacritics.
            cat = cat.toLowerCase();
            cat = cat.replace(/\s+/g, '-');
            cat = deburr(cat);
            return cat;
          })
          //Create new search object to send back to Ganymede
          let search = {
            ...req.body,
            results: results,
            categories: cats
          }
          
          if(results.error) {
            search.error = results.error;
            search.status = "failed";
          }
     
          //Send results backs to Ganymede
          try {
            console.log("@@@@ Sending back results to Ganymede @@@@ : \n")
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
  