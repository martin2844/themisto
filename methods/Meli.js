const axios = require("axios");
const _ = require('lodash');

const searchMeli = async (query, limit) => {
    
    
    //Function to get the amount of pages available for MELI items.
    const getPages = async (query) => {
        try {
            // fetch data from a url endpoint
            const response = await axios.get('https://api.mercadolibre.com/sites/MLA/search?q=' + query + '&offset=' + 0)
            const amount = await response.data.paging.primary_results;
            const pages = Math.ceil(amount / 50);
            return pages;
        } catch (error) {
            console.log("@@@@@@@@@@@ \n", )
            console.log(error); // catches both errors
        }
    }
    // get the actual amount of pages.
    let pages = await getPages(query);
    
     //Pages cant be more than 20 without a meli access_token, so we will force the limit to the first 20 pages.
     if(pages > 20) {
        pages = 20
     }

    //If the limit set is less than the total amount of pages, change the page number to the limit number.
    if(limit && limit < pages) {
        pages = limit;
    }

    //Get Item Category
    const getCat = async(query) => {
        let search = await axios.get('https://api.mercadolibre.com/sites/MLA/search?q=' + query + '&offset=' + 1 * 50);
        let cat = search.data.filters;
        cat = search.data.filters.filter(cat => {
            return cat.id === "category" 
        })
        cat = cat[0].values;
        cat = cat[0].path_from_root;
        let cats = cat.map((cat) => {
            return cat.name;
        })

       return cats;
    }
    

    //Get the actual items from Meli.
    const getArticles = async (query, pages) => {
        let arrayToStore = [];
        let promises = [];
        //here we begin the for loop.
        for (i = 0; i < pages; i++) {
            //So for each page we will do an axios request in order to get results
            //Since each page is 50 as offset, then i should be multiplied by 50.
            promises.push(
                axios.get('https://api.mercadolibre.com/sites/MLA/search?q=' + query + '&offset=' + i * 50)
                    .then((response) => {
                        const cleanUp = response.data.results.map((result) => {
                            let image = result.thumbnail.replace("I.jpg", "O.jpg");
                            return importante = {
                                SKU: result.id,
                                title: result.title,
                                price: result.price,
                                link: result.permalink,
                                image: image,
                                categoryMLA: result.category_id,
                                state: result.address.state_name,
                                city: result.address.city_name
                            }
                        });
                        arrayToStore.push(cleanUp);
                    }
                    )
            )
        }

        return await Promise.all(promises).then(() => {
            return arrayToStore
        }).catch(err => console.log("@@@@errror at resolving Meli Promises@@@\n", err));
    }

    let results = await getArticles(query, pages);
    //We get an array of arrays of objects. Lodash will help us flatten the array.
    let spreadResults = _.flattenDeep(results);
    if(spreadResults.length === 0){
        let error = {error: `error, results: there were no results for  "${query}"`};
        return error;
    }
    let cats = await getCat(query);
    console.log("Searched ", spreadResults.length, " results")

return [spreadResults, cats];

}

module.exports = searchMeli