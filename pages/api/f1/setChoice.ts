import { F1Choice } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../utils/prisma'


export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    //TODO security lmao
    const { choiceTypeId, predictionTypeID, userEmail }: { choiceTypeId: number, predictionTypeID: number, userEmail: string } = req.body

    var prediction = await prisma.f1Prediction.findFirst({ where: { user: { email: userEmail } } })
    if (!prediction) {
        prediction = await prisma.f1Prediction.create({ data: { user: { connect: { email: userEmail } }, f1PredictionType: { connect: { id: predictionTypeID } } } })
    }

    var question = (await prisma.f1ChoiceType.findUnique({ where: { id: choiceTypeId }, select: { question: true } }))?.question

    if (!question) {
        res.status(400).json({ message: "Couldnt find the question" })
        return
    }

    console.log(question.endTime, new Date())
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