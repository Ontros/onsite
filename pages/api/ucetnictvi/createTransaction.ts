import { NextApiRequest, NextApiResponse } from "next"
import { Currency } from '@prisma/client'
import prisma from '../../../utils/prisma'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'


//Creates transaction and returns all transactions by that user
export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    const { description, amount }: { userEmail: string, description: string, amount: number, } = req.body

    const session = await unstable_getServerSession(req, res, authOptions)
    if (!session?.user?.email) {
        res.status(400).json("You are not logged in!")
        return
    }
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) {
        res.status(400).json("no user")
        return
    }

    const transaction = await prisma.transaction.create({ data: { amount: amount, description: description, authorID: user.id, currency: "EUR" } })

    const transactions = await prisma.transaction.findMany({ where: { authorID: user.id } })

    res.json(transactions)
}