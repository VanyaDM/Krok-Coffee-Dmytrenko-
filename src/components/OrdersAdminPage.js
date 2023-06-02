import React, { useEffect, useState } from "react";
import { Badge, Button, Modal, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "../axios";
import Loading from "./Loading";
import Pagination from "./Pagination";

function OrdersAdminPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const products = useSelector((state) => state.products);
    const [orderToShow, setOrderToShow] = useState([]);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    function markShipped(orderId, ownerId) {
        axios
            .patch(`/orders/${orderId}/mark-shipped`, { ownerId })
            .then(({ data }) => setOrders(data))
            .catch((e) => console.log(e));
    }

    function showOrder(productsObj) {
        let productsToShow = products.filter((product) => productsObj[product._id]);
        productsToShow = productsToShow.map((product) => {
            const productCopy = { ...product };
            productCopy.count = productsObj[product._id];
            delete productCopy.description;
            return productCopy;
        });
        console.log(productsToShow);
        setShow(true);
        setOrderToShow(productsToShow);
    }

    useEffect(() => {
        setLoading(true);
        axios
            .get("/orders")
            .then(({ data }) => {
                setLoading(false);
                setOrders(data);
            })
            .catch((e) => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <Loading />;
    }

    if (orders.length === 0) {
        return <h1 className="text-center pt-4">Замовлень ще немає</h1>;
    }

    function TableRow({ _id, count, owner, total, status, products, address, city, post_index }) {
        return (
            <tr>
                <td>{_id}</td>
                <td>{owner?.name}<br></br>{owner?.lastname}<br></br></td>
                <td>{owner?.email}<br></br>{owner?.phone}</td>
                <td>{count}</td>
                <td>{total} UAH</td>
                <td>{address}</td>
                <td>{city}</td>
                <td>{post_index}</td>
                <td>
                    {status === "обробка" ? (
                        <Button size="sm" onClick={() => markShipped(_id, owner?._id)}>
                            Позначити як відправлене
                        </Button>
                    ) : (
                        <Badge bg="success">Відправлено</Badge>
                    )}
                </td>
                <td>
                    <span style={{ cursor: "pointer" }} onClick={() => showOrder(products)}>
                        Дивитися замовлення <i className="fa fa-eye"></i>
                    </span>
                </td>
            </tr>
        );
    }

    return (
        <>
            <Table responsive striped bordered hover>
                <thead>
                    <tr>
                        <th>Номер замовлення</th>
                        <th>Замовник</th>
                        <th>Контактні дані</th>
                        <th>Кількість</th>
                        <th>Вартість</th>
                        <th>Адреса</th>
                        <th>Місто</th>
                        <th>Поштовий індекс</th>
                        <th>Статус</th>
                    </tr>
                </thead>
                <tbody>
                    <Pagination data={orders} RenderComponent={TableRow} pageLimit={1} dataLimit={10} tablePagination={true} />
                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Деталі замовлення</Modal.Title>
                </Modal.Header>
                {orderToShow.map((order) => (
                    <div className="order-details__container d-flex justify-content-around py-2">
                        <img src={order.pictures[0].url} style={{ maxWidth: 100, height: 100, objectFit: "cover" }} />
                        <p>
                            <span>{order.count} x </span> {order.name}
                        </p>
                        <p>Ціна: {Number(order.price) * order.count} UAH</p>
                    </div>
                ))}
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Закрити
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default OrdersAdminPage;
