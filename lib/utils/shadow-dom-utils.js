
const getElement = async function (page, selector) {
    const item = await page.waitForFunction((selector) => querySelectorShadowDom.querySelectorDeep(selector), {}, selector)
    return item.asElement();
}

const writeOnElement = async (page, selector, text) => {
    const input = await getElement(page, selector)
    await input.focus()
    await page.keyboard.type(text)
}

async function getSelectorText(page, selector) {
    const element = await getElement(page, selector)
    return page.evaluate((el) => el.innerText, element);
}

module.exports = {
    getElement,
    writeOnElement,
    getSelectorText
}
