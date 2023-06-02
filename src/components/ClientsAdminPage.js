import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import axios from "../axios";
import Loading from "./Loading";
function ClientsAdminPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios
            .get("/users")
            .then(({ data }) => {
                setLoading(false);
                setUsers(data);
            })
            .catch((e) => {
                setLoading(false);
                console.log(e);
            });
    }, []);

    if (loading) return <Loading />;
    if (users?.length == 0) return <h2 className="py-2 text-center">Користувачів ще немає</h2>;

    return (
        <Table responsive striped bordered hover>
            <thead>
                <tr>
                    <th>ID Клієнта</th>
                    <th>Ім'я клієнта</th>
                    <th>Прізвище</th>
                    <th>Телефон</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                    <tr>
                        <td>{user._id}</td>
                        <td>{user.name}</td>
                        <td>{user.lastname}</td>
                        <td>{user.phone}</td>
                        <td>{user.email}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );

    return <div>ClientsAdminPage</div>;
}

export default ClientsAdminPage;
