import {InputGroup, Form, Button, Alert, ListGroup} from "react-bootstrap";
import {useEffect, useRef, useState} from "react";
import axios from "axios";

function ExtraTag({tag, video}) {
    const [checked, setChecked] = useState(false);
    useEffect(() => {
        console.log(video);
        if (video.uid) {
            if (checked) {
                axios.post(`/api/admin/videos/${video.uid}/tags`, {tag}).then();
            } else {
                axios.delete(`/api/admin/videos/${video.uid}/tags`, {params: {tag}}).then();
            }
        }
    }, [checked]);
    useEffect(() => {
        if (video.extraTags?.includes(tag)) {
            setChecked(true);
        } else {
            setChecked(false);
        }
    }, [video]);
    return (
        <Form.Check onChange={() => setChecked(!checked)} type="checkbox" label={tag} checked={checked}/>
    )
}

export function VideosDetail() {
    const [video, setVideo] = useState({});
    const [err, setErr] = useState('');
    const videoUidRef = useRef();
    const onSubmit = (e) => {
        e.preventDefault();
        axios.get('/api/admin/videos', {
            params: {
                uid: videoUidRef.current.value
            }
        }).then(res => {
            setVideo(res.data);
            setErr('');
        }).catch(err => {
            setErr(err.response.data.message);
        })
    }
    return (
        <div>
            {err && <Alert variant="danger">{err}</Alert>}
            <Form onSubmit={onSubmit}>
                <InputGroup>
                    <InputGroup.Text id="btnGroupAddon">#</InputGroup.Text>
                    <Form.Control
                        ref={videoUidRef}
                        className="shadow-none"
                        type="text"
                        placeholder="Search by video uid"
                        aria-describedby="btnGroupAddon"
                    />
                    <Form.Control
                        className="shadow-none"
                        type="submit"
                        value="Search"
                    />
                </InputGroup>
            </Form>
            <h3>Video Details</h3>
            <hr/>
            <ListGroup variant="flush">
                <ListGroup.Item>
                    <b>Uid:</b> {video.uid}
                </ListGroup.Item>
                <ListGroup.Item>
                    {/*<b>Extra Tags:</b> {video.extraTags?.map(tag => <Badge key={tag} pill bg="warning" >{tag}</Badge>)}*/}
                    <b>Extra Tags:</b>
                    <ExtraTag tag="restrictions" video={video}/>
                    <ExtraTag tag="dangerous" video={video}/>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex align-items-center">
                    <b>Visible:</b> {video.visible ? 'Yes' : 'No'}
                    {video.visible && <Button className="ms-auto" variant="danger" onClick={() => {
                        axios.delete(`/api/admin/videos/${video.uid}`).then(res => {
                            setVideo(res.data);
                        }).catch(err => {
                            setErr(err.response.data.message);
                        })
                    }}>Make unavailable</Button>}
                </ListGroup.Item>
            </ListGroup>
        </div>
    );
}

export function UsersDetail() {
    const [user, setUser] = useState({});
    const [err, setErr] = useState('');
    const usernameRef = useRef();
    const onSubmit = (e) => {
        e.preventDefault();
        axios.get('/api/admin/users', {
            params: {
                username: usernameRef.current.value
            }
        }).then(res => {
            setUser(res.data);
            setErr('');
        }).catch(err => {
            setErr(err.response.data.message);
        })
    }
    return (
        <div>
            {err && <Alert variant="danger">{err}</Alert>}
            <Form onSubmit={onSubmit}>
                <InputGroup>
                    <InputGroup.Text id="btnGroupAddon">@</InputGroup.Text>
                    <Form.Control
                        ref={usernameRef}
                        className="shadow-none"
                        type="text"
                        placeholder="Search by username"
                        aria-describedby="btnGroupAddon"
                    />
                    <Form.Control
                        className="shadow-none"
                        type="submit"
                        value="Search"
                    />
                </InputGroup>
            </Form>
            <h3>User Details</h3>
            <hr/>
            <ListGroup variant="flush">
                <ListGroup.Item>
                    <b>Uid:</b> {user.uid}
                </ListGroup.Item>
                <ListGroup.Item>
                    <b>Username:</b> {user.username}
                </ListGroup.Item>
                <ListGroup.Item className="d-flex align-items-center">
                    <b>Strike:</b> {user.strike ? 'Yes' : 'No'}
                    {user.strike && <Button className="ms-auto" variant="danger" onClick={() => {
                        axios.delete(`/api/admin/users/${user.uid}/strike`).then(res => {
                            setUser(res.data);
                        }).catch(err => {
                            setErr(err.response.data.message);
                        })
                    }}>disable strike</Button>}
                </ListGroup.Item>
            </ListGroup>
        </div>
    );
}