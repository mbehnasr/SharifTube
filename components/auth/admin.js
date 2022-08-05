import {InputGroup, Form, Button, Alert, ListGroup, Row} from "react-bootstrap";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import useSWR from "swr";

function ExtraTag({tag, video}) {
    const [checked, setChecked] = useState(false);
    useEffect(() => {
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
    // const [users, setUsers] = useState([]);
    const [err, setErr] = useState('');
    const usernameRef = useRef();
    const {data: users} = useSWR('/api/admin/users', async () => (await axios.get('/api/admin/users')).data);

    const setUserByUsername = (username) => {
        axios.get('/api/admin/users', {
            params: {username}
        }).then(res => {
            setUser(res.data);
            setErr('');
        }).catch(err => {
            setErr(err.response.data.message);
        })
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if (usernameRef.current.value) {
            setUserByUsername(usernameRef.current.value);
        } else {
            setErr('Please enter a username');
        }
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
            <Row>
                <div className="col-12 col-md-6">
                    <h3>User Details</h3>
                    <hr/>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <b>Uid:</b> {user.uid}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <b>Username:</b> {user.username}
                        </ListGroup.Item>
                        {user.roles?.includes('user') && <ListGroup.Item className="d-flex align-items-center">
                            <b>Strike:</b> {user.strike ? 'Yes' : 'No'}
                            {user.strike && <Button className="ms-auto" variant="danger" onClick={() => {
                                axios.delete(`/api/admin/users/${user.uid}/strike`).then(res => {
                                    setUser(res.data);
                                }).catch(err => {
                                    setErr(err.response.data.message);
                                })
                            }}>disable strike</Button>}
                        </ListGroup.Item>}
                        {user.roles?.includes('admin') && <ListGroup.Item className="d-flex align-items-center">
                            <b>Verified:</b> {user.verified ? 'Yes' : 'No'}
                            {!user.verified && <Button className="ms-auto" variant="success" onClick={() => {
                                axios.post(`/api/admin/users/${user.uid}/verify`).then(res => {
                                    setUser(res.data);
                                }).catch(err => {
                                    setErr(err.response.data.message);
                                })
                            }}>verify admin</Button>}
                        </ListGroup.Item>}
                    </ListGroup>
                </div>
                <div className="col-12 col-md-6">
                    <ListGroup variant="flush">
                        {users && users.map(user => (
                            <ListGroup.Item key={user.uid} className="cursor-pointer" onClick={() => setUserByUsername(user.username)}>
                                {user.username}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            </Row>
        </div>
    );
}