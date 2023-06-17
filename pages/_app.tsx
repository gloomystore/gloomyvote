import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import ReactQueryProvider from "./ReactQueryProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ReactQueryProvider>
      <Component {...pageProps} />
    </ReactQueryProvider>
  )
}
