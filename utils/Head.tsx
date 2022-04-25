import React from 'react'
//Head React
import HeadR from 'next/head'

function Head() {
    return (
        <HeadR>
            <title>Ontro</title>
            <meta name="description" content="Next.js webpage created by Ontro" />
            <link rel="icon" href="/favicon.ico" />
        </HeadR>
    )
}

export default Head