import { F1Choice } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../utils/prisma'
import { Question } from '../../../f1/selectCorrect'


export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    // await prisma.f1Question.deleteMany({ where: { f1PredictionTypeId: 1 } })
    const { predictionTypeID, questions, userEmail }: { choiceTypeId: number, questions: Question[], predictionTypeID: number, userEmail: string } = req.body
    if (userEmail != "ontro512@gmail.com") {
        console.log("Insufficient permission (correct/getSelected)")
        res.status(400).json("insuffiecient permission")
        return
    }

    var result: number[] = []
    var index = 0
    for (var question of questions) {
        // var fds = await questions.forEach(async (question, index) => {
        // var choice = await prisma.f1Choice.findFirst({ where: { choiceType: { question: { title: question.question } } }, include: { choiceType: true } })
        // var choice = await prisma.f1ChoiceType.findFirst({ where: { question: { id: question.id } }, select: { id: true, correctQuestion: { select: { title: true, id: true, } } } })
        var quest = await prisma.f1Question.findFirst({ where: { id: question.id }, include: { correctChoice: true } })

        if (quest?.correctChoiceID) {
            result[index] = question.choices.findIndex((ans) => { return ans.id === quest?.correctChoiceID })
            // result[index] = quest.correctChoiceID
        }
        else {
            result[index] = -1
        }
        index++
        // })
    }

    console.log(result)

    res.json(result)
}