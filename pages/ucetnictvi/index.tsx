import { Transaction } from "@prisma/client"
import { NextPage } from "next"
import { Session } from "next-auth"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useLanguage } from "../../states/useLanguage"
import styles from '../../styles/ucetnictvi.module.css'
import { LanguageSelect } from "../../utils/lang"
import UserProfile from "../../utils/UserProfile"

interface ucetnictviProps {
    langCookie: string
}


const Index: NextPage<ucetnictviProps> = ({ langCookie }) => {
    const { lang, setLang } = useLanguage(langCookie)
    const { data: session } = useSession()
    const [description, setDescription] = useState("")
    const [amount, setAmount] = useState(0)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [exchangeRate, setExchangeRate] = useState(24.56)
    console.log(transactions)

    useEffect(() => {
        if (!session) {
            return
        }
        getTransactions(session)
    }, [session])

    useEffect(() => {
        getExchangerates()
    }, [])

    async function getExchangerates() {
        try {
            const result = await fetch(`/api/ucetnictvi/getExchangeRate`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })
            if (!result.ok) {
                alert("Cannot connect to the dastabase (getExchangeRate)")
                console.log("error", result.status)
                var json = await result.json()
                console.log(json)
            }
            else {
                var json = await result.json()
                setExchangeRate(json)
            }
        } catch (error) {
            console.error(error)
        }
    }

    async function getTransactions(session: Session | null) {
        try {
            const result = await fetch(`/api/ucetnictvi/getTransactions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail: session?.user?.email }),
            })
            if (!result.ok) {
                alert("Cannot connect to the dastabase (getTransactions)")
                console.log("error", result.status)
                var json = await result.json()
                console.log(json)
            }
            else {
                var json = await result.json()
                setTransactions(json)
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <nav className={styles["nav"]}>
                <div className={styles["navSideElement"]} >
                    {/* <Image className={styles["hamburger"]} src={hamburger} alt="hamburgermenu" /> */}
                    <LanguageSelect lang={lang} setLang={setLang} />
                </div>
                <div className={styles["navSideElement"]}>
                    <UserProfile session={session} />
                </div>
            </nav>
            <div>
                <h1>List of transactions:</h1>
                {transactions.map((transaction, id) => {
                    return (<div key={id}>
                        {`${id + 1}. ${transaction.description} za ${transaction.amount / 100} EUR neboli ${Math.round((transaction.amount / 100) * exchangeRate)} CZK v čase: ${transaction.creationTime}`}
                    </div>)
                })}
                <hr />
                <h1>Create transaction:</h1>
                Description
                <input type="text" value={description} onChange={(event) => { setDescription(event.target.value) }} />
                <br />
                Amount
                <input type="number" value={amount / 100} onChange={(event) => { setAmount(Math.round(parseFloat(event.target.value) * 100)) }} />
                <br />
                <button onClick={async () => {
                    try {
                        const body = { userEmail: session?.user?.email, description, amount }

                        const result = await fetch(`/api/ucetnictvi/createTransaction`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(body),
                        })

                        if (result.ok) {
                            var json = await result.json()
                            setTransactions(json)
                        }
                        else {
                            alert("error")
                            console.log("error", result.status)
                        }
                    } catch (error) {
                        console.error(error)
                    }
                }}>Confirm</button>
            </div>
        </>
    )
}

export default Index
