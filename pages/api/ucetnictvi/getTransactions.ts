import { NextApiRequest, NextApiResponse } from "next"
import { Currency } from '@prisma/client'
import prisma from '../../../utils/prisma'


//Creates transaction and returns all transactions by that user
export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    const { userEmail }: { userEmail: string } = req.body

    const user = await prisma.user.findUnique({ where: { email: userEmail } })
    if (!user) {
        res.status(400).json("no user")
        return
    }

    const transactions = await prisma.transaction.findMany({ where: { authorID: user.id } })

    res.json(transactions)
}