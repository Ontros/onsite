import React, { useEffect, useState } from 'react';
// import './App.css';
import Loading from '../../utils/Loading';
import Selection from '../../utils/Selection';
//@ts-expect-error
import detectBrowserLanguage from 'detect-browser-language'
import { Lang } from '../../utils/lang'
import { useLanguage } from '../../states/useLanguage';
import { NextPage } from 'next';
var chyba = (code: string) => {
    alert(`Ondřej to zase posral, tohle by mu snad mělo pomoct opravit tento problém: ${code}`)
}

export type Questionaire = {
    key1: string,
    key2: string,
    keys: Key,
    config: Config
}

export type Config = {
    isSwitchable?: boolean,
    allowCustomAnswers?: boolean,
    predefinedAnswers?: string[],
    useImages?: boolean
}

const wrongURL = (lang: number) => {
    alert(Lang(lang, ["Something is wrong with the URL you entered (or you might be offline)", "Něco je špatně se zadanou URL (nebo mohl spadnout internet)"]))
    // window.location.reload()
}

function loadKeys(lang: number, path: string, setKey: (arg0: Questionaire) => void, setIsLoading: (arg0: boolean) => void) {
    fetch(path).then((data) => {
        data.json().then((json) => {
            if (!json.key1 || !json.key2 || !json.keys) {
                wrongURL(lang)
                return
            }
            setIsLoading(true)
            setKey(json)
            localStorage.setItem('keyUrl', path)
            setIsLoading(false)
        }).catch(wrongURL)
    }).catch(wrongURL)

}
interface zkouseniProps {
    langCookie: string
}

const App: NextPage<zkouseniProps> = ({ langCookie }) => {
    const { lang, setLang } = useLanguage(langCookie) //1 = czech; 0 = english
    useEffect(() => {
        var url = localStorage.getItem('keyUrl')
        if (!url) {
            fetch('https://raw.githubusercontent.com/Ontros/zkouseni-keys/main/default.txt').then(response => {
                response.text().then((url: string) => {
                    loadKeys(lang, url, setKey, setIsLoading);
                })
            })
        }
        else {
            loadKeys(lang, url, setKey, setIsLoading)
        }
    }, [])

    const updateKeys = (path: string) => {
        loadKeys(lang, path, setKey, setIsLoading)
    }

    //Answer keys
    const [key, setKey] = useState<Questionaire>({ key1: "error", key2: "error", keys: [], config: {} })
    const [isLoading, setIsLoading] = useState<boolean>(true)
    //Language ID

    return isLoading ? <Loading /> : <Selection questionaire={key} loadKeys={updateKeys} lang={lang} setLang={setLang} />
    // return key.key1 !== "error" ? <Selection questionaire={key} loadKeys={updateKeys} /> : <Loading />
}
export type Key = { a: string, b: string }[]


export default App;
