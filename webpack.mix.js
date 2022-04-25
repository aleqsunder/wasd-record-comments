const path = "./dist/index.user.js"
const mix = require('laravel-mix')
mix.js('src/index.js', path).vue()

mix.disableNotifications()
mix.disableSuccessNotifications()

mix.after(async stats => {
    const fs = require("fs").promises
    const tamperMonkeyData = await fs.readFile('./src/js/_.js', "utf-8")
    const compiledData = await fs.readFile(path, "utf-8")
    const dataTemplate = `${tamperMonkeyData}\r\n\r\n${compiledData}`
    
    await fs.writeFile(path, dataTemplate, errors => {
        if (errors) {
            return console.log(errors)
        }
    })
})