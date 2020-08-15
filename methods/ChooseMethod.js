//methods
const scrape = require('./Scrape');

const ChooseProvider = async (provider, query) => {
  let results;

  if(provider === "easy"){
    results = await scrape(query);
  }
  
  return results;
}


module.exports = ChooseProvider;