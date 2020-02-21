const useCase = require('./lib/use-cases/ing-report')
exports.handler = async (event) => {
    console.log('--- Starting ---')
    try {
        await useCase.run()
        return {
            statusCode: 200,
            body: JSON.stringify('Done!'),
        };
    } catch (e) {
        console.log(e)
        return {
            statusCode: 500,
            body: JSON.stringify('Error!'),
        };
    }

};
