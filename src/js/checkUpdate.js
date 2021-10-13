const request = require('request-promise')
const cheerio = require('cheerio')
const package = require('../../package.json')

url = 'https://github.com/innovation-center-gitam-hyd/gitamite-pc/releases/latest'


async function getLatestVersion(){
    try {
        const html = await request(url)
        const $ = cheerio.load(html)
        const temp = $('span.css-truncate-target').first()
        var version = temp.text().toString()
        if (version.includes('v')) {
            version = version.replace('v', '')
        }
        if (version == "") {
            return '404'
        }
        return version
    } catch (err) {
        return '404'
    } 
    
}

async function isNewUpdateFound(){
    var currentVersion = package.version.toString()
    var version = await getLatestVersion()
    console.log(currentVersion)
    console.log(version)
    if(version=='404'){
        return false
    }
    return (currentVersion != version)
}

module.exports = {isNewUpdateFound}

