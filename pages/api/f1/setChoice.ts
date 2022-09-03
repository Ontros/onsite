import { F1Choice } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../utils/prisma'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'


export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const session = await unstable_getServerSession(req, res, authOptions)
    if (!session?.user?.email) {
        res.status(400).json("You are not logged in!")
        return
    }

    const { choiceTypeId, predictionTypeID }: { choiceTypeId: number, predictionTypeID: number } = req.body

    var prediction = await prisma.f1Prediction.findFirst({ where: { user: { email: session.user.email } } })
    if (!prediction) {
        prediction = await prisma.f1Prediction.create({ data: { user: { connect: { email: session.user.email } }, f1PredictionType: { connect: { id: predictionTypeID } } } })
    }

    var question = (await prisma.f1ChoiceType.findUnique({ where: { id: choiceTypeId }, select: { question: true } }))?.question

    if (!question) {
        res.status(400).json({ message: "Couldnt find the question" })
        return
    }

    if (question?.endTime < new Date()) {
        res.status(400).json({ message: "Too late" })
        return
    }

    var result: F1Choice | null = null
    const choice = await prisma.f1Choice.findFirst({ where: { choiceType: { questionID: question.id }, predictionID: prediction.id } })
    if (choice) {
        //update
        result = await prisma.f1Choice.update({ where: { id: choice.id }, data: { choiceTypeId: choiceTypeId } })
    }
    else {
        //create
        result = await prisma.f1Choice.create({ data: { choiceTypeId: choiceTypeId, predictionID: prediction.id } })
    }

    res.json(result)
}