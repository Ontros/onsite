import { F1Choice } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../utils/prisma'
import { Question } from '../../f1'


export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    // await prisma.f1Question.deleteMany({ where: { f1PredictionTypeId: 1 } })
    const { predictionTypeID, questions, userEmail }: { choiceTypeId: number, questions: Question[], predictionTypeID: number, userEmail: string } = req.body
    var prediction = await prisma.f1Prediction.findFirst({ where: { user: { email: userEmail } } })
    if (!prediction) {
        prediction = await prisma.f1Prediction.create({ data: { user: { connect: { email: userEmail } }, f1PredictionType: { connect: { id: predictionTypeID } } } })
    }

    var result: number[] = []
    var index = 0
    // console.log(predictionTypeID, questions)
    for (var question of questions) {
        // var fds = await questions.forEach(async (question, index) => {
        var choice = await prisma.f1Choice.findFirst({ where: { choiceType: { question: { id: question.id } }, prediction: { userId: prediction.userId } }, include: { choiceType: true } })
        if (choice) {
            result[index] = question.answers.findIndex((ans) => { return ans.title === choice?.choiceType.title })
        }
        else {
            result[index] = -1
        }
        index++
        // })
    }

    res.json(result)
}