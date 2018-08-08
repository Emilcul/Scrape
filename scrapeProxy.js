const puppeteer = require('puppeteer');
const fs = require('fs');




let scrape = async(id, i) => {
  console.log("CURRENT EL ", i);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const link = 'https://free-proxy-list.net/';

  await page.goto(link);
  await page.setViewport({width: 1000, height: 1000});


  const firstPage = await page.evaluate(() => {

    const descriptAndStar_rat = () => {
        const table = document.querySelector('#proxylisttable > tbody').childNodes;
        const info = [].map.call(table, elem => {
          return elem.innerText.split('\t');
        })
        const result = info.filter(el => el[2] == 'US'&&el[4]=='anonymous' && el[5] == 'yes');

        return result;
    }
    return descriptAndStar_rat();

  });


  browser.close();



  return firstPage;

};



scrape().then((value) => {
  console.log(value);
  fs.writeFile('11111.txt', JSON.stringify(value),() => console.log());
});





const calculateResult = async (err, content) => {
  if(err) throw new Error(err);

  const idsArray = content.split(/\n/g).map(x => x.trim());
  const errorsArray = [];
  const result = [];
  for(let i =0; i < idsArray.length; i++) {

    const scrapeResult = await scrape(idsArray[i], i).catch( () => errorsArray.push(idsArray[i]));
    await new Promise((res, rej) => {
      if(rej)
      setTimeout(res, 0);
    })
    result.push(scrapeResult);
    console.log(scrapeResult)

    fs.writeFile('resultssss2s2.txt', JSON.stringify(result),() => console.log());
  }
 
}

//  fs.readFile('all_fb_ids.txt','utf8', calculateResult);
