//methods
const scrape = require('./Scrape');
const searchMeli = require('./Meli.Js');

const ChooseProvider = async (provider, query, limit) => {
  let results;

  switch (provider) {
      case "easy":
        results = await scrape(query);
          break;
      case "meli":
        results = await searchMeli(query, limit);
          break;
      default:
          console.log(`error, provider: "${provider}" does not exist`);
          results = {error: `error, provider: "${provider}" does not exist`};
          break;
  }
  return results;
}


module.exports = ChooseProvider;