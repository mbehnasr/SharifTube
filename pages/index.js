import Head from 'next/head'
import Layout from "../components/layout/user";

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>SharifTube</title>
        <meta name="description" content="Sharif University Video Sharing System" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

    </Layout>
  )
}
