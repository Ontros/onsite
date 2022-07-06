import { NextPage } from "next"
import { signIn, signOut, useSession } from "next-auth/react"
import { useState } from "react"
import { useLanguage } from '../../states/useLanguage'
import styles from '../../styles/f1.module.css'
import Image from 'next/image'
import prisma from '../../utils/prisma'
import Link from "next/link"

//NOTE: button color based on team color
interface Question {
    question: string,
    answers: string[],
    selectedAnswer: number,
    endTime: String
}

interface f1Props {
    langCookie: string
    dbQuestions: Question[]
}
const Index: NextPage<f1Props> = ({ langCookie, dbQuestions }) => {
    // const { lang, setLang } = useLanguage(langCookie)
    const [selectedArray, setSelectedArray] = useState<number[]>([0])
    const [questions, setQuestions] = useState<Question[]>(dbQuestions)
    const classesF = () => {
        return questions.map((que, indexT) => {
            return que.answers.map((ans, indexJT) => { return `${styles['radioButton']} radio-button ${selectedArray[indexT] === indexJT ? "radio-button-selected" : ""}` })
        })
    }
    const [classes, setClasses] = useState<string[][]>(classesF())


    var selectedPredictionID = 1;

    const { data: session } = useSession()

    return (
        <div className="flex flex-column flex-center">
            <h1 className={styles["title"]}>Formulky</h1>
            <div>
                {session?.user?.email}
                <br />
                {session?.user?.name}
                <br />
                {session?.user?.image ? <Image src={session?.user?.image}
                    alt="Profile Pic" height={200} width={200}
                /> : ""}
                <br />
                <button onClick={() => { signIn() }}>Log in</button>
                <br />
                <button onClick={() => { signOut() }}>Log out</button>
                <br />
                <Link passHref href={"/f1/createQuestion"}>
                    <button onClick={() => { }}>Create New!</button>
                </Link>
            </div>
            <div className={styles["questionsContainer"]}>
                {questions.map((question, index) => {
                    return (
                        <div key={index} className={`${styles["questionContainer"]}`}>
                            <div className={styles["question"]}>{question.question}</div>
                            <div className={styles["questionButtons"]}>
                                {question.answers.map((answer, indexJ) => {
                                    return (
                                        <button key={indexJ} className={classes[index][indexJ]}
                                            onClick={() => {
                                                var selectedArrayTemp = selectedArray
                                                selectedArrayTemp[index] = indexJ
                                                setSelectedArray(selectedArrayTemp)

                                                setClasses(classesF())
                                            }}>
                                            {answer}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>)
                })}
            </div>
        </div>
    )
}
export default Index

export async function getServerSideProps() {
    //NOTE: change prediction type ID, make it dynamic and stuff, great comment, thanks mate
    var f1PredictionTypeId = 1
    const Questions = await prisma.f1Question.findMany({
        where: { f1PredictionTypeId },
        select: {
            title: true,
            endTime: true,
            ChoiceTypes: {
                select: {
                    title: true
                }
            }
        }
    })
    const dbQuestions: Question[] = Questions.map((val) => {
        return {
            question: val.title,
            answers: val.ChoiceTypes.map((value) => {
                return value.title
            }),
            selectedAnswer: 0,
            endTime: val.endTime.toISOString()
        }
    })
    return {
        props: {
            dbQuestions
        }
    }
}