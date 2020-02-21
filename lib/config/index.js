module.exports = {
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_TO: process.env.EMAIL_TO,
    EMAIL_PWD: process.env.EMAIL_PWD,
    DNI: process.env.DNI,
    DAY_OF_BIRTH: process.env.DAY_OF_BIRTH,
    MONTH_OF_BIRTH: process.env.MONTH_OF_BIRTH,
    YEAR_OF_BIRTH: process.env.YEAR_OF_BIRTH,
    CODE: process.env.CODE.split('').map(it => +it)
}
