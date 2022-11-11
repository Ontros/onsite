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
    const { data: session } = useSession()
    const [question, setQuestion] = useState("")
    const [date, setDate] = useState("")
    const [time, setTime] = useState("")
    const [selectedWeekendParts, setSelectedWeekendParts] = useState<boolean[]>(allWeekendParts.map(() => { return false }))

    const updateEndTime = async (localSelected: boolean[]) => {
        var validWeekendParts = allWeekendParts.filter((val, id) => { return localSelected[id] })
        var minEndTime: Date | null = null
        await validWeekendParts.forEach(val => {
            if (!minEndTime || minEndTime > val.endTime) {
                minEndTime = val.endTime
            }
        })

        if (!minEndTime) {
            setDate("")
            setTime("")
            return
        }
        //Typescript doesnt know that it will always be valid
        //@ts-ignore
        var minEndTimeString: string = minEndTime

        setDate(minEndTimeString.split("T")[0])
        //NOTE: Time zone
        setTime((parseInt(minEndTimeString.split("T")[1].split(":")[0]) + 1) + ":" + minEndTimeString.split("T")[1].split(":")[1])

        console.log(minEndTime)
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
            <h2 className={styles["timeLabel"]}>Konečné datum:</h2>
            <div className={styles["timeData"]}>{date ? date : "No end date"}</div>
            <h2 className={styles["timeLabel"]}>Konečný čas:</h2>
            <div className={styles["timeData"]}>{time ? time : "No end time"}</div>
            <h2 className={styles["timeLabel"]}>Odpovědi:</h2>
            <div className={styles["timeData"]}>Ano/Ne</div>
            <br />
            <button onClick={async () => {
                try {
                    if (!question) {
                        alert("Nezadal si otázku!")
                        return
                    }

                    if (!date || !time) {
                        alert("Nezadal si část víkendu!")
                        return
                    }
                    var localTime = time

                    if (time.split(":")[0].length === 1) {
                        localTime = "0" + time
                        // setTime(localTime)
                    }

                    const body = { question, selectedPredictionID, endTime: new Date(`${date}T${localTime}:00.000`).toISOString(), selectedWeekendParts: allWeekendParts.map((val) => { return { id: val.id } }).filter((val, id) => { return selectedWeekendParts[id] }) }

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