var fs = require('fs');
const puppeteer = require('puppeteer');
const sleep = require('sleep');
const readline = require('readline');

var chunkArray = require.main.require('./chunkArray');

const { convertArrayToCSV } = require('convert-array-to-csv');
const converter = require('convert-array-to-csv');

async function login(callback) {
    console.log("Sarting ...");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.nettiauto.com/en/statVehicle.php');

    let selector = 'a[id="ut_loginLink"]';
    await page.evaluate((selector) => document.querySelector(selector).click(), selector).catch(err => console.log(err));

    sleep.sleep(2);
    let user_field = 'input[name="loginid"]';
    await page.evaluate((user_field) => document.querySelector(user_field).value = 'petergsalmon12@gmail.com', user_field).catch(err => console.log(err));

    sleep.sleep(1);
    let pass_field = 'input[name="passwd"]';
    await page.evaluate((pass_field) => document.querySelector(pass_field).value = 'Pass4guruclient', pass_field).catch(err => console.log(err));

    sleep.sleep(1);
    let login = 'input[name="login"]';
    await page.evaluate((login) => document.querySelector(login).click(), login).catch(err => console.log(err));

    sleep.sleep(10);
    callback(page, browser);

}



login(async (page, browser) => {

    //================== change the bellow link only to scrape ====================================
    // url_to_scrape = 'https://www.nettiauto.com/en/statVehicle.php?sid_make=23&sid_model=&syear=&search=Show+Statistics';
    url_to_scrape = 'https://www.nettiauto.com/en/statVehicle.php?sid_make=31&sid_model=&syear=&search=Show+Statistics';
    
    await page.goto(url_to_scrape);
    await page.waitForSelector('.totPage');

    const totPage = (await page.$x('//*[@class="totPage"]'))[0];

    const total_page = await page.evaluate(el => {
        return el.textContent;
    }, totPage);

    let total_page_in_num = Number(total_page);
    console.log("Total Page To Scrape: ",total_page_in_num);

    for (let i=1; i <= total_page_in_num; i++){
        console.log("Current page: ", i);
        console.log("Scraping ...");
        sleep.sleep(2);
        url_to_scrape_dyn = url_to_scrape + '&page=' + i;
        await page.goto(url_to_scrape_dyn);
        await page.waitForSelector('.plr20');


        const selectors = await page.$$('.plr20 > ul > li');
        let arr_child = [];
        let arr_parent = [];
        for(let tr of selectors){
            
            const trText = await page.evaluate(el => el.innerText, tr);
           
                arr_child.push(trText.trim());
            
        }

       let result = chunkArray.chunkArray(arr_child, 5);
       let header = ['Make & model', 'Year', 'Mileage', 'Price', 'Sold date'];

       let options = {
            header: header,
            separator: ','
       };

       const csv = convertArrayToCSV(result, options);


        // ============== change bellow file name in which file you want to store the data =============
        let file_name = "isuzu.csv";
        fs.appendFileSync(file_name, csv, function(err) {
            if (err) {
                console.log(err);
            }
        });
    }

    await browser.close();


});