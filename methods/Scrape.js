const puppeteer = require('puppeteer');


const runBrowser = async (query) => {
  //Run Browser
  const browser = await puppeteer.launch();
  //Create new page
  const page = await browser.newPage();
  //Navigate to easy
  await page.goto('https://easy.com.ar');
  //Type  the query
  await page.type('#SimpleSearchForm_SearchTerm', query);
  //Click the search buttong
  await page.click('#WC_CachedHeaderDisplay_button_1');
  //Wait for page navigation
  await page.waitForNavigation();
  //Take a screenshot?
  await page.screenshot({path: 'example.png'});


  let count = await page.evaluate(() => {
    let rawCount = document.querySelectorAll('.float-container-line span')[0].innerText;
    let cleanCount = rawCount.substring(1, rawCount.lastIndexOf("r") - 1 );
    return parseFloat(cleanCount);
  })

  console.log("Scraped ", count, " results")
  
  if(isNaN(count)){
    let error = {error: `error, results: there were no results for  "${query}"`};
    return error
  }

  //Is element visible checks if the see-more button exists
  const isElementVisible = async (page, cssSelector) => {
    let visible = true;
    await page
      .waitForSelector(cssSelector, { visible: true, timeout: 2000 })
      .catch(() => {
        visible = false;
      });
    return visible;
  };

  const cssSelector = '.see-more';
  //Pass it to a let
  let loadMoreVisible = await isElementVisible(page, cssSelector);
 //While the button exists, click it basically.
    while (loadMoreVisible) {
      await page
        .click(cssSelector)
        .catch(() => {});
      loadMoreVisible = await isElementVisible(page, cssSelector);
    }


  //Scrape categories
  let cats = await page.evaluate(() => {
    let allcatsLong = Array.from(document.querySelectorAll("#fil-cat-content a"), (el) => el.getAttribute('title'));
    allcatsLong = allcatsLong.filter((cats) => {
      return cats !== null;
    });
    let allcatsText = Array.from(document.querySelectorAll("#fil-cat-content a"), (el) => el.innerText);
    allcatsText = allcatsText.filter((cats) => {
      return cats.includes(".") === false;
    });
    allcatsText = allcatsText.map((cat) => {
      return cat.substring(0, cat.indexOf(" "))   ;
    })
    allcatsText = allcatsLong.concat(allcatsText);
    return allcatsText;
  }) 

  // console.log(cats);



    
  let total = await page.evaluate(() => {
    let articles = [];
    let prices = document.getElementsByClassName('thumb-price-e');
    let titles = document.getElementsByClassName('thumb-name');
    let images = document.querySelectorAll(".itemhover img");
    let links = document.querySelectorAll(".dojoDndItem a");
    if(prices.length == titles.length && prices.length == images.length) {

      for (i = 0; i < titles.length; i++) {
          articles.push(
          {
              'title': titles[i].innerText,
              'price': prices[i].innerText,
              'img': images[i].src.substring(0, images[i].src.indexOf("?")),
              'link': links[i].getAttribute("href"),
              'sku': links[i].getAttribute("href").substring(links[i].getAttribute("href").lastIndexOf("-") + 1, links[i].getAttribute("href").length)
          })
      }
  } 
  return articles;
  });


  await page.screenshot({path: 'example2.png'});
  await browser.close();
  return [total, cats];
}




module.exports = runBrowser;