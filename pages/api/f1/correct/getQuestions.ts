import { F1Choice, F1ChoiceType } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../utils/prisma'
// import { Question } from '../../../selectCorrect'

interface Question {
    question: string,
    choices: { title: string, id: number }[],
    selectedAnswer: number,
    endTime: string,
    id: number
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { predictionTypeID }: { predictionTypeID: number } = req.body

    const Questions = await prisma.f1Question.findMany({
        where: { f1PredictionTypeId: predictionTypeID },
        select: {
            title: true,
            endTime: true,
            ChoiceTypes: {
                select: {
                    title: true,
                    id: true
                }
            },
            id: true
        }
    })
    const result: Question[] = Questions.map((val) => {
        return {
            question: val.title,
            choices: val.ChoiceTypes.map((value) => {
                return { title: value.title, id: value.id }
            }),
            // choices: val.ChoiceTypes,
            selectedAnswer: 0,
            endTime: val.endTime.toISOString(),
            id: val.id
        }
    })

    res.json(result)
}