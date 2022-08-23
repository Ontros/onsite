import { F1Choice } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { env } from 'process'
import prisma from '../../../utils/prisma'

interface WeekendPart {
    name: string
    endTime: any
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { name, password, weekendParts }: { password: string, name: string, weekendParts: WeekendPart[] } = req.body

    if (process.env.PASSWORD != password) {
        res.status(400).json({ message: "invalid password" })
        return
    }

    const result = await prisma.f1PredictionType.create({ data: { name: name, f1WeekendParts: { createMany: { data: weekendParts.map((part) => { return { name: part.name, endTime: part.endTime } }) } } } })

    res.json(result)
}