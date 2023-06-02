import React from "react";
import { Badge, Card } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

function ProductPreview({ _id, name, category, pictures }) {
    return (
        <LinkContainer to={`/product/${_id}`} style={{ cursor: "pointer", width: "13rem", margin: "10px" }}>
            <Card style={{ width: "20rem", margin: "10px" }}>
                <Card.Img variant="top" className="product-preview-img" src={pictures[0].url} style={{ height: "246px", objectFit: "cover" }} />
                <Card.Body style={{fontFamily: "Montserrat"}}>
                    <Card.Title>{name}</Card.Title>
                    <Badge bg="success">{category}</Badge>
                </Card.Body>         
            </Card>
        </LinkContainer>
    );
}

export default ProductPreview;
