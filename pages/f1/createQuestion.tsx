import { PrismaClient } from "@prisma/client"
import { NextPage } from "next"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useState } from "react"
import styles from '../../styles/f1.module.css'

interface f1Props {
    langCookie: string
}


const Index: NextPage<f1Props> = ({ langCookie }) => {
    const { data: session } = useSession()
    const [question, setQuestion] = useState("")
    const [date, setDate] = useState("")
    const [time, setTime] = useState("")
    console.log(question, date, time)
    var selectedPredictionID = 2;
    return (
        <div className="flex flex-column flex-center">
            <h1 className={styles["title"]}>Formulky Vytvareni Otazek</h1>
            {session ? `You are logged in as: ${session?.user?.name}!` : "You are not logged in!"}
            <h3>Otázka:</h3>
            <input value={question} onChange={(event) => { setQuestion(event.target.value) }} type="text" className="text-input" />
            <h3>Konečné datum</h3>
            <input value={date} onChange={(event) => { setDate(event.target.value) }} type="date" />
            <h3>Konečný čas</h3>
            <input value={time} onChange={(event) => { setTime(event.target.value) }} type="time" />
            <h3>Odpovědi:</h3>
            Ano/Ne
            <br />
            <button onClick={async () => {
                try {
                    const body = { question, selectedPredictionID, endTime: `${date}T${time}:00.000Z` }

                    const result = await fetch(`/api/f1/createQuestion`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body),
                    })

                    if (result.ok) {
                        alert("Otazka vytvorena!")
                        setQuestion("")
                    }
                    else {
                        alert("error")
                        console.log("error", result.status)
                    }
                } catch (error) {
                    console.error(error)
                }
            }}>Potvrdit vytváření!</button>
            <Link passHref href={"/f1"}>
                <button onClick={() => { }}>Go Back to answering!</button>
            </Link>
        </div>
    )
}
export default Index