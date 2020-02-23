const chromium = require('chrome-aws-lambda');
const path = require('path');
const EmailSender = require('../utils/email.js')

const {screenshotDOMElement} = require('../utils/screenshotter')
const ShadowDOM = require('../utils/shadow-dom-utils')

const {DNI, DAY_OF_BIRTH, MONTH_OF_BIRTH, YEAR_OF_BIRTH, CODE} = require('../config')

const SCREEN_SIZE = {width: 1270, height: 800};

const SCREENSHOT_NAME = 'expenses.jpg'
const SCREENSHOT_PATH = `/tmp/${SCREENSHOT_NAME}`;

const ingReport = async () => {

    const page = await initPage();

    await doLogin(page);
    await fillSecurityCode(page);
    await acceptCookies(page);

    const currentBalance = await getCurrentBalance(page);
    await generateReportExpensesReport(page, SCREENSHOT_PATH);

    await EmailSender.sendReportAndRemoveFile(SCREENSHOT_NAME, SCREENSHOT_PATH, currentBalance)
};


async function getPositionsAndCodesToInsert(page) {
    const nonVisibleText = await ShadowDOM.getElement(page, '.c-pinpad__secret-positions > .u-hidden-visually')
    const positionsText = await page.evaluate((el) => el.innerText, nonVisibleText)
    const wordsArray = positionsText.replace(',', '').split(' ')
    const positionsIndexes = [+wordsArray[3], +wordsArray[4], +wordsArray[6]]
    return [CODE[positionsIndexes[0] - 1], CODE[positionsIndexes[1] - 1], CODE[positionsIndexes[2] - 1]]
}

async function doLogin(page) {
    await page.waitFor(3000)
    await ShadowDOM.writeOnElement(page, '#ing-uic-native-input_0', DNI)
    await ShadowDOM.writeOnElement(page, '#input_day', DAY_OF_BIRTH)
    await ShadowDOM.writeOnElement(page, '#input_month', MONTH_OF_BIRTH)
    await ShadowDOM.writeOnElement(page, '#input_year', YEAR_OF_BIRTH)
    const loginButton = await ShadowDOM.getElement(page, '.c-btn')
    return loginButton.click()
}

async function fillSecurityCode(page) {
    await page.waitFor(2000)

    const codes = await getPositionsAndCodesToInsert(page);

    const templ = 'div > ul > li.c-pinpad__marker__slot.c-pinpad__marker__slot--'
    const slotClasses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(slotNumber => `${templ}${slotNumber}`)

    const values = []
    for await (const slot of slotClasses) {
        const value = +(await ShadowDOM.getSelectorText(page, slot))
        values.push(value)
    }

    for await (const code of codes) {
        const slotToPress = values.indexOf(code)
        const slotElement = await ShadowDOM.getElement(page, slotClasses[slotToPress])
        await slotElement.click()
    }
}

async function acceptCookies(page) {
    await page.waitFor(15000)
    await page.click('#aceptar');
}

async function generateReportExpensesReport (page, reportStoragePath) {
    await page.click('div.expenses-overall__head.clearfix > h4 > div > a')
    await page.waitFor(10000)
    const elementHandle = await page.$('[data-interface-id="see-more-interface"]');
    elementHandle.click()

    await page.waitFor(5000)

    await screenshotDOMElement(page, {
        path: reportStoragePath,
        selector: '#content > div > div.dashboard-layout__container-expenses.row.bg-low-light-pale-gray',
        padding: 0
    })
}

async function getCurrentBalance(page) {
    const element = await page.$('p.h1.clr-dark-orange.amount');
    return (await page.evaluate(element => element.textContent, element))
}

async function getBrowser() {
    return await chromium.puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
    });
}

async function addNestedQuerySelectorScript(page) {
    await page.addScriptTag({path: path.join(process.cwd(), 'node_modules/query-selector-shadow-dom/dist/querySelectorShadowDom.js')});
}

async function initPage() {
    const browser = await getBrowser()
    const page = await browser.newPage()
    await page.setViewport(SCREEN_SIZE)

    await page.goto('https://ing.ingdirect.es/app-login/')
    await addNestedQuerySelectorScript(page)
    return page
}



module.exports = {
    run: ingReport
}
