import Head from 'next/head';
import App from "../components/App";


export default function Home() {
  return <div style={{width: "100%", height: "100%"}}>
    <Head>
      <title>Create Next App</title>
      <meta name="description" content="Generated by create next app"/>
      <link rel="icon" href="/favicon.ico"/>
    </Head>

    <App />
  </div>
}
