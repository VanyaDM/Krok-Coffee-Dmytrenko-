import React from "react";
import { Table, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDeleteProductMutation } from "../services/appApi";
import "./DashboardProducts.css";
import Pagination from "./Pagination";

function DashboardProducts() {
    const products = useSelector((state) => state.products);
    const user = useSelector((state) => state.user);
    // removing the product
    const [deletProduct, { isLoading, isSuccess }] = useDeleteProductMutation();
    function handleDeleteProduct(id) {
        // logic here
        if (window.confirm("Ви впевнені?")) deletProduct({ product_id: id, user_id: user._id });
    }

    function TableRow({ pictures, _id, name, category, price }) {
        return (
            <tr>
                <td>
                    <img src={pictures[0].url} className="dashboard-product-preview" />
                </td>
                <td>{_id}</td>
                <td>{name}<br></br>{category}</td>
                <td>{price} UAH</td>
                <td>
                    <Button onClick={() => handleDeleteProduct(_id, user._id)} disabled={isLoading}>
                        Видалити
                    </Button>
                    <Link to={`/product/${_id}/edit`} className="btn btn-warning">
                        Редагувати
                    </Link>
                </td>
            </tr>
        );
    }

    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th></th>
                    <th>ID Товару</th>
                    <th>Назва Товару</th>
                    <th>Вартість</th>
                </tr>
            </thead>
            <tbody>
                <Pagination data={products} RenderComponent={TableRow} pageLimit={1} dataLimit={5} tablePagination={true} />
            </tbody>
        </Table>
    );
}

export default DashboardProducts;
