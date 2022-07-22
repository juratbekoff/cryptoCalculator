const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')

async function getPriceFeed() {
    try {
        const siteUrl = 'https://coinmarketcap.com/'

        const { data }= await axios({
            method: 'GET',
            url: siteUrl,
        })

        const $  = cheerio.load(data)

        const keys = [
            "rank",
            "name",
            "price",
            "1h",
            "24h",
            "7d",
            "marketCap",
            "volume",
            "circulatingSupply",
        ]

        const elemSelector = '#__next > div > div.main-content > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div > div.h7vnx2-1.bFzXgL > table > tbody > tr'

        const coinArray = []

        $(elemSelector).each((parentIdx, parentElem) => {
            let keyIdx = 0;
            const coinObj = {}

            if(parentIdx <= 20) {
                $(parentElem).children().each((childIdx, chidlElem) => {
                    const tdValue = $(chidlElem).text()
                        if(tdValue) {
                            coinObj[keys[keyIdx]] = tdValue
                            
                            keyIdx ++
                        }
                })
                coinArray.push(coinObj)
            }
        })
        return coinArray
    } catch (error) {
        console.error(error)
    }
}


const app = express()

app.get('/api/price-feed', async(req,res) => {
    try {
        const priceFeed = await getPriceFeed()

        return res.status(200).json({
            message: 'Working!',
            result: priceFeed
        })

    } catch (error) {
        error: error.toString()
    }
})

app.listen(3000, () => {
    console.log('Server is running...')
})