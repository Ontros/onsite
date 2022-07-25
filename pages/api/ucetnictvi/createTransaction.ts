import { NextApiRequest, NextApiResponse } from "next"
import { Currency } from '@prisma/client'
import prisma from '../../../utils/prisma'


//Creates transaction and returns all transactions by that user
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    //TODO security lmao, currency

    const { userEmail, description, amount }: { userEmail: string, description: string, amount: number, } = req.body

    const user = await prisma.user.findUnique({ where: { email: userEmail } })
    if (!user) {
        res.status(400).json("no user")
        return
    }

    const transaction = await prisma.transaction.create({ data: { amount: amount, description: description, authorID: user.id, currency: "EUR" } })

    const transactions = await prisma.transaction.findMany({ where: { authorID: user.id } })

    res.json(transactions)
}