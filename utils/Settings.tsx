import React, { useRef, useState } from 'react'
import { Questionaire, Key, Config } from '../pages/zkouseni'
import Close from '../public/close.svg'
import { Lang, LanguageSelect } from './lang'
import styles from '../styles/Zkouseni.module.css'
import Image from 'next/image'
var chyba = (code: string) => {
    alert(`Ondřej to zase posral, tohle by mu snad mělo pomoct opravit tento problém: ${code}`)
}

type Props = {
    from: number,
    end: number,
    changeFrom: (event: any) => void,
    changeEnd: (event: any) => void,
    changeAskForSecond: (event: any) => void,
    questionaire: Questionaire,
    areSettingsOpen: boolean,
    setAreSettingsOpen: (arg0: boolean) => void,
    loadKeys: (arg0: string) => void,
    nextKeys: string[],
    setNextKeys: (arg0: string[]) => void,
    lang: number,
    setLang: (arg0: number) => void,
    config: Config
}

export default function Settings(props: Props) {

    //TODO:  Closing framer Animation
    const { from, end, changeFrom, config, changeEnd, changeAskForSecond, questionaire, areSettingsOpen, setAreSettingsOpen, loadKeys, nextKeys, setNextKeys, lang, setLang } = props

    const [keyPath, setKeyPath] = useState(localStorage.getItem('keyUrl') || '')

    const nextKeysRow = useRef()

    var isSwitchable = typeof config.isSwitchable === "undefined" ? true : config.isSwitchable

    console.log(isSwitchable)

    const updateNextKeys = () => {
        var arr = []
        console.log(nextKeysRow)
        //@ts-expect-error
        if (!nextKeysRow.current.children) {
            chyba("589")
            return
        }
        //@ts-expect-error
        for (var label of nextKeysRow.current.children) {
            console.log(label.textContent === "Space")
            if (label.children[0].checked) {
                arr.push(label.textContent === "Space" ? " " : label.textContent)
            }
        }
        setNextKeys(arr)
    }

    const inputKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            loadKeys(keyPath)
        }
    }

    const changeKeyPath = (event: any) => {
        setKeyPath(event.target.value)
    }

    return (
        <div className={styles.settingsContainerWindow}>
            <div className={styles.settingsContainer} >
                <div className="settings-row space-between">
                    <LanguageSelect lang={lang} setLang={setLang} />
                    <div className={styles["closeContainer"]}>
                        <Image src={Close} className={styles["close"]} alt="close" objectFit='contain' layout='fill' onClick={(event: any) => {
                            setAreSettingsOpen(!areSettingsOpen)
                        }} />
                    </div>
                </div>
                <div className={styles.textInputTitle}>{`${Lang(lang, ["URL to JSON with answer keys", "URL adresa pro JSON s odpovědmi"])}:`}</div>
                <div className="settings-row space-between">
                    <textarea className="text-input flex-grow" style={{ marginRight: '1em' }} value={keyPath} onKeyDown={inputKeyDown} onChange={changeKeyPath} />
                    <button className={styles["button"]} style={{ margin: '.2em 0 .2em 0em' }} onClick={() => {
                        loadKeys(keyPath.trim())
                    }}>{Lang(lang, ["Confirm", "Potvrdit"])}</button>
                </div>
                <div className={styles.textInputTitle}> {Lang(lang, ["Select questions from to:", "Vybírej odpovědi od do:"])}</div>
                <div className="settings-row flex-center">
                    <input type="number" className="num-selection" value={from} onChange={changeFrom} />
                    <input type="number" className="num-selection" value={end} onChange={changeEnd} />
                </div>
                {
                    isSwitchable &&
                    <>
                        <div className={styles.textInputTitle}> {Lang(lang, ["Question -> Answer", "Otázka -> Odpověď"])}</div>
                        <div className="settings-row space-around">
                            <label className="radio-container">
                                <input type="radio" value="1" name="quest" className="radio" onChange={changeAskForSecond} defaultChecked={true} /> {questionaire.key1}
                            </label>
                            <label className="radio-container">
                                <input type="radio" value="2" name="quest" className="radio" onChange={changeAskForSecond} /> {questionaire.key2}
                            </label>
                        </div>
                    </>
                }
                <div className={styles.textInputTitle}>{Lang(lang, ["Skip to next question by:", "Přeskoč na další otázku pomocí:"])}</div>
                {/*@ts-expect-error */}
                <div className="settings-row space-around" ref={nextKeysRow}>
                    <label className="radio-container">
                        <input onChange={updateNextKeys} className="radio" type="checkbox" defaultChecked={nextKeys.indexOf("Enter") !== -1} />Enter
                    </label>
                    <label className="radio-container">
                        <input onChange={updateNextKeys} className="radio" type="checkbox" defaultChecked={nextKeys.indexOf(" ") !== -1} />Space
                    </label>
                </div>
            </div >
        </div>
    )
}