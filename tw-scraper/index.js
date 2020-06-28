const request = require('request-promise');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const fs = require('fs');


const URL = 'https://tailwindcomponents.com/cheatsheet/';


(async () => {
    const browser = await puppeteer.launch({
        // headless: false
    });
    const page = await browser.newPage();

    // block images, css and fonts to speed up loading
    await page.setRequestInterception(true);

    page.on('request', (request) => {
        if (['image', 'stylesheet', 'font'].includes(request.resourceType())) {
            request.abort();
        } else {
            request.continue();
        }
    });
    await page.goto(URL);

    const expandButtonXpath = '//button[text()="Expand All"]';
    await page.waitFor(1000);
    const expandButton = await page.$x(expandButtonXpath);
    if (expandButton.length > 0) {
        await expandButton[0].click();
    } else {
        throw new Error("Link not found");
    }
    await page.waitFor(500);

    // scraping

    let result = await page.evaluate(() => {
        const data = {}
        const rows = document.querySelectorAll('table tr')
        
        // const arr = []
        // rows.forEach( row => arr.push(row.innerText))
        // return arr
        rows.forEach(row => {
            const r = row.innerText.split('\t')
            let i = 0;
            if (!r[i].includes('.') && r[i+1].includes('.')) { i ++ }
            const key = `${r[i].replace('.', '')}`
            data[key] = r[i+1]
        });
        
        return data
    });
    // console.log(result)

    const jsonData = JSON.stringify(result)

    fs.writeFile("../src/assets/tailwind-cheat-sheat.json", jsonData, function (err) {
        if (err) {
            console.log(err);
        }
    });



    // await page.screenshot({ path: 'example.png' });

    await browser.close();

    // debugger;
})();