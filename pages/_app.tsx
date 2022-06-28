import '../styles/globals.css'
import '../styles/bakalari.css'
import type { AppProps } from 'next/app'
import Head from '../utils/Head'
import { LanguageProvider } from '../contexts/language'
import { SessionProvider } from 'next-auth/react'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <SessionProvider session={session}>
        <LanguageProvider>
          <Head></Head>
          <Component {...pageProps} />
        </LanguageProvider>
      </SessionProvider>
    </>

  )
}

export default MyApp
