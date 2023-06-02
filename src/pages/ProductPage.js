import axios from "../axios";
import React, { useEffect, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { Container, Row, Col, Badge, ButtonGroup, Form, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import SimilarProduct from "../components/SimilarProduct";
import "./ProductPage.css";
import { LinkContainer } from "react-router-bootstrap";
import { useAddToCartMutation } from "../services/appApi";
import ToastMessage from "../components/ToastMessage";

function ProductPage() {
    const { id } = useParams();
    const user = useSelector((state) => state.user);
    const [product, setProduct] = useState(null);
    const [similar, setSimilar] = useState(null);
    const [addToCart, { isSuccess }] = useAddToCartMutation();

    const handleDragStart = (e) => e.preventDefault();
    useEffect(() => {
        axios.get(`/products/${id}`).then(({ data }) => {
            setProduct(data.product);
            setSimilar(data.similar);
        });
    }, [id]);

    if (!product) {
        return <Loading />;
    }
    const responsive = {
        0: { items: 1 },
        568: { items: 2 },
        1024: { items: 3 },
        
    };

    const images = product.pictures.map((picture) => <img className="product__carousel--image" src={picture.url} onDragStart={handleDragStart} />);

    let similarProducts = [];
    if (similar) {
        similarProducts = similar.map((product, idx) => (
            <div className="item" data-value={idx}>
                <SimilarProduct {...product} />
            </div>
        ));
    }

    return (
        <Container className="product-page" style={{ position: "relative" }}>
            <Row>
                <Col lg={6}>
                    <AliceCarousel className="main_carousel" mouseTracking items={images} animationType="fadeout" infinite controlsStrategy="alternate" />
                </Col>
                <Col lg={6} className="pt-4">
                    <h1>{product.name}</h1>
                    <p>
                        <Badge bg="success">{product.category}</Badge>
                    </p>
                    <p className="product__price" style={{fontSize: "20px", fontWeight: "500"}}>{product.price} UAH</p>
                    <p style={{ textAlign: "justify" }} className= "product__description py-3">
                        <strong>Опис: </strong><span>{product.description}</span>
                    </p>
                    {!user && (
                        
                        <LinkContainer to="/login">
                            <Button className="btn btn-outline-dark shadow-none" size="lg" >Бажаєте придбати?</Button>
                            
                        </LinkContainer>
                    )}
                    {user && !user.isAdmin && (
                        <ButtonGroup style={{ width: "90%"}}>
                            <Button className="btn_green shadow-none" size="lg"  onClick={() => addToCart({ userId: user._id, productId: id, price: product.price, image: product.pictures[0].url })}>
                                Додати в Кошик
                            </Button>
                        </ButtonGroup>
                    )}
                    {user && user.isAdmin && (
                        <LinkContainer to={`/product/${product._id}/edit`}>
                            <Button className="btn_orange shadow-none " size="lg" >Редагувати Товар</Button>
                        </LinkContainer>
                    )}
                    {isSuccess && <ToastMessage bg="info" title="Додано в Кошик" body={`${product.name} в Кошику`} />}
                </Col>
            </Row>
            <div className="my-4">
                <h2>Схожі товари</h2>
                <div className="d-flex justify-content-center align-items-center flex-wrap">
                    <AliceCarousel mouseTracking items={similarProducts} responsive={responsive} paddingLeft={50} paddingRight={50} controlsStrategy="alternate" infinite/>
                </div>
            </div>
        </Container>
    );
}

export default ProductPage;
