import { F1Choice, F1ChoiceType } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../utils/prisma'


export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    //TODO security lmao


    const { choiceTypeId, predictionTypeID, userEmail }: { choiceTypeId: number, predictionTypeID: number, userEmail: string } = req.body
    if (userEmail != "ontro512@gmail.com") {
        console.log("Insufficient permission (correct/getSelected)")
        res.status(400).json("insuffiecient permission")
        return
    }

    var prediction = await prisma.f1Prediction.findFirst({ where: { user: { email: userEmail } } })
    if (!prediction) {
        prediction = await prisma.f1Prediction.create({ data: { user: { connect: { email: userEmail } }, f1PredictionType: { connect: { id: predictionTypeID } } } })
    }

    var question = (await prisma.f1ChoiceType.findUnique({ where: { id: choiceTypeId }, select: { question: true } }))?.question

    if (!question) {
        res.status(400).json({ message: "Couldnt find the question" })
        return
    }

    var result: F1ChoiceType | null = null
    const choice = await prisma.f1Choice.findFirst({ where: { choiceType: { questionID: question.id }, predictionID: prediction.id } })
    //if (choice) {
        //update
    result = await prisma.f1ChoiceType.update({ where: { id: choiceTypeId }, data: { correctQuestion: { connect: { id: question.id } } } })
    //}
    //else {
	//console.log(question.id)
        //res.status(400).json("no choice"+question.id)
        //return
    //}


    res.json(result)
}
