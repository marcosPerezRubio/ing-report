const p = require('./lib/use-cases/ing-report')
p.run().then(r => {
    console.log('Done');
    process.exit(0)
}).catch(err => {
    console.error(err);
    process.exit(1)
})
