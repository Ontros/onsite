import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Loading from "../utils/Loading"

export function useBakalari() {
    const router = useRouter()
    const [accessToken, setAccessToken] = useState("")
    const [url, setUrl] = useState("")
    useEffect(() => {
        var token = localStorage.getItem("bakalariAccessToken")
        var url = localStorage.getItem("bakalariURL")
        if (!token) {
            alert("Incorrect login")
            // router.push('/bakalari/login')
        }
        else {
            setAccessToken(token)
            if (url) {
                setUrl(url)
            }
            else {
                alert("url missing")
            }
        }
    }, [router])
    if (!accessToken) {
        return <Loading />
    }
    return { accessToken, url } //NOTE: mby nereturne bo useEffect
}

export function fetchBakalari(accessToken: string, url: string) {
    console.log(accessToken)
    return fetch(url, {
        method: "GET",
        headers: ({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + accessToken
        }),
    })
}