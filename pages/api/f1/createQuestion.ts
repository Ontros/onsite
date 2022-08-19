import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../utils/prisma'


// POST /api/post
// Required fields in body: title, authorEmail
// Optional fields in body: content
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    //TODO: author
    const { question, selectedPredictionID, endTime } = req.body
    const result = await prisma.f1Question.create({
        data: {
            title: question,
            ChoiceTypes: { createMany: { data: [{ title: "Ano" }, { title: "Ne" }] } },
            f1PredictionType: { connect: { id: selectedPredictionID } },
            endTime: endTime
        }
    })
    res.json(result)
}