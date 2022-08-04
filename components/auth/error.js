import Layout from "../layout/user";
import Head from "next/head";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";

export default function ForbiddenPage() {

    const router = useRouter();
    const [remainingTime, setRemainingTime] = useState(5);

    useEffect(() => {
        const interval = setInterval(() => {
            setRemainingTime(remainingTime => remainingTime - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (remainingTime <= 0) router.replace('/');
    }, [remainingTime]);

    return (
        <Layout className="shadow py-2 d-flex flex-column justify-content-center align-items-center">
            <Head>
                <title>SharifTube - Forbidden</title>
            </Head>
            <h1>Forbidden</h1>
            <p>You are not permitted to view this page</p>
            <p>You will be redirected to the homepage in {remainingTime} seconds</p>
        </Layout>
    )
}