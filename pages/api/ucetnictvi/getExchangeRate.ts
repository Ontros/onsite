import { NextApiRequest, NextApiResponse } from "next"
import { Currency } from '@prisma/client'


//Creates transaction and returns all transactions by that user
export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    var headers = new Headers()
    if (!process.env.EXCHANGE_API) {
        res.status(400).json("Internal server error, missing ENV (EXCHANGE_API)")
        return
    }
    headers.append("apikey", process.env.EXCHANGE_API)
    const result = await fetch("https://api.apilayer.com/exchangerates_data/convert?to=CZK&from=EUR&amount=1", {
        redirect: "follow", headers, method: "GET"
    })
    const json = await result.json()

    if (!json.info.rate) {
        res.status(400).json("Invalid internal request")
        return
    }

    res.json(json.info.rate)
}