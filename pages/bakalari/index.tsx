import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { fetchBakalari, useBakalari } from '../../states/useBakalari'
import { useLanguage, getCookieProp } from '../../states/useLanguage'
import { LanguageSelect } from '../../utils/lang'

interface bakalariProps {
    langCookie: string
}

const Bakalari: NextPage<bakalariProps> = ({ langCookie }) => {
    const { lang, setLang } = useLanguage(langCookie)
    //@ts-expect-error
    const { accessToken, url } = useBakalari()
    const router = useRouter()
    useEffect(() => {
        if (url) {
            fetchBakalari(accessToken, url + 'api/3/marks').then(data => {
                data.json().then(json => {
                    console.log(json)
                })
            })
        }
    }, [accessToken, url])
    return (
        <div className="container">
            <main className="main">
                <div className="title">
                    <h1>Bakalari</h1>
                </div>
                <LanguageSelect lang={lang} setLang={setLang} />
                <Link href={"/"}>Lmao</Link>
                <button onClick={() => {
                    router.push("/bakalari/login/")
                }}>Login</button>
                <button onClick={() => {
                    router.push("/bakalari/predictor/")
                }}>Predictoe</button>
                <button onClick={() => {
                    localStorage.setItem('bakalariAccessToken', '')
                }}>Logout</button>
            </main>
        </div>
    )
}
Bakalari.getInitialProps = getCookieProp

export default Bakalari

