import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import { Alert, Col, Container, Row, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import CheckoutForm from "../components/CheckoutForm";
import { useIncreaseCartProductMutation, useDecreaseCartProductMutation, useRemoveFromCartMutation } from "../services/appApi";
import "./CartPage.css";

const stripePromise = loadStripe("pk_test_51N8A4bB6uaRrI20WEvlQ3EH4PAC5gXMm2axOo58FAefL5So2GRByOhvRor629j139CdRGDlBN2Rsdpo8bwiOIiEL00F6vga8hn");

function CartPage() {
    const user = useSelector((state) => state.user);
    const products = useSelector((state) => state.products);
    const userCartObj = user.cart;
    let cart = products.filter((product) => userCartObj[product._id] != null);
    const [increaseCart] = useIncreaseCartProductMutation();
    const [decreaseCart] = useDecreaseCartProductMutation();
    const [removeFromCart, { isLoading }] = useRemoveFromCartMutation();

    function handleDecrease(product) {
        const quantity = user.cart.count;
        if (quantity <= 0) return alert("Не вдається продовжити");
        decreaseCart(product);
    }

    return (
        <Container style={{ minHeight: "95vh" }} className="cart-container">
            <Row>
                <Col>
                    <h1 className="pt-2 h3">Кошик</h1>
                    {cart.length == 0 ? (
                        <Alert variant="info">Кошик порожній. Додайте товари до свого кошика</Alert>
                    ) : (
                        <Elements stripe={stripePromise}>
                            <CheckoutForm />
                        </Elements>
                    )}
                </Col>
                {cart.length > 0 && (
                    <Col md={5}>
                        <>
                            <Table responsive="sm" className="cart-table">
                                <thead>
                                    <tr>
                                        <th>&nbsp;</th>
                                        <th>Товар</th>
                                        <th>Ціна за один</th>
                                        <th>Кількість</th>
                                        <th>Вартість</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* loop through cart products */}
                                    {cart.map((item) => (
                                        <tr>
                                            <td>&nbsp;</td>
                                            <td>
                                                {!isLoading && <i className="fa fa-times" style={{ marginRight: 10, cursor: "pointer" }} onClick={() => removeFromCart({ productId: item._id, price: item.price, userId: user._id })}></i>}
                                                <img src={item.pictures[0].url} style={{ width: 100, height: 100, objectFit: "cover" }} />
                                            </td>
                                            <td>{item.price} UAH</td>
                                            <td>
                                                <span className="quantity-indicator">
                                                    <i className="fa fa-minus-circle" min="0" onClick={() => handleDecrease({ productId: item._id, price: item.price, userId: user._id })}></i>
                                                    <span>{user.cart[item._id]}</span>
                                                    <i className="fa fa-plus-circle" onClick={() => increaseCart({ productId: item._id, price: item.price, userId: user._id })}></i>
                                                </span>
                                            </td>
                                            <td>{item.price * user.cart[item._id]} UAH</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <div>
                                <h3 className="h4 pt-4" min="0">Сумарна Вартість: {user.cart.total} UAH</h3>
                            </div>
                        </>
                    </Col>
                )}
            </Row>
        </Container>
    );
}

export default CartPage;
