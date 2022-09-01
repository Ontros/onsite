import { F1Choice } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../utils/prisma'
import { Question } from '../../f1'


export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { predictionTypeID }: { predictionTypeID: number } = req.body

    const allWeekendParts = await prisma.f1weekendpart.findMany({
        where: { predictionTypeId: predictionTypeID }, select: {
            name: true,
            id: true,
            endTime: true
        }
    })
    const Questions = await prisma.f1Question.findMany({
        where: { f1PredictionTypeId: predictionTypeID },
        select: {
            title: true,
            id: true,
            endTime: true,
            ChoiceTypes: {
                select: {
                    title: true,
                    id: true
                }
            },
            f1weekendparts: {
                select: {
                    name: true,
                    id: true,
                    endTime: true
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
            endTime: val.endTime.toISOString(),
            f1WeekendParts: val.f1weekendparts,
            id: val.id
        }
    })

    res.json({ questions: result, allWeekendParts })
}

interface weekendPart {
    name: string;
    id: number;
    endTime: Date;
}

export type { weekendPart }