import { F1Choice } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../utils/prisma'
import { Question } from '../../f1'


export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    //TODO security lmao
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
            }
        }
    })
    const result: Question[] = Questions.map((val) => {
        return {
            question: val.title,
            answers: val.ChoiceTypes.map((value) => {
                return { title: value.title, id: value.id }
            }),
            selectedAnswer: 0,
            endTime: val.endTime.toISOString()
        }
    })

    res.json(result)
}