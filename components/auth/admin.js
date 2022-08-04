import {InputGroup, Form, Button, Alert, ListGroup} from "react-bootstrap";
import {useRef, useState} from "react";
import axios from "axios";

export function VideosDetail() {
    return (
        <div>
            <h1>Videos Detail</h1>
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
            <h3>Users Details</h3>
            <hr/>
            <ListGroup variant="flush">
                <ListGroup.Item>
                    <b>Uid:</b> {user.uid}
                </ListGroup.Item>
                <ListGroup.Item>
                    <b>Username:</b> {user.username}
                </ListGroup.Item>
                <ListGroup.Item>
                    <b>Strike:</b> {user.strike ? 'Yes' : 'No'}
                    {user.strike && <Button variant="danger" onClick={() => {
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