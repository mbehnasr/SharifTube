import {useForm} from "react-hook-form";
import {Button, Form, ListGroup} from "react-bootstrap";
import axios from "axios";
import {useEffect, useState} from "react";
import Link from "next/link";

export function TicketView({uid}) {
    const [ticket, setTicket] = useState({});
    useEffect(() => {
        axios.get(`/api/tickets/${uid}`).then(res => {
            setTicket(res.data);
        });
    }, [uid]);
    return (
        <div>
            <h3>{ticket.title}</h3>
            <h6>Content</h6>
            <hr/>
            <p>{ticket.content}</p>
            <h6>Answer</h6>
            <hr/>
            <p>{ticket.answer}</p>
            {ticket.hasAttachment && <>
                <h6>Attachment</h6>
                <hr/>
                <Link href={`/api/tickets/${ticket.uid}/attachment`} passHref><Button className="m-2" disabled={!ticket.hasAttachment}>download</Button></Link>
            </>}
            <br/>
            <b>Status: </b>
            {ticket.status}
            <br/>
            <b>Created At: </b>
            {ticket.createdAt}
        </div>
    )
}

export function TicketList({onSelect, eventKey}) {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        axios.get('/api/tickets')
            .then(res => {
                setTickets(res.data);
            })
    }, [eventKey]);

    return (
        <div>
            <ListGroup variant="flush">
                {tickets && tickets.map(ticket => (
                    <ListGroup.Item key={ticket.uid} className="cursor-pointer" onClick={() => onSelect(ticket)}>
                        {ticket.title}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    )
}

export function NewTicketForm({eventKey}) {
    const {register, handleSubmit} = useForm();
    const [ticket, setTicket] = useState(null);

    useEffect(() => {
        setTicket(null);
    }, [eventKey]);

    function onSubmit(data) {
        axios.post('/api/tickets', data)
            .then(res => {
                setTicket(res.data);
            });
    }

    return (
        ticket ?
            <TicketView uid={ticket.uid}/> :
            <Form>
                <Form.Group controlId="ticketTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" placeholder="Enter title" {...register("title")} />
                </Form.Group>
                <Form.Group controlId="ticketContent">
                    <Form.Label>Content</Form.Label>
                    <Form.Control as="textarea" rows="3" placeholder="Enter content" {...register("content")} />
                </Form.Group>
                <Button className="mt-2" type="submit" onClick={handleSubmit(onSubmit)}>
                    Submit
                </Button>
            </Form>
    )
}