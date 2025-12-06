import type { NextApiRequest, NextApiResponse } from 'next'
import Discord, { IntentsBitField } from 'discord.js'
import prisma from '../../../utils/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

// POST /api/post
// Required fields in body: title, authorEmail
// Optional fields in body: content
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    //TODO: verify endTime
    const { question, selectedPredictionID, endTime, selectedWeekendParts } = req.body
    const session = await getServerSession(req, res, authOptions)
    if (!session?.user?.email) {
        res.status(400).json({ message: "You are not logged in!" })
        return
    }
    if (new Date(endTime).getTime() - 600000 < new Date().getTime()) {
        res.status(400).json({ message: "Too late!" })
        return
    }
    const result = await prisma.f1Question.create({
        data: {
            title: question,
            ChoiceTypes: { createMany: { data: [{ title: "Ano" }, { title: "Ne" }] } },
            f1PredictionType: { connect: { id: selectedPredictionID } },
            endTime: endTime,
            f1weekendparts: { connect: selectedWeekendParts },
            author: {
                connect: {
                    email: session.user.email
                }
            }
        }
    })
    res.json(result)
    setTimeout(async () => {
        const recentQuestions = await prisma.f1Question.findMany({ select: { id: true } })
        var highestID = 0
        for (var recentQuestion of recentQuestions) {
            highestID = Math.max(highestID, recentQuestion.id)
        }
        if (result.id < highestID) {
            //there is a newer question
            return
        }
        const users = await prisma.user.findMany({
            select: {
                name: true,
                accounts: { where: { provider: "discord" }, select: { providerAccountId: true } },
                id: true
            }
        })
        const bot = new Discord.Client({ intents: [new IntentsBitField(32767)] })
        await bot.login(process.env.DISCORD_TOKEN)
        for (var user of users) {
            // if (user.accounts[0].providerAccountId !== "255345748441432064") {
            //     return
            // }
            // console.log("passed user")
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
                    endTime: true,
                    // correctChoiceID: true,
                    // title: true
                }
            })
            var unansweredQuesionCount = 0
            var errorQuesions = 0
            var lateAnses = 0
            var maxPoints = 0
            for (var questionL of questions) {
                maxPoints++
                if (questionL.ChoiceTypes) {
                    //Find answer
                    const anses = questionL.ChoiceTypes.filter((val) => { return !!val.choices[0] })
                    if (anses.length === 0) {
                        if (questionL.endTime > new Date()) {
                            unansweredQuesionCount++
                        }
                        else {
                            lateAnses++
                        }
                    }
                    else if (anses.length !== 1) {
                        console.log(`Weird amount of anses (${anses.length})`)
                        errorQuesions++
                    }
                }
            }
            // console.log({ unansweredQuesionCount, lateAnses, errorQuesions, maxPoints })
            try {
                if (unansweredQuesionCount > 0) {
                    (await bot.users.fetch(user.accounts[0].providerAccountId)).send(`Čus, sorry že ruším, ale stále ti chybí zodpovědět na ${unansweredQuesionCount} otázek, tak šupito presto na to odpověz, byla by přece škoda, kdyby si ztratil bodíky a když už tam budeš můžeš vytvořit nové ;) (Pokud najdeš nějaký problém, stačí kontaktovat Ontro#6947) https://www.ontro.cz/f1`)
                    console.log(`Message sent to ${user.name} at ${new Date().toISOString()}`);
                }
            }
            catch (err) {
                console.log(`Error while sending discord notification to ${user.name}`, err)
            }
        }
    }, 300000)
    //300 000 ms = 5 min
}