import {useEffect, useState} from "react";
import {Tab, Tabs, Row, Col, Nav, ListGroup, Badge, Form, Button} from "react-bootstrap";
import {LoginForm, SignupForm} from "./form";
import {DetailsView, UsersDetail, VideosDetail} from "./admin";
import {NewTicketForm, TicketList, TicketView} from "../ticket";
import axios from "axios";
import Link from "next/link";

export function AuthTabs({onSuccess}) {
    const [key, setKey] = useState("login");

    return (
        <Tabs
            id="controlled-tab-forms"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
        >
            <Tab eventKey="login" title="sign in" tabClassName="text-red preserve-color">
                <LoginForm onSuccess={onSuccess}/>
            </Tab>
            <Tab eventKey="signup" title="sign up" tabClassName="text-red preserve-color">
                <SignupForm onSuccess={onSuccess}/>
            </Tab>
        </Tabs>
    )
}

function TicketDetails({item}) {
    const [ticket, setTicket] = useState(item);
    const [answer, setAnswer] = useState(ticket.answer);
    const [status, setStatus] = useState(ticket.status);
    const [attachment, setAttachment] = useState(null);

    const handleSetAttachment = e => {
        const files = e.target.files;
        if (files?.length) setAttachment(files[0]);
    }

    useEffect(() => {
        setTicket(item);
    }, [item]);

    const onSubmit = e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('answer', answer);
        formData.append('status', status);
        if (attachment) formData.append('attachment', attachment);
        axios.patch(`/api/admin/tickets/${ticket.uid}`, formData).then(res => {
            setTicket(res.data);
        });
    }
    return (
        <Form onSubmit={onSubmit}>
            <h4>{ticket.title}</h4>
            <h6>Content</h6>
            <hr/>
            <p>{ticket.content}</p>
            <h6>Answer</h6>
            <hr/>
            <Form.Control as="textarea" name="answer" value={answer} onChange={e => setAnswer(e.target.value)}/>
            <b>Status: </b>
            <Form.Select value={status} onChange={e => setStatus(e.target.value)}>
                <option value="new">New</option>
                <option value="in_progress">In progress</option>
                <option value="solved">Solved</option>
                <option value="closed">Closed</option>
            </Form.Select>
            <b>Attachment: </b>
            <Link href={`/api/tickets/${ticket.uid}/attachment`} passHref><Button className="m-2" disabled={!ticket.hasAttachment}>download</Button></Link>
            <Form.Control type="file" name="attachment" onChange={handleSetAttachment} />
            <br/>
            <b>Created At: </b>
            <span>{ticket.createdAt}</span>
            <br/>
            <Button type="submit" variant="primary">Save</Button>
        </Form>
    )
}

export function AdminTabs() {
    return (
        <Tab.Container id="left-tabs-example" defaultActiveKey="videos">
            <Row>
                <Col sm={3}>
                    <Nav variant="pills" className="flex-column">
                        <Nav.Item>
                            <Nav.Link eventKey="videos" href="#">
                                Videos
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="users" href="#">
                                Users
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="tickets" href="#">
                                Tickets
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>
                <Col sm={9}>
                    <Tab.Content>
                        <Tab.Pane eventKey="videos">
                            <VideosDetail/>
                        </Tab.Pane>
                        <Tab.Pane eventKey="users">
                            <UsersDetail/>
                        </Tab.Pane>
                        <Tab.Pane eventKey="tickets">
                            <DetailsView title="Ticket" endpoint="/api/admin/tickets" searchKey="uid"
                                         Items={({items: tickets, onSelect}) => {
                                             return (
                                                 <ListGroup variant="flush">
                                                     {tickets && tickets.map(ticket => (
                                                         <ListGroup.Item key={ticket.uid} className="cursor-pointer"
                                                                         onClick={() => onSelect(ticket)}>
                                                             <div className="d-flex justify-content-between">
                                                                 {ticket.title}
                                                                 <Badge variant="secondary">{ticket.status}</Badge>
                                                             </div>
                                                         </ListGroup.Item>
                                                     ))}
                                                 </ListGroup>
                                             )
                                         }} Details={TicketDetails}/>
                        </Tab.Pane>
                    </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
    )
}

export function TicketTabs() {
    const [key, setKey] = useState("new");
    const [ticket, setTicket] = useState(null);

    return (
        <Tabs
            id="controlled-tab-forms"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
        >
            <Tab eventKey="new" title="new ticket" tabClassName="text-red preserve-color">
                <NewTicketForm eventKey={key}/>
            </Tab>
            <Tab eventKey="list" title="my tickets" tabClassName="text-red preserve-color">
                {ticket && <TicketView uid={ticket.uid}/>}
                <TicketList eventKey={key} onSelect={t => setTicket(t)}/>
            </Tab>
        </Tabs>
    )
}