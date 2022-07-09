import { F1Choice } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { env } from 'process'
import prisma from '../../../utils/prisma'


export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    //TODO security lmao
    const { questionID, password }: { password: string, questionID: number } = req.body

    if (process.env.PASSWORD != password) {
        res.status(400).json({ message: "invalid password" })
        return
    }

    const deleteChoice = prisma.f1Choice.deleteMany({ where: { choiceType: { questionID: questionID } } })
    const deleteChoiceTypes = prisma.f1ChoiceType.deleteMany({ where: { questionID: questionID } })
    const deleteQuestion = prisma.f1Question.delete({ where: { id: questionID } })

    const result = await prisma.$transaction([deleteChoice, deleteChoiceTypes, deleteQuestion])

    res.json(result)
}