import React, { Component } from 'react';
import util from '../util';
// import { connect } from 'react-redux';
// import { fetchProducts } from '../actions/productActions';

export default class Products extends Component {
    render() {
        return (
            <div className="row">
                {
                    this.props.products.map(product => {
                        return <div className="col-md-4" key={product._id}>
                            <div className="thumbnail text-center">
                                <a href="#"  >
                                    <img src={product.image} alt={product.name} />
                                    <p className="product-title">{product.name}</p>
                                </a>
                                <div>
                                    <b className="product-price">{util.formatCurrency(product.price)}</b>
                                    <button className="btn btn-primary" onClick={(e) => this.props.handleAddToCart(e, product)}>Add To Cart</button>
                                </div>
                            </div>
                        </div>
                    })
                }
            </div>
        )
    }
}
// const mapStateToProps = state => ({ products: state.products.item });

// export default connect(mapStateToProps, { fetchProducts })(Products);