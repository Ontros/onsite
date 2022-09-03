import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../utils/prisma'

interface IDictionary {
    [index: string]: any;
}
// POST /api/post
// Required fields in body: title, authorEmail
// Optional fields in body: content
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    //TODO: zjisit proc to nebere odpovezene, smazat locknuti jen na me, deploy
    //NOTE: depend on IDs being autoincerement
    const users = await prisma.user.findMany({
        select: {
            name: true,
            accounts: { where: { provider: "discord" }, select: { providerAccountId: true } },
            id: true
        }
    })
    const result: IDictionary = {}
    for (var user of users) {
        const questionsUserLoop = await prisma.f1Question.findMany({
            select: {
                author: { select: { name: true } },
                ChoiceTypes: {
                    select: {
                        choices: {
                            select: {
                                id: true,
                                choiceTypeId: true
                            },
                            where: {
                                prediction: {
                                    userId: user.id
                                }
                            }
                        },

                    }
                },
                correctChoiceID: true
            }
        })
        var points = 0
        var maxPoints = 0
        var unansweredQuesionCount = 0
        for (var question of questionsUserLoop) {
            if (question.correctChoiceID) {
                maxPoints++
                if (question.ChoiceTypes && question.ChoiceTypes[0] && question.ChoiceTypes[0].choices && question.ChoiceTypes[0].choices[0] && question.ChoiceTypes[0].choices[0].choiceTypeId) {
                    if (question.correctChoiceID === question.ChoiceTypes[0].choices[0].choiceTypeId) {
                        points++
                    }
                }
                else {
                    unansweredQuesionCount++
                }
            }
        }
        result[user.name ? user.name : "missing name"] = {
            points, totalPoints: maxPoints, unansweredQuesionCount
        }
    }
    res.json(result)
}