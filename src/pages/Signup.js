import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Signup.css";
import { useSignupMutation } from "../services/appApi";

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [lastname, setLastname] = useState("");
    const [phone, setPhone] = useState("");
    const [signup, { error, isLoading, isError }] = useSignupMutation();

    function handleSignup(e) {
        e.preventDefault();
        signup({ name, lastname, email, phone, password });
    }

    return (
        <Container>
            <Row>
                <Col md={6} className="signup__form--container">
                    <Form style={{ width: "100%" }} onSubmit={handleSignup}>
                        <h1>Створити аккаунт</h1>
                        {isError && <Alert variant="danger">{error.data}</Alert>}
                        <Form.Group>
                            <Form.Label>Ім'я</Form.Label>
                            <Form.Control type="text" placeholder="Ім'я" value={name} required onChange={(e) => setName(e.target.value)} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Прізвище</Form.Label>
                            <Form.Control type="text" placeholder="Прізвище" value={lastname} required onChange={(e) => setLastname(e.target.value)} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Телефон</Form.Label>
                            <Form.Control type="text" placeholder="e.g. 0991234567" value={phone} pattern="[0-9]{3}[0-9]{3}[0-9]{4}" required onChange={(e) => setPhone(e.target.value)} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Email" value={email} required onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control type="password" placeholder="Пароль" value={password} minlength="8" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"  required  onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>

                        <Form.Group>
                            <Button className="btn_orange shadow-none" type="submit" disabled={isLoading}>
                            Створити аккаунт
                            </Button>
                        </Form.Group>
                        <p className="pt-3 text-center">
                            Маєте вже створений аккаунт? <Link to="/login">Увійти</Link>{" "}
                        </p>
                    </Form>
                </Col>
                <Col md={6} className="signup__image--container"></Col>
            </Row>
        </Container>
    );
}

export default Signup;
