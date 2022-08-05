import {useState} from "react";
import {Tab, Tabs, Row, Col, Nav} from "react-bootstrap";
import {LoginForm, SignupForm} from "./form";
import {UsersDetail, VideosDetail} from "./admin";
import {NewTicketForm, TicketList, TicketView} from "../ticket";

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

export function AdminTabs() {
    const [key, setKey] = useState("videos");

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
                    </Nav>
                </Col>
                <Col sm={9}>
                    <Tab.Content>
                        <Tab.Pane eventKey="videos">
                            <VideosDetail />
                        </Tab.Pane>
                        <Tab.Pane eventKey="users">
                            <UsersDetail />
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
                <NewTicketForm eventKey={key} />
            </Tab>
            <Tab eventKey="list" title="my tickets" tabClassName="text-red preserve-color">
                {ticket && <TicketView uid={ticket.uid}/>}
                <TicketList eventKey={key} onSelect={t => setTicket(t)}/>
            </Tab>
        </Tabs>
    )
}