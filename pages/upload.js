import Layout from "../components/layout/user";
import {useForm} from "react-hook-form";
import {Button, ProgressBar} from "react-bootstrap";
import {useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";
import {css} from "@emotion/react";

const gridTemplate = css`
    display: grid;
  row-gap: 20px;
`

export default function UploadPage() {
    const router = useRouter();
    const {register, handleSubmit, errors} = useForm();
    const [video, setVideo] = useState(null);
    const [progress, setProgress] = useState(0);
    const [uid, setUid] = useState('');

    const uploadAndGetUid = async () => {
        const formData = new FormData();
        formData.append('video', video);
        const res = await axios.post("/api/videos", formData, {
            onUploadProgress(e) {
                const completedPercentage = Math.round(e.loaded * 100 / e.total);
                setProgress(completedPercentage);
            }
        });
        return res.data.uid;
    }

    const onSubmitVideo = () => {
        uploadAndGetUid().then(setUid);
    }

    const onSubmitDetails = async data => {
        const receivedUid = uid || await uploadAndGetUid();
        const formData = new FormData();
        formData.append('poster', data.poster[0]);
        formData.append('title', data.title);
        formData.append('description', data.description);
        await axios.put(`/api/videos/${receivedUid}`, formData);
        await router.replace(`/${receivedUid}`);
    }

    const handleSetFile = e => {
        const files = e.target.files;
        if (files?.length) setVideo(files[0]);
    }

    return (
        <Layout>
            <div css={gridTemplate} className="my-2">
                <label htmlFor="video">video</label>
                <input className="form-control" type="file" id="video" onChange={handleSetFile}/>
                <Button disabled={!video || progress} variant="outline-success" className="shadow-none"
                        onClick={onSubmitVideo}>Upload</Button>
                <ProgressBar variant="success" now={progress}/>
            </div>
            <form css={gridTemplate} onSubmit={handleSubmit(onSubmitDetails)}>
                <label htmlFor="title">title</label>
                <input className="form-control" type="text" id="title" {...register('title')} />
                <label htmlFor="description">description</label>
                <textarea className="form-control" id="description" {...register('description')} />
                <label htmlFor="poster">poster</label>
                <input className="form-control" type="file" id="poster" {...register('poster')} />
                <Button disabled={!video} variant="outline-success" className="shadow-none" type="submit">Save</Button>
            </form>
        </Layout>
    )
}