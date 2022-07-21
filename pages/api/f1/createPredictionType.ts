import { F1Choice } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { env } from 'process'
import prisma from '../../../utils/prisma'


export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    //TODO security lmao
    const { name, password }: { password: string, name: string } = req.body

    if (process.env.PASSWORD != password) {
        res.status(400).json({ message: "invalid password" })
        return
    }

    const result = await prisma.f1PredictionType.create({ data: { name: name } })

    res.json(result)
}