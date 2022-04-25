import { useRouter } from 'next/router'
import React, { ChangeEvent, useState } from 'react'

function Login() {
    const router = useRouter()
    const [url, setUrl] = useState("https://www.gvozznamky.gyvolgova.cz/")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    function handleChangeUrl(event: ChangeEvent<HTMLInputElement>) {
        setUrl(event.target.value)
    }
    function handleChangeUsername(event: ChangeEvent<HTMLInputElement>) {
        setUsername(event.target.value)
    }
    function handleChangePassword(event: ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value)
    }
    return (
        <form action="/bakalari/">
            <label htmlFor="url">Address</label>
            <input id="url" type="text" value={url} onChange={handleChangeUrl} />
            <label htmlFor="username">Username</label>
            <input id="username" type="text" value={username} onChange={handleChangeUsername} />
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={handleChangePassword} />
            <button onClick={async (e) => {
                e.preventDefault()
                const response = await fetch(url + "api/login", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `client_id=ANDR&grant_type=password&username=${username}&password=${password}`
                })
                const json = await response.json()
                console.log(json)
                localStorage.setItem("bakalariAccessToken", json.access_token)
                localStorage.setItem("bakalariURL", url)
                router.push("/bakalari/")
            }}>Submit</button>
        </form>
    )
}

export default Login