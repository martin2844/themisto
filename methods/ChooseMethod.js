//methods
const scrape = require('./Scrape');
const searchMeli = require('./Meli');

const ChooseProvider = async (provider, query, limit) => {
  let results;
  let cats;
  let providerLow = provider.toLowerCase();
  switch (providerLow) {
      case "easy":
          let easyResults = await scrape(query);
          results = easyResults[0];
          cats = easyResults[1];
          break;
      case "meli":
          let meliResults = await searchMeli(query, limit);
          results = meliResults[0],
          cats = meliResults[1]
          break;
      default:
          console.log(`error, provider: "${provider}" does not exist`);
          results = {error: `error, provider: "${provider}" does not exist`};
          break;
  }
  return [results, cats];
}


module.exports = ChooseProvider;