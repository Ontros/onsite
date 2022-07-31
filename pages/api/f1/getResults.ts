import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../utils/prisma'
import { Question } from '../../f1'


export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    // await prisma.f1Question.deleteMany({ where: { f1PredictionTypeId: 1 } })
    const result = await prisma.f1PredictionType.findUnique({
        where: { id: 3 },
        select:
        {
            questions: {
                select:
                {
                    ChoiceTypes:
                    {
                        select:
                        {
                            choices: {
                                select: {
                                    prediction: {
                                        select: {
                                            user: {
                                                select: { name: true }
                                            }
                                        }
                                    },
                                },
                            },
                            title: true
                        },
                    },
                    title: true

                },
            },

        },
    })

    res.json(result?.questions)
}