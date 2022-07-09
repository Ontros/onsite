/* eslint-disable react-hooks/exhaustive-deps */
import { NextPage } from "next"
import { signIn, signOut, useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useLanguage } from '../../states/useLanguage'
import styles from '../../styles/f1.module.css'
import Image from 'next/image'
import prisma from '../../utils/prisma'
import Link from "next/link"
import Countdown from "react-countdown"

//NOTE: button color based on team color
export interface Question {
    question: string,
    answers: Answer[],
    selectedAnswer: number,
    endTime: string
}

interface Answer {
    title: string
    id: number
}

interface f1Props {
    langCookie: string
    dbQuestions: Question[]
}
const Index: NextPage<f1Props> = ({ langCookie, dbQuestions }) => {
    // const { lang, setLang } = useLanguage(langCookie)
    const { data: session } = useSession()
    const [selectedArray, setSelectedArray] = useState<number[]>([])
    const [questions, setQuestions] = useState<Question[]>(dbQuestions)
    //beacause react doesnt update button classes without running this function :)
    const classesF = () => {
        return questions.map((que, indexT) => {
            return que.answers.map((ans, indexJT) => { return `${styles['radioButton']} radio-button ${selectedArray[indexT] === indexJT ? "radio-button-selected" : ""}` })
        })
    }
    const [classes, setClasses] = useState<string[][]>(classesF())

    useEffect(() => { if (session) { getSelected() } }, [session])
    useEffect(() => { setClasses(classesF()) }, [selectedArray])

    const getSelected = async () => {
        if (!session?.user?.email) {
            console.log("Login first to view your predictions", session?.user?.email)
            return
        }
        const result = await fetch(`/api/f1/getSelected`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ questions: questions, predictionTypeID: selectedPredictionID, userEmail: session.user.email }),
        })
        if (!result.ok) {
            alert("Cannot connect to the dastabase (getSelected)")
            console.log("error", result.status)
            var json = await result.json()
            console.log(json)
        }
        else {
            var selec = await result.json()
            setSelectedArray(selec)
        }

    }

    var selectedPredictionID = 1;

    return (
        <div className="flex flex-column flex-center">
            <h1 className={styles["title"]}>Formulky</h1>
            <div>
            </div>
            <div className={styles["questionsContainer"]}>
                {session ? `You are logged in as: ${session?.user?.name}!` : "You are not logged in!"}
                <br />
                {session?.user?.image ? <Image src={session?.user?.image}
                    alt="Profile Pic" height={200} width={200}
                /> : ""}
                <br />
                {session ? <button onClick={() => { signOut() }}>Log out</button> : <button onClick={() => { signIn() }}>Log in</button>}
                <br />
                <Link passHref href={"/f1/createQuestion"}>
                    <button onClick={() => { }}>Create New Question!</button>
                </Link>
                <br />
                <button style={{ marginBottom: "1.5em" }} onClick={() => { getSelected() }}>Refresh selected answers!</button>
                {questions.map((question, index) => {
                    return (
                        <div key={index} className={`${styles["questionContainer"]}`}>
                            <div className={styles["question"]}>{question.question}<Countdown className={styles["countdown"]} date={new Date(question.endTime)}></Countdown></div>
                            <div className={styles["questionButtons"]}>
                                {question.answers.map((answer, indexJ) => {
                                    return (
                                        <button key={indexJ} className={classes[index][indexJ]}
                                            onClick={async () => {

                                                if (!session?.user?.email) {
                                                    alert("Login first")
                                                    return
                                                }
                                                const result = await fetch(`/api/f1/setChoice`, {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ choiceTypeId: answer.id, predictionTypeID: selectedPredictionID, userEmail: session.user.email }),
                                                })
                                                if (!result.ok) {
                                                    console.log("error", result.status)
                                                    var json = await result.json()
                                                    console.log(json)
                                                    if (json.message === "Too late") {
                                                        alert("Too late, unlucky")
                                                    }
                                                    else {
                                                        alert("UNKWN ERROR")
                                                    }
                                                }
                                                else {
                                                    //IF ok
                                                    var selectedArrayTemp = selectedArray
                                                    selectedArrayTemp[index] = indexJ
                                                    setSelectedArray(selectedArrayTemp)

                                                    getSelected()
                                                }
                                            }}>
                                            {answer.title}
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
                    title: true,
                    id: true
                }
            }
        }
    })
    const dbQuestions: Question[] = Questions.map((val) => {
        return {
            question: val.title,
            answers: val.ChoiceTypes.map((value) => {
                return { title: value.title, id: value.id }
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