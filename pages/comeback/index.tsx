/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";

type Episode = {
    folder: string;
    answer: string;
    images: string[];
};
function mulberry32(seed: number) {
    return function () {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

export default function Home() {
    const [data, setData] = useState<Episode[]>([]);
    const [current, setCurrent] = useState<{ folder: string; answer: string; src: string } | null>(null);
    const [guess, setGuess] = useState("");
    const [score, setScore] = useState(0);
    const [wrong, setWrong] = useState(0);
    const [streak, setStreak] = useState(0);
    const [result, setResult] = useState("");
    const initialSeed = Date.now() % 100000;
    const [seed, setSeed] = useState(initialSeed); // Default seed
    const [rng, setRng] = useState(() => mulberry32(initialSeed));

    const setSeedAndReset = (newSeed: number) => {
        setSeed(newSeed);
        setRng(() => mulberry32(newSeed));
    };

    useEffect(() => {
        fetch("/api/comeback/images")
            .then(res => res.json())
            .then(setData);
    }, []);

    const normalize = (str: string) =>
        str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const validAnswers = data.map(ep => normalize(ep.answer));

    const loadNewFrame = () => {
        if (!data.length) return;

        const ep = data[Math.floor(rng() * data.length)];
        const img = ep.images[Math.floor(rng() * ep.images.length)];

        setCurrent({
            folder: ep.folder,
            answer: ep.answer,
            src: `/${ep.folder}/${img}`
        });

        setGuess("");
    };

    const submitGuess = () => {
        if (!current) return;
        const guessNorm = normalize(guess);

        if (!guess) {
            setResult("❌ Nezadal jsi odpověď.");
            return;
        }

        if (!validAnswers.includes(guessNorm)) {
            setResult("❌ Neexistující název dílu.");
            return;
        }

        if (guessNorm === normalize(current.answer)) {
            setResult("✅ Správně!");
            setScore(score + 1);
            setStreak(streak + 1);
            loadNewFrame();
        } else {
            setResult(`❌ Špatně. Správná odpověď byla: ${current.answer}`);
            setStreak(0);
            setWrong(wrong + 1);
            setTimeout(loadNewFrame, 2000);
        }
    };


    const report = async () => {
        if (!current) return;
        await fetch("/api/comeback/report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(current),
        });
        alert("Obrázek byl nahlášen.");
        setTimeout(loadNewFrame, 1000);
    };

    useEffect(() => {
        if (data.length) loadNewFrame();
    }, [data]);

    return (
        <div style={{ textAlign: "center", margin: "2em", fontFamily: "sans-serif" }}>
            <h1>Hádej díl Comebacku</h1>
            {current && (
                <img
                    src={"comeback/" + current.src}
                    alt="Náhodný snímek"
                    style={{ maxWidth: "90vw", maxHeight: "70vh", margin: "1em 0", border: "4px solid #ccc" }}
                />
            )}
            <div>
                <input
                    list="episodes"
                    value={guess}
                    onChange={e => setGuess(e.target.value)}
                    placeholder="Napiš název dílu..."
                    style={{ fontSize: "1.2em", width: 300 }}
                    onKeyDown={e => {
                        if (e.key === "Enter") submitGuess();
                    }}
                />
                <datalist id="episodes">
                    {[...new Set(data.map(d => d.answer))].map(name => (
                        <option key={name} value={name} />
                    ))}
                </datalist>
            </div>
            <button onClick={submitGuess}>Odeslat</button>
            <button onClick={report}>Příliš těžký obrázek</button>

            <div className="score" style={{ marginTop: "1em", fontSize: "1.1em" }}>
                <p>{result}</p>
                <p>Správně: {score} | Špatně: {wrong} | Série: {streak}</p>
            </div>
            <input
                type="number"
                placeholder="Zadej seed"
                onChange={e => setSeedAndReset(parseInt(e.target.value))}
            />
        </div>
    );
}
