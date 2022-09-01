/* eslint-disable react-hooks/exhaustive-deps */
import { NextPage } from "next"
import { signIn, signOut, useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useLanguage } from '../../states/useLanguage'
import styles from '../../styles/f1.module.css'
import prisma from '../../utils/prisma'
import Countdown from "react-countdown"
import { Lang, LanguageSelect } from '../../utils/lang'
import UserProfile from "../../utils/UserProfile"
import { F1PredictionType } from "@prisma/client"
import CreateQuestion from "../../utils/createQuestion"
import { weekendPart } from "../api/f1/getQuestions"

//NOTE: button color based on team color
export interface Question {
    question: string,
    answers: Answer[],
    selectedAnswer: number,
    endTime: string,
    f1WeekendParts: weekendPart[]
    id: number
}

interface Answer {
    title: string
    id: number
}

interface f1Props {
    langCookie: string
    dbQuestions: Question[]
    predictionTypes: F1PredictionType[]
}
const Index: NextPage<f1Props> = ({ langCookie, dbQuestions, predictionTypes }) => {
    const { lang, setLang } = useLanguage(langCookie)
    const { data: session } = useSession()
    const [selectedPredictionID, setRawSelectedPredictionID] = useState(1)
    const [selectedArray, setSelectedArray] = useState<number[]>([])
    const [questions, setQuestions] = useState<Question[] | null>(dbQuestions)
    const [selectingPrediction, setSelectingPrediction] = useState(true)
    const [predictionName, setPredictionName] = useState("Select GP!");
    const [allWeekendParts, setAllWeekendParts] = useState<weekendPart[]>([])
    //beacause react doesnt update button classes without running this function :)
    const classesF = () => {
        if (!questions) { return [[]] }
        return questions.map((que, indexT) => {
            return que.answers.map((ans, indexJT) => {
                return `${styles['radioButton']} radio-button ${selectedArray[indexT] === indexJT ? "radio-button-selected" : ""}`
            })
        })
    }
    const [classes, setClasses] = useState<string[][]>(classesF())

    useEffect(() => { if (session) { getSelected(selectedPredictionID, questions) } }, [session])
    useEffect(() => { setClasses(classesF()) }, [selectedArray])
    // useEffect(() => {
    //     getQuestions()
    // }, [selectedPredictionID])
    const setSelectedPredictionID = async (id: number) => {
        setRawSelectedPredictionID(id)
        await getQuestions(id)
    }

    const getQuestions = async (id: number) => {
        const result = await fetch(`/api/f1/getQuestions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ predictionTypeID: id }),
        })
        if (!result.ok) {
            alert("Cannot connect to the dastabase (getQuestions)")
            console.log("error", result.status)
            var json = await result.json()
            console.log(json)
        }
        else {
            // alert("success questions")
            var selec = await result.json()
            console.log(74, selec.questions)
            setQuestions(selec.questions)
            await getSelected(id, selec.questions)
            setSelectingPrediction(false)
            setAllWeekendParts(selec.allWeekendParts)
        }
    }

    const getSelected = async (id: number, questionsLocal: Question[] | null) => {
        if (!session?.user?.email) {
            console.log("Login first to view your predictions", session?.user?.email)
            return
        }
        if (!questionsLocal) {
            // alert(" no quest")
            return
        }
        const result = await fetch(`/api/f1/getSelected`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ questions: questionsLocal, predictionTypeID: id, userEmail: session.user.email }),
        })
        if (!result.ok) {
            alert(`Cannot connect to the dastabase (getSelected) ${id}`)
            console.log("error", result.status)
            var json = await result.json()
            console.log(json)
        }
        else {
            // alert("success sellectet")
            var selec = await result.json()
            setSelectedArray(selec)
            var type = predictionTypes.find((type) => { return type.id === id })?.name
            if (type) {
                setPredictionName(type)
            }
        }
    }

    return (
        <>
            <nav className={styles["nav"]}>
                <div className={styles["navSideElement"]} >
                    {/* <Image className={styles["hamburger"]} src={hamburger} alt="hamburgermenu" /> */}
                    <LanguageSelect lang={lang} setLang={setLang} />
                </div>
                <h1 onClick={() => { setSelectingPrediction(!selectingPrediction); setPredictionName("Select GP!") }}
                    className={styles["title"]}>
                    {/* {`F1 - ${predictionTypes.find((val) => { return val.id === selectedPredictionID })?.name}`} */}
                    {`F1 - ${predictionName}`}
                </h1>
                <div className={styles["navSideElement"]}>
                    <UserProfile session={session} />
                </div>
            </nav>
            <div className="flex flex-column flex-center">
                {!selectingPrediction ?
                    <div className={styles["questionsContainer"]}>
                        <br />
                        {questions?.map((question, index) => {
                            if (!question || !classes) {
                                return <></>
                            }
                            var leedingText = question.f1WeekendParts.map(val => { return val.name }).join(" + ")
                            if (leedingText) {
                                leedingText += ":"
                            }
                            return (
                                <div key={index} className={`${styles["questionContainer"]}`}>
                                    <div className={styles["leedingText"]}>{leedingText}</div>
                                    <div className={styles["question"]}>{question.question}<Countdown className={styles["countdown"]} date={new Date(question.endTime)}></Countdown></div>
                                    <div className={styles["questionButtons"]}>
                                        {question.answers.map((answer, indexJ) => {
                                            if (isNaN(indexJ) || !classes[index] || isNaN(index) || !questions) {
                                                console.log(`missing a${indexJ} b${!classes} c${index}`)
                                                return <></>
                                            }
                                            // return
                                            // alert(``)
                                            return (
                                                <button key={indexJ} className={classes[index][indexJ]}
                                                    onClick={async () => {

                                                        if (!session?.user?.email) {
                                                            alert("Login first")
                                                            return
                                                        }
                                                        var selectedArrayTemp = selectedArray
                                                        selectedArrayTemp[index] = indexJ
                                                        setSelectedArray(selectedArrayTemp)
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
                                                            getSelected(selectedPredictionID, questions)
                                                        }
                                                    }}>
                                                    {answer.title}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>)
                        })}
                        {/* <Link passHref href={"/f1/createQuestion"}>
                            <button onClick={() => { }}>Create New Question!</button>
                        </Link> */}
                        <CreateQuestion allWeekendParts={allWeekendParts} langCookie={langCookie} selectedPredictionID={selectedPredictionID} getQuestions={getQuestions} />
                    </div> :
                    //Selecting
                    <div className={styles["predictionTypeContainer"]}>
                        {predictionTypes.map((predictionType) => {
                            return (<div key={predictionType.id} className={styles["predictionType"]} onClick={() => {
                                // alert(`ok click select -${predictionType.id}`)
                                setSelectedPredictionID(predictionType.id)
                            }}>{predictionType.name}</div>)
                        })}
                    </div>
                }
            </div>
        </>
    )
}
export default Index

export async function getServerSideProps() {
    //NOTE: change prediction type ID, make it dynamic and stuff, great comment, thanks mate
    const predictionTypes = await prisma.f1PredictionType.findMany()
    return {
        props: {
            // dbQuestions,
            predictionTypes
        }
    }
}