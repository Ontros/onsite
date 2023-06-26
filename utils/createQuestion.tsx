import { PrismaClient } from "@prisma/client"
import { NextPage } from "next"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useState } from "react"
import { weekendPart } from "../pages/api/f1/getQuestions"
import styles from '../styles/f1.module.css'
import Settings from "./Settings"

interface f1Props {
    langCookie: string
    selectedPredictionID: number
    getQuestions: (id: number) => Promise<void>
    allWeekendParts: weekendPart[]
}


const Index: NextPage<f1Props> = ({ langCookie, selectedPredictionID, getQuestions, allWeekendParts }) => {
    const [question, setQuestion] = useState("")
    const [selectedWeekendParts, setSelectedWeekendParts] = useState<boolean[]>(allWeekendParts.map(() => { return false }))
    const [endDate, setEndDate] = useState<null | string>(null)

    const updateEndTime = async (localSelected: boolean[]) => {
        var validWeekendParts = allWeekendParts.filter((val, id) => { return localSelected[id] })
        var minEndTime: Date | null = null
        await validWeekendParts.forEach(val => {
            if (!minEndTime || minEndTime > val.endTime) {
                minEndTime = val.endTime
            }
        })

        if (!minEndTime) {
            setEndDate(null)
            return
        }

        setEndDate(minEndTime)
    }

    return (
        <div className="flex flex-column flex-center">
            <h1 className={styles["title"]}>Formulky Vytvareni Otazek</h1>
            <h2>Otázka:</h2>
            <input value={question} onChange={(event) => { setQuestion(event.target.value) }} type="text" className="text-input" />
            <h2>Vyber na které části závodu se otázka vztahuje:</h2>
            {allWeekendParts.map((val, id) => {
                return <div key={id}>
                    <input type="checkbox" name={val.name} id={val.id.toString()} onChange={(event) => {
                        var localSelected = selectedWeekendParts
                        localSelected[id] = !localSelected[id]
                        setSelectedWeekendParts(localSelected)
                        updateEndTime(localSelected)
                    }} />
                    {val.name}
                </div>
            })}
            <h2 className={styles["timeLabel"]}>Konečný čas:</h2>
            <div className={styles["timeData"]}>{endDate ? new Date(endDate).toLocaleString() : "No end time"}</div>
            <h2 className={styles["timeLabel"]}>Odpovědi:</h2>
            <div className={styles["timeData"]}>Ano/Ne</div>
            <br />
            <button onClick={async () => {
                try {
                    if (!question) {
                        alert("Nezadal si otázku!")
                        return
                    }

                    if (!endDate) {
                        alert("Nezadal si část víkendu!")
                        return
                    }

                    const body = { question, selectedPredictionID, endTime: new Date(endDate).toISOString(), selectedWeekendParts: allWeekendParts.map((val) => { return { id: val.id } }).filter((val, id) => { return selectedWeekendParts[id] }) }

                    const result = await fetch(`/api/f1/createQuestion`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body),
                    })

                    if (result.ok) {
                        getQuestions(selectedPredictionID)
                        alert("Otazka vytvorena!")
                        setQuestion("")
                    }
                    else {
                        try {
                            var json = await result.json()
                            alert(json.message)
                        }
                        catch {
                            alert("error")
                            console.log("error", result.status)
                        }
                    }
                } catch (error) {
                    alert("Some data is missing!")
                    console.error(error)
                }
            }}>Potvrdit vytváření!</button>
            <br />
        </div>
    )
}
export default Index