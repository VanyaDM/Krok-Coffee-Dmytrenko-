import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "../services/appApi";

function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [alertMessage, setAlertMessage] = useState("");
    const [createOrder, { isLoading, isError, isSuccess }] = useCreateOrderMutation();
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [post_index, setPost_index] = useState("");
    const [address, setAddress] = useState("");
    const [paying, setPaying] = useState("");

    async function handlePay(e) {
        e.preventDefault();
        if (!stripe || !elements || user.cart.count <= 0) return;
        setPaying(true);
        const { client_secret } = await fetch("http://localhost:8080/create-payment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer ",
            },
            body: JSON.stringify({ amount: user.cart.total }),
        }).then((res) => res.json());
        const { paymentIntent } = await stripe.confirmCardPayment(client_secret, {
            payment_method: {
                card: elements.getElement(CardElement),
            },
        });
        setPaying(false);

        if (paymentIntent) {
            createOrder({ userId: user._id, cart: user.cart, address, country, city, post_index }).then((res) => {
                if (!isLoading && !isError) {
                    setAlertMessage(`Платіж ${paymentIntent.status}`);
                    setTimeout(() => {
                        // navigate("/orders");
                    }, 3000);
                }
            });
        }
    }

    return (
        <Col className="cart-payment-container">
            <Form onSubmit={handlePay}>
                <Row>
                    {alertMessage && <Alert>{alertMessage}</Alert>}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Ім'я</Form.Label>
                            <Form.Control type="text" placeholder="Ім'я" value={user.name} disabled/>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Прізвище</Form.Label>
                            <Form.Control type="text" placeholder="Прізвище" value={user.lastname} disabled />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Телефон</Form.Label>
                            <Form.Control type="text" placeholder="Телефон" value={user.phone} disabled/>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="text" placeholder="Email" value={user.email} disabled />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={7}>
                        <Form.Group className="mb-3">
                            <Form.Label>Адреса</Form.Label>
                            <Form.Control type="text" placeholder="Адреса" value={address} onChange={(e) => setAddress(e.target.value)} required />
                        </Form.Group>
                    </Col>
                    <Col md={5}>
                        <Form.Group className="mb-3">
                            <Form.Label>Країна</Form.Label>
                            <Form.Control type="text" placeholder="Країна" value={country} onChange={(e) => setCountry(e.target.value)} required />
                        </Form.Group>
                    </Col>
                    <Col md={7}>
                        <Form.Group className="mb-3">
                            <Form.Label>Населений пункт</Form.Label>
                            <Form.Control type="text" placeholder="Населений пункт" value={city} onChange={(e) => setCity(e.target.value)} required />
                        </Form.Group>
                    </Col>
                    <Col md={5}>
                        <Form.Group className="mb-3">
                            <Form.Label>Поштовий індекс</Form.Label>
                            <Form.Control type="text" placeholder="Поштовий індекс" value={post_index} onChange={(e) => setPost_index(e.target.value)} required />
                        </Form.Group>
                    </Col>
                </Row>
                <label htmlFor="card-element">Картка</label>
                <CardElement id="card-element" />
                <Button className="mt-3" type="submit" disabled={user.cart.count <= 0 || paying || isSuccess}>
                    {paying ? "Обробка..." : "Сплатити"}
                </Button>
            </Form>
        </Col>
    );
}

export default CheckoutForm;
