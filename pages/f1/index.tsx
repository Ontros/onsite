import { NextPage } from "next"
import { useState } from "react"
import { useLanguage } from '../../states/useLanguage'
import styles from '../../styles/f1.module.css'

interface f1Props {
    langCookie: string
}
//NOTE: button color based on team color
interface Question {
    question: string,
    answers: string[],
    selectedAnswer: number
}

const Index: NextPage<f1Props> = ({ langCookie }) => {
    // const { lang, setLang } = useLanguage(langCookie)
    const [selectedArray, setSelectedArray] = useState<number[]>([0])
    const [questions, setQuestions] = useState<Question[]>(
        [
            {
                question: "Dojede Charles Formula 1 Lenovo British Grand Prix 2022?",
                answers: [
                    "Ano", "Ne"
                ],
                selectedAnswer: 0
            },
            {
                question: "Dojede Charles Formula 1 Lenovo British Grand Prix 2022?",
                answers: [
                    "Ano", "Ne", "Možná", "Projede", "Vyjede", "Odjede", "Zajede"
                ],
                selectedAnswer: 0
            },
            {
                question: "Dojede Charles Formula 1 Lenovo British Grand Prix 2022?",
                answers: [
                    "Ano", "Ne"
                ],
                selectedAnswer: 0
            },
            {
                question: "Dojede Charles Formula 1 Lenovo British Grand Prix 2022?",
                answers: [
                    "Ano", "Ne"
                ],
                selectedAnswer: 0
            },
            {
                question: "Dojede Charles Formula 1 Lenovo British Grand Prix 2022?",
                answers: [
                    "Ano", "Ne"
                ],
                selectedAnswer: 0
            },
            {
                question: "Dojede Charles Formula 1 Lenovo British Grand Prix 2022?",
                answers: [
                    "Ano", "Ne"
                ],
                selectedAnswer: 0
            },
            {
                question: "Dojede Charles Formula 1 Lenovo British Grand Prix 2022?",
                answers: [
                    "Ano", "Ne"
                ],
                selectedAnswer: 0
            }
        ]
    )
    const classesF = () => {
        return questions.map((que, indexT) => {
            return que.answers.map((ans, indexJT) => { return `${styles['radioButton']} radio-button ${selectedArray[indexT] === indexJT ? "radio-button-selected" : ""}` })
        })
    }
    const [classes, setClasses] = useState<string[][]>(classesF())


    console.log("f", selectedArray)

    return (
        <div className="flex flex-column flex-center">
            <h1 className={styles["title"]}>Formulky</h1>
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