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
        const questions = await prisma.f1Question.findMany({
            select: {
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
        var wrongAnswers = 0
        var maxPoints = 0
        var unansweredQuesionCount = 0
        var errorQuesions = 0
        for (var question of questions) {
            if (question.correctChoiceID) {
                maxPoints++
                if (question.ChoiceTypes) {
                    //Find answer
                    const anses = question.ChoiceTypes.filter((val) => { return !!val.choices[0] })
                    if (anses.length === 1) {
                        if (question.correctChoiceID === anses[0].choices[0].choiceTypeId) {
                            points++
                        }
                        else {
                            wrongAnswers++
                        }
                    }
                    else if (anses.length === 0) {
                        unansweredQuesionCount++
                    }
                    else {
                        console.log(`Weird amount of anses (${anses.length})`)
                        errorQuesions++
                    }
                }
            }
        }
        result[user.name ? user.name : "missing name"] = {
            points, maxPoints, unansweredQuesionCount, wrongAnswers, errorQuesions
        }
    }
    res.json(JSON.stringify(result, null, " "))
}