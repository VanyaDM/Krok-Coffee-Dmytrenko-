import axios from "../axios";
import React, { useEffect } from "react";
import { Col, Row,} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import categories from "../categories";
import "./Home.css";
import { useDispatch, useSelector } from "react-redux";
import { updateProducts } from "../features/productSlice";
import ProductPreview from "../components/ProductPreview";

function Home() {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.products);
    const lastProducts = products.slice(0, 8);
    useEffect(() => {
        axios.get("/products").then(({ data }) => dispatch(updateProducts(data)));
    }, []);
    return (
        <div className="body">
            <div className="homeBanner">
                <img src="https://res.cloudinary.com/krokcoffee/image/upload/v1684948824/mainpictureUA_ju4fj6.png" className="main-picture" />
                 <a class="btn shadow-none " href="/category/продукція">Дізнайтеся Більше</a>
              </div>
            <div className="featured-products-container container mt-4">
                <h2>Популярні товари</h2>
                {/* last products here */}
                <div className="d-flex justify-content-center flex-wrap">
                    {lastProducts.map((product) => (
                        <ProductPreview {...product} />
                    ))}
                </div>
                <div>
                    <Link to="/category/продукція" style={{ textAlign: "right", display: "block", textDecoration: "none" }}>
                        Дивитися більше {">>"}
                    </Link>
                </div>
            </div>

            <div className="recent-products-container container mt-4">
                <h2>Оберіть своє</h2>
                <Row>
                    {categories.map((category) => (
                        <LinkContainer to={`/category/${category.name.toLocaleLowerCase()}`}>
                            <Col md={4}>
                                <div style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${category.img})`, gap: "10px" }} className="category-tile">
                                    {category.value}
                                </div>
                            </Col>
                        </LinkContainer>
                    ))}
                </Row>
            </div>
            
        </div>
    );
}

export default Home;
