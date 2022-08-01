import Head from 'next/head'
import Image from 'next/image'
import {signIn} from "next-auth/react";
import {useForm} from "react-hook-form";
import axios from "axios";
import {VideoPlayer} from "../components/video";
import Layout from "../components/layout/user";

export default function Home() {
  // const {register, handleSubmit, errors} = useForm();
  //   const onSubmit = data => {
  //       console.log("submitting");
  //       console.log(data.file[0])
  //     const formData = new FormData();
  //         formData.append("poster", data.file[0]);
  //     formData.append("hello", "baby")
  //       axios.post("http://localhost:3000/api/videos/62e6bee45de24df96cecefae", formData, {})
  //   }
  return (
    <Layout className={styles.container}>
      <Head>
        <title>SharifTube</title>
        <meta name="description" content="Sharif University Video Sharing System" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

    </Layout>
  )
}
