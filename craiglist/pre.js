const puppeteer = require('puppeteer');


async function get_url(callback) {
    console.log("Sarting ...");
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    let i = 0;


    while (true) {

            await page.goto('https://losangeles.craigslist.org/search/cta?s='+i+'&max_auto_year=1975&max_price=10000&min_price=30');

            const selectors = await page.$$('.result-row > a');
            let urls_list = [];
            for (let href of selectors) {

                const s_url = await page.evaluate(el => el.href, href);

                urls_list.push(s_url.trim());

            }

            if(urls_list.length === 0){
                break;
            } else {
                console.log(urls_list);
                i = i + 120;
            }
    }

    await browser.close();


    // sleep.sleep(10);
    // callback(page, browser);

}



get_url(async (page, browser) => {

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
    console.log("Scraping Done!")


});