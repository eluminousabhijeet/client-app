import React, { Component } from 'react';
import util from '../util';
import { connect } from 'react-redux';
import { fetchProducts } from '../actions/productActions';
import { addToCart } from '../actions/cartActions';

class Products extends Component {
    UNSAFE_componentWillMount(){
        this.props.fetchProducts();
    }
    render() {
        return (
            <div className="row">
                {
                    this.props.products.map(product => {
                        return <div className="col-md-4" key={product._id}>
                            <div className="thumbnail text-center">
                                <a href={"http://localhost:3000/product/"+product.slug}  >
                                    <img src={product.image} alt={product.name} />
                                    <p className="product-title">{product.name}</p>
                                </a>
                                <div>
                                    <b className="product-price">{util.formatCurrency(product.price)}</b>
                                    <button className="btn btn-primary" onClick={() => this.props.addToCart(this.props.cartItems, product)}>Add To Cart</button>
                                </div>
                            </div>
                        </div>
                    })
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({ 
    products: state.products.sortedItems,
    sort: state.products.sort,
    cartItems: state.cart.items
});

export default connect(mapStateToProps, { fetchProducts, addToCart })(Products);