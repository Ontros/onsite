import { F1Choice, F1ChoiceType } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../utils/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]'


export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { choiceTypeId, predictionTypeID }: { choiceTypeId: number, predictionTypeID: number } = req.body

    const session = await getServerSession(req, res, authOptions)
    if (session?.user?.email != "ontro512@gmail.com") {
        res.status(400).json("insuffiecient permission")
        return
    }

    var prediction = await prisma.f1Prediction.findFirst({ where: { user: { email: session.user.email } } })
    if (!prediction) {
        prediction = await prisma.f1Prediction.create({ data: { user: { connect: { email: session.user.email } }, f1PredictionType: { connect: { id: predictionTypeID } } } })
    }

    var question = (await prisma.f1ChoiceType.findUnique({ where: { id: choiceTypeId }, select: { question: true } }))?.question

    if (!question) {
        res.status(400).json({ message: "Couldnt find the question" })
        return
    }

    var result: F1ChoiceType | null = null
    result = await prisma.f1ChoiceType.update({ where: { id: choiceTypeId }, data: { correctQuestion: { connect: { id: question.id } } } })

    res.json(result)
}
