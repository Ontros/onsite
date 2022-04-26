import { NextPage } from 'next'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { fetchBakalari, useBakalari } from '../../states/useBakalari'
import { useLanguage, getCookieProp } from '../../states/useLanguage'
import { Lang, LanguageSelect } from '../../utils/lang'

interface bakalariProps {
    langCookie: string
}

export interface OnMark {
    isPoints: boolean;
    weight: number;
    maxPoints?: number;
    mark: number;
    name: string;
}


const Bakalari: NextPage<bakalariProps> = ({ langCookie }) => {
    const { lang, setLang } = useLanguage(langCookie)
    //@ts-expect-error
    const { accessToken, url } = useBakalari()
    const [marksJSON, setMarksJSON] = useState<MarksJSON | null>(null)
    const [onMarks, setOnMarks] = useState<OnMark[] | undefined>(undefined)
    const [subjectID, setSubjectID] = useState(0)
    const [usingPoints, setUsingPoints] = useState(false)
    const [markInput, setMarkInput] = useState(0)
    const [maxPointsInput, setMaxPointsInput] = useState(0)
    const [weightInput, setWeightInput] = useState(0)
    const [average, setAverage] = useState("")
    const [highlitedID, setHiglightedID] = useState(-1)
    useEffect(() => {
        if (url) {
            fetchBakalari(accessToken, url + 'api/3/marks').then(data => {
                data.json().then(json => {
                    console.log(json)
                    setMarksJSON(json)
                })
            })
        }
    }, [accessToken, url])

    function calculateAverage(marksLocal: OnMark[]) {
        if (marksLocal[0].isPoints) {
            var totalMark = 0
            var totalMaxMark = 0
            for (var mark of marksLocal) {
                if (!isNaN(mark.mark) && (mark.maxPoints || mark.maxPoints === 0)) {
                    totalMark += mark.mark * mark.weight
                    totalMaxMark += mark.maxPoints * mark.weight
                }
            }
            setAverage(((totalMark / totalMaxMark) * 100).toFixed(3) + "%")
        }
        else {
            var totalMark = 0
            var totalWeight = 0
            for (var mark of marksLocal) {
                if (!isNaN(mark.mark)) {
                    totalMark += mark.mark * mark.weight
                    totalWeight += mark.weight
                }
            }
            console.log(totalMark, totalWeight)
            setAverage((totalMark / totalWeight).toFixed(3))
        }
    }

    //TODO: handle token expiring
    console.log("onMakr", onMarks)
    return (
        <div className="container">
            <main className="main">
                <div className="title">
                    <h1>Bakalari</h1>
                </div>
                <p>{Lang(lang, ["Subject", "Předmět"])}</p>
                <select name="Subject" id="" className='select-class' onChange={(e) => {
                    setSubjectID(parseInt(e.target.value));
                    setHiglightedID(-1)
                    var MarksJSON = marksJSON?.Subjects[parseInt(e.target.value)].Marks
                    if (!MarksJSON) {
                        return
                    }
                    var IsPoints = MarksJSON[0].IsPoints
                    if (typeof IsPoints == 'boolean') {
                        setUsingPoints(IsPoints)
                        var marksLocal = marksJSON?.Subjects[parseInt(e.target.value)].Marks.map((mark, index) => {
                            var markTemp: OnMark = {
                                isPoints: IsPoints,
                                weight: mark.Weight,
                                maxPoints: mark.MaxPoints,
                                mark: parseInt(mark.MarkText),
                                name: mark.Caption
                            }
                            return markTemp
                        })
                        setOnMarks(marksLocal)
                        if (marksLocal) {
                            calculateAverage(marksLocal)
                        }
                    }

                }}>
                    {marksJSON?.Subjects.map((subject, id) => {
                        return (<option key={id} value={id}>{subject.Subject.Name}</option>)
                    })}
                </select>
                <div className="marks">
                    {onMarks?.map((mark, id) => {
                        function removeOnMark() {
                            if (onMarks) {
                                setHiglightedID(id)
                                setWeightInput(onMarks[id].weight)
                                setMarkInput(onMarks[id].mark)
                                //@ts-expect-error
                                setMaxPointsInput(onMarks[id].maxPoints)
                                if (typeof onMarks[id].maxPoints === "number") {
                                }
                            }
                        }
                        return (
                            !mark.isPoints ?
                                <div onClick={removeOnMark} className={`mark ${highlitedID === id ? "highlighted" : ""}`}>
                                    <div className="mark-caption">{mark.name}</div>
                                    {" "}
                                    <div className="mark-mark">{!mark.mark ? "N" : mark.mark}</div>
                                </div> :
                                <div onClick={removeOnMark} className={`mark ${highlitedID === id ? "highlighted" : ""}`}>
                                    <div className="mark-caption">{mark.name}</div>
                                    {" "}
                                    <div className="mark-mark">
                                        {!mark.mark ? "N" : mark.mark}
                                        /
                                        {mark.maxPoints}
                                    </div>
                                </div>
                        )
                    })}
                </div>
                <form action="">
                    <label htmlFor="mark">{usingPoints ? "Points" : "Mark"}</label>
                    <input id="mark" value={markInput} type="number" onInput={(e) => {
                        //@ts-expect-error
                        setMarkInput(parseInt(e.target.value))
                    }} />
                    {usingPoints && (<>
                        /
                        <label htmlFor="maxPoints">Max Points</label>
                        <input id="maxPoints" value={maxPointsInput} type="number" onInput={(e) => {
                            //@ts-expect-error
                            setMaxPointsInput(parseInt(e.target.value))
                        }} />
                    </>
                    )}
                    <br />
                    <label htmlFor="weight">Weight</label>
                    <input id="weight" type="number" value={weightInput} onInput={(e) => {
                        //@ts-expect-error
                        setWeightInput(parseInt(e.target.value))
                    }} />
                    <button onClick={(e) => {
                        e.preventDefault()
                        var marksLocal = onMarks
                        if (!marksLocal) {
                            alert("no marks")
                            return
                        }

                        if (highlitedID === -1) {
                            marksLocal.push({ mark: markInput, isPoints: usingPoints, name: `Mark ${marksLocal.length + 2}`, weight: weightInput, maxPoints: maxPointsInput })
                            console.log("marksLocal", marksLocal)
                        }
                        else {
                            marksLocal[highlitedID].mark = markInput
                            marksLocal[highlitedID].weight = weightInput
                            marksLocal[highlitedID].maxPoints = maxPointsInput
                        }

                        setOnMarks(marksLocal)
                        setMarkInput(0)
                        setMaxPointsInput(0)
                        setWeightInput(0)
                        setHiglightedID(-1)
                        calculateAverage(marksLocal)
                    }}>Submit</button>
                </form>
                {`Average ${average}`}
                <LanguageSelect lang={lang} setLang={setLang} />
                <Link href={"/"}>Lmao</Link>
                <button onClick={() => {
                    localStorage.setItem('bakalariAccessToken', '')
                    localStorage.setItem('bakalariURL', '')
                }}>Logout</button>
                <div className="checkbox"><input type="checkbox" checked={usingPoints} onChange={() => { setUsingPoints(!usingPoints) }} />{Lang(lang, ["Points", "Body"])}</div>

            </main>
        </div>
    )
}
Bakalari.getInitialProps = getCookieProp

export default Bakalari


export interface MarksJSON {
    Subjects: Subject[];
    MarkOptions: MarkOption[];
}

export interface MarkOption {
    Id: string;
    Abbrev: string;
    Name: string;
}

export interface Subject {
    Marks: Mark[];
    Subject: MarkOption;
    AverageText: string;
    TemporaryMark: string;
    SubjectNote: string;
    TemporaryMarkNote: string;
    PointsOnly: boolean;
    MarkPredictionEnabled: boolean;
}

export interface Mark {
    MarkDate: string;
    EditDate: string;
    Caption: string;
    Theme: string;
    MarkText: string;
    TeacherId: string;
    Type: string;
    TypeNote: string;
    Weight: number;
    SubjectId: string;
    IsNew: boolean;
    IsPoints: boolean;
    CalculatedMarkText: string;
    ClassRankText: null;
    Id: string;
    PointsText: string;
    MaxPoints: number;
}