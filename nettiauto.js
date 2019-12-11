// import {$} from "puppeteer";

const puppeteer = require('puppeteer');
const sleep = require('sleep');

async function login(callback) {
    const browser = await puppeteer.launch({headless: false});
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
    await page.goto('https://www.nettiauto.com/en/statVehicle.php?sid_make=23&sid_model=&syear=&search=Show+Statistics');
    await page.waitForNavigation();

    const totPage = (await page.$x('//*[@class="totPage"]'))[0];

    const total_page = await page.evaluate(el => {
        return el.textContent;
    }, totPage);

    let total_page_in_num = Number(total_page);
    console.log(total_page_in_num);

    for (let i=1; i <= total_page_in_num; i++){
        console.log(i);
    }

    // await browser.close();


});